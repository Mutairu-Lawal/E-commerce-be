const STATUS_CODE = {
  200: 'ok',
  201: 'created',
  204: 'Deleted',
  400: 'Bad Request',
  401: 'UnAuthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal server Error',
};

const RESPONSE = async (
  res,
  res_code,
  Message = null,
  token = null,
  data = null,
) => {
  switch (Message) {
    case null:
      Message = STATUS_CODE[res_code];
      break;
    default:
      Message = Message;
  }
  if (token) {
    res.status(res_code).json({ Status: true, token });
  } else if (data) {
    res.status(res_code).json({ Status: true, data });
  } else {
    res
      .status(res_code)
      .json({ Status: res_code < 400 ? true : false, Message });
  }
};

module.exports = RESPONSE;
