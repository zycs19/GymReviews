const joi = require('joi')

module.exports.gymSchema = joi.object({
    gym: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        description: joi.string().required()
    }).required()

});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required(),
        body: joi.string().required()
    }).required()
});