export const sendResponse = ({
    res,
    statusCode = 200,
    success = true,
    message = "",
    data = null,
}) => {
    res.status(statusCode).json({
        success,
        message,
        data,
    });
};

export const sendError = ({
    res,
    statusCode = 500,
    message = "Internal Server Error",
}) => {
    res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
};