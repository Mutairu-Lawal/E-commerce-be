const STATUS_CODE = {
  200: 'OK',
  201: 'Created',
  204: 'Deleted',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
};

const RESPONSE = async (
  res,
  resCode,
  message = null,
  token = null,
  data = null
) => {
  const finalMessage = message ?? STATUS_CODE[resCode];

  if (token) {
    return res.status(resCode).json({
      status: true,
      token,
    });
  }

  if (data) {
    return res.status(resCode).json({
      status: true,
      data,
    });
  }

  return res.status(resCode).json({
    status: resCode < 400,
    message: finalMessage,
  });
};

module.exports = RESPONSE;
