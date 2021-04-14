import Joi from '@hapi/joi';

export default {
    user:
        Joi.object({
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        }),

    login:
        Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        }),

    storeReport: Joi.any(),
};