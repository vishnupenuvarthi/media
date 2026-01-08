export class ApiError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}
export const errorHandler = (err, _req, res, _next) => {
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const payload = {
        message: err.message || 'Internal Server Error',
        ...(err instanceof ApiError && err.details ? { details: err.details } : {})
    };
    if (process.env.NODE_ENV !== 'production') {
        console.error(err);
    }
    res.status(statusCode).json(payload);
};
