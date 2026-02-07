// test/auth.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // your Express app
require('dotenv').config();

// --------------------------------------------------------------------
// Configuration
// --------------------------------------------------------------------
const TEST_DB_URL = 'mongodb://localhost:27017/test-db';
const BASE_URL = '/api/v1/';

// --------------------------------------------------------------------
// DB helpers
// --------------------------------------------------------------------
/**
 * Connect to the test DB.
 */
async function connectDB() {
  try {
    await mongoose.connect(TEST_DB_URL);
    console.log('Connected to test DB');
  } catch (err) {
    console.error('DB connection error:', err);
    process.exit(1);
  }
}

/**
 * Remove all data from collections that we will touch.
 */
async function clearDatabase() {
  const User = require('../models/users');
  await User.deleteMany({});
  console.log('DB cleared');
}

/**
 * Close the Mongoose connection.
 */
async function closeDB() {
  await mongoose.connection.close();
  console.log('DB connection closed');
}

// --------------------------------------------------------------------
// Test data
// --------------------------------------------------------------------
const registerTestCases = [
  {
    // 1️⃣ Happy-path admin
    data: {
      name: 'SUPERUSER',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'admin',
    },
    expected: {
      code: 201,
      Status: true,
      Message: 'User created successfully',
    },
  },
  {
    // 2️⃣ Happy-path customer
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password@123',
      role: 'customer',
    },
    expected: {
      code: 201,
      Status: true,
      Message: 'User created successfully',
    },
  },
  {
    // 3️⃣ Password too short / missing complexity
    data: {
      name: 'Bad Password',
      email: 'bad.password@example.com',
      password: 'Passw',
    },
    expected: {
      code: 422,
      Status: false,
      Message: undefined,
    },
  },
  {
    // 4️⃣ Happy-path customer (no explicit role)
    data: {
      name: 'No Role',
      email: 'no.role@example.com',
      password: 'Password@123',
    },
    expected: {
      code: 201,
      Status: true,
      Message: 'User created successfully',
    },
  },
];

const loginValidData = {
  name: 'SUPERUSER',
  email: 'admin@example.com',
  password: 'Admin@123',
  role: 'admin',
};

const loginInvalidData = {
  email: 'nonexistent@example.com',
  password: 'AnyPassword@123',
};

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------
describe('Server health check', () => {
  it('GET / → returns the welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Welcome to the E-commerce Backend API');
  });
});

describe('Auth routes', () => {
  clearDatabase();

  // --------------------------------------------------------------
  // Register
  // --------------------------------------------------------------
  describe(`POST ${BASE_URL}auth/register`, () => {
    test.each(registerTestCases)('register %j', async ({ data, expected }) => {
      const res = await request(app)
        .post(`${BASE_URL}auth/register`)
        .send(data);

      expect(res.status).toBe(expected.code);
      expect(res.body.Status).toBe(expected.Status);

      if (expected.Message !== undefined) {
        if (Array.isArray(expected.Message)) {
          expect(Array.isArray(res.body.Message)).toBe(true);
        } else {
          expect(res.body.Message).toBe(expected.Message);
        }
      }
    });

    it('should return 422 when the request body is empty', async () => {
      const res = await request(app).post(`${BASE_URL}auth/register`).send({});

      expect(res.status).toBe(422);
      expect(res.body.Status).toBe(false);
    });
  });

  // --------------------------------------------------------------
  // Login
  // --------------------------------------------------------------
  describe(`POST ${BASE_URL}auth/login`, () => {
    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post(`${BASE_URL}auth/login`)
        .send(loginInvalidData);

      expect(res.status).toBe(400);
      expect(res.body.Status).toBe(false);
      expect(res.body.Message).toBe('Invalid Credentials');
    });

    it('should succeed with valid credentials and return a token', async () => {
      await request(app).post(`${BASE_URL}auth/register`).send(loginValidData);

      const res = await request(app).post(`${BASE_URL}auth/login`).send({
        email: loginValidData.email,
        password: loginValidData.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.Status).toBe(true);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
    });
  });

  // --------------------------------------------------------------
  // Protected route (GET /me)
  // --------------------------------------------------------------
  describe(`GET ${BASE_URL}auth/me`, () => {
    let token;

    beforeAll(async () => {
      await request(app).post(`${BASE_URL}auth/register`).send(loginValidData);

      const res = await request(app).post(`${BASE_URL}auth/login`).send({
        email: loginValidData.email,
        password: loginValidData.password,
      });

      token = res.body.token;
    });

    it('should reject requests without a token', async () => {
      const res = await request(app).get(`${BASE_URL}auth/me`);
      expect(res.status).toBe(401);
      expect(res.body.Status).toBe(false);
    });

    it('should reject requests with an invalid token', async () => {
      const res = await request(app)
        .get(`${BASE_URL}auth/me`)
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.status).toBe(401);
      expect(res.body.Status).toBe(false);
    });

    it('should return user info with a valid token', async () => {
      const res = await request(app)
        .get(`${BASE_URL}auth/me`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.Status).toBe(true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('email', loginValidData.email);
    });
  });
});

// --------------------------------------------------------------------
// Global DB lifecycle
// --------------------------------------------------------------------
beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});
