enum CatalystStatusCodes {
    // 1xx - Informational Errors
    USER_NOT_AUTHENTICATED = 1001,
    SESSION_EXPIRED = 1002,

    // 2xx - Success Codes
    DATA_PROCESSED_SUCCESSFULLY = 2001,
    ITEM_CREATED_SUCCESSFULLY = 2002,

    // 4xx - Client Errors
    INVALID_INPUT = 4001,
    RESOURCE_NOT_FOUND = 4002,
    ACCESS_DENIED = 4003,
    DUPLICATE_ENTRY = 4004,
    VALIDATION_FAILED = 4005,

    // 5xx - Server Errors
    INTERNAL_SERVER_ERROR = 5001,
    DATABASE_ERROR = 5002,
    SERVICE_UNAVAILABLE = 5003,
    GATEWAY_TIMEOUT = 5004
}

export default CatalystStatusCodes;
