export class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ApiResponse {
  static success(res, statusCode = 200, message = "Success", data = null) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, statusCode = 500, message = "Error", errors = []) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}
