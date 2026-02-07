const STATUS_MESSAGES = {
  200: 'OK',
  201: 'Created',
  204: 'Deleted',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  422: 'Unprocessable Entity',
  500: 'Internal Server Error',
};

const sendResponse = ({
  res,
  statusCode,
  message = null,
  data = null,
  token = null,
}) => {
  const response = {
    success: statusCode < 400,
    message: message ?? STATUS_MESSAGES[statusCode],
  };

  if (data !== null) {
    response.data = data;
  }

  if (token !== null) {
    response.token = token;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendResponse,
  STATUS_MESSAGES,
};
