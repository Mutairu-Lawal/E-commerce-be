const jwt = require('jsonwebtoken');

const checkAuth = async (req, res, next) => {
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

module.exports = checkAuth;
