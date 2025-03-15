const Joi = require("joi");

exports.validateHotel = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    location: Joi.string().min(3).max(100).required(),
  });

  return schema.validate(data);
};
