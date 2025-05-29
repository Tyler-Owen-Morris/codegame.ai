const validateRequest = (req, res, next) => {
    try {
        // Basic request validation
        if (req.method === 'POST' || req.method === 'PUT') {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({
                    error: 'Request body is required',
                    message: 'POST and PUT requests must include a request body',
                });
            }
        }

        // Sanitize inputs (basic XSS prevention)
        if (req.body) {
            req.body = sanitizeObject(req.body);
        }

        if (req.query) {
            req.query = sanitizeObject(req.query);
        }

        next();
    } catch (error) {
        res.status(400).json({
            error: 'Request validation failed',
            message: error.message,
        });
    }
};

const sanitizeObject = (obj) => {
    const sanitized = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            // Basic XSS prevention
            sanitized[key] = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
};

module.exports = validateRequest; 