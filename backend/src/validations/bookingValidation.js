const Joi = require("joi");

exports.validateBooking = (data) => {
  const schema = Joi.object({
    userId: Joi.number().integer().positive().required(),
    hotelId: Joi.number().integer().positive().required(),
    roomId: Joi.number().integer().positive().required(),
    checkIn: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required(), // YYYY-MM-DD format
    checkOut: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required(),
    guests: Joi.number().integer().min(1).required(),
  });

  return schema.validate(data);
};
