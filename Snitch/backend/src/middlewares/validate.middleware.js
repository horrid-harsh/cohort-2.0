import ApiError from "../utils/ApiError.js";

/**
 * Higher-order middleware to validate requests using Zod schemas
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    const formattedErrors = {};
    const issues = error.issues || error.errors || [];
    
    issues.forEach((err) => {
      const field = err.path[0];
      if (!formattedErrors[field]) {
        formattedErrors[field] = err.message;
      }
    });

    throw new ApiError(422, "Validation failed", formattedErrors);
  }
};
