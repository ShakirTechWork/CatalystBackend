import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // Log the error

    // Default to a 500 Internal Server Error if no status is provided
    const statusCode = err.statusCode || 500;
    const userErrorMessage = err.userMessage || "Something went wrong!.";
    const clientErrorMessage = err.message || "Internal server error!";
    const errorCode = err.errorCode || 'UNKNOWN_ERROR';

    // Send the error response
    res.status(statusCode).json({
        userErrorMessage,
        clientErrorMessage,
        errorCode,
    });
};
