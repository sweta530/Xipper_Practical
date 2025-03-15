const API_SUCCESS = 1;
const API_ERROR = 0;
/**
 *  get success response with its flag 0 or 1
 * @param {Object} res Http Response
 * @param {Object} data response data
 * @param {String} message success response message
 * @param {Number} status response status
 */
const successResponse = (res, data, message = "", status) => {
  res.send({
    success: API_SUCCESS,
    status: status,
    message: message,
    data: data,
  });
};
/**
 *  get error response with its flag 0 or 1
 * @param {Object} res Http Response
 * @param {Object} error error
 * @param {String} message error response message
 * @param {Number} status response status
 */
const errorResponse = (res, error, message = "", status) => {
  res.send({
    success: API_ERROR,
    status: status,
    message: message,
    error: error,
  });
};

const catchResponse = (res, responseError, message, status) => {
  res.status(500).send(errorResponse(res, responseError, message, status));
};

const validationErrorResponse = (res, error, message, status) => {
  res.status(400).send(errorResponse(res, error, message, status));
};

const unauthorizedErrorResponse = (res, error, message, status) => {
  res.status(401).send(errorResponse(res, error, message, status));
};

const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

const getFileExtension = (fileName) => {
  let items = fileName.split(/\.(?=[^.]+$)/);
  if (items.length === 2) {
    return items[1];
  }
  return "";
};

module.exports = {
  successResponse,
  errorResponse,
  catchResponse,
  validationErrorResponse,
  unauthorizedErrorResponse,
  isEmpty,
  getFileExtension,
};
