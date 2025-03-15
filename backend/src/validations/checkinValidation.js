const Joi = require("joi");

exports.validateCheckIn = (data) => {
  const schema = Joi.object({
    bookingId: Joi.number().integer().positive().required(),
    aadhaar: Joi.string()
      .pattern(/^[0-9]{12}$/)
      .required(),
  });

  return schema.validate(data);
};
