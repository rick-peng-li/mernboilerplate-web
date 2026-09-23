export function validateRequest(schema) {
    return async (req, _res, next) => {
        try {
            const parsedBody = await schema.parseAsync(req.body);
            req.validatedBody = parsedBody;
            next();
        } catch (error) {
            next(error);
        }
    };
}
