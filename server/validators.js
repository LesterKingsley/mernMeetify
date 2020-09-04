const Joi = require("@hapi/joi");

const registerValidator = (data) => {
  const Schema = Joi.object({
    username: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });
  return Schema.validate(data);
};

const logInValidator = (data) => {
  const Schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
  });
  return Schema.validate(data);
};

const apmtValidator = (data) => {
  const Schema = Joi.object({
    name: Joi.string().min(1).max(300).required(),
    descript: Joi.string().min(6).max(1000).required(),
    dateOfMeeting: Joi.date().min("now").required(),
    participants: Joi.array().items(Joi.string()).required(),
  });
  return Schema.validate(data);
};

module.exports.registerValidator = registerValidator;
module.exports.logInValidator = logInValidator;
module.exports.apmtValidator = apmtValidator;
