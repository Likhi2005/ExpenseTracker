import { sendError } from '../utils/apiResponse.js';

export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        return sendError({
            res,
            statusCode: 400,
            message: result.error.issues.map((err) => err.message).join(', '),
        });
    }
    req.validated = result.data;
    next();
}