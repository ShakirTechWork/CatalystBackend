class CatalystError extends Error {
    constructor(
        public httpStatusCode: number,
        public catalystStatusCode: number,
        public userMessage: string = "Something went wrong. Please try again later.",
        public clientMessage: string = "Internal server error.",
    ) {
        super(clientMessage);
        this.name = 'CatalystError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export default CatalystError;
