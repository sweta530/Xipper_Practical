const Joi = require("joi");

exports.validateRegister = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
  });

  return schema.validate(data);
};

exports.validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};
