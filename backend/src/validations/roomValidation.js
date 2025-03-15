const Joi = require("joi");

exports.validateRoom = (data) => {
  const schema = Joi.object({
    hotelId: Joi.number().integer().positive().required(),
    roomType: Joi.string().min(3).max(50).required(),
    price: Joi.number().positive().required(),
    totalRooms: Joi.number().integer().min(1).required(),
  });

  return schema.validate(data);
};
