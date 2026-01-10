class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Creating Middleware for Error handler

export const errorMiddleware = (err, req, res, next) => {
    let message = err.message || "Internal Server Error";
    let statusCode = err.statusCode || 500;

    // Handle Mongoose Duplicate Key Error (code 11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate field value entered: ${field}. Please use another value!`;
        statusCode = 400;
    }

    // Handle Mongoose Validation Error
    if (err.name === "ValidationError") {
        message = Object.values(err.errors).map(val => val.message).join(", ");
        statusCode = 400;
    }

    return res.status(statusCode).json({
        success: false,
        message: message,
    });
};

export default ErrorHandler;