exports.success = (message, results, statusCode) => {
  return {
    message,
    code: statusCode,
    results
  };
};

exports.error = (message, statusCode, errors) => {
  const codes = [200, 201, 400, 401, 404, 403, 422, 500];

  const findCode = codes.find((code) => code == statusCode);

  if (!findCode) statusCode = 500;
  else statusCode = findCode;

  return {
    message,
    code: statusCode,
    error: true,
    errors
  };
};

exports.validation = (errors) => {
  return {
    message: "Validation errors",
    error: true,
    code: 422,
    errors
  };
};

exports.unauth = (errors) => {
  return {
    message: "Authentication Failed",
    error: true,
    code: 401,
    errors
  };
}
