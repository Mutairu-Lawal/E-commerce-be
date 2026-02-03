const jwt = require('jsonwebtoken');

const is_Authenticated = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    // check for auth key
    if (!auth) {
      throw new Error();
    }

    //extract the bearer token
    const token = auth.split(' ')[1];

    // verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    // verify if token is valid
    if (!decode) {
      throw new Error();
    }

    req.user = decode;

    next();
  } catch (error) {
    return res.status(401).json({ Status: false, Message: 'Unauthorized' });
  }
};

const is_Authorized = async (req, res, next) => {
  try {
    const { role } = req.user;

    if (role != 'admin') {
      throw new Error();
    }

    next();
  } catch (error) {
    return res.status(403).json({ Status: false, Message: 'forbidden' });
  }
};

module.exports = { is_Authenticated, is_Authorized };
