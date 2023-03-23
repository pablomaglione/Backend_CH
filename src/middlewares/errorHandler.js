import { ERRORS_ENUM } from "../errors/enums.js";

export const errorHandler = (error, req, res, next) => {
  console.log(`ERROR: ${error}`);

  const errorMessage = ERRORS_ENUM[error.name] || "Unhandled error";

  res.send({
    status: "Error",
    error: errorMessage,
  });
};