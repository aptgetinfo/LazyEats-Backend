const Joi = require('joi');
// const customJoi = Joi.extend(require('joi-phone-number'));
const { password, objectId, phoneNumber } = require('./custom.validation');

exports.createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    phoneNumber: Joi.string().required().custom(phoneNumber),
    registerNumber: Joi.string().required().length(15),
    password: Joi.string().required().custom(password),
    role: Joi.string().required().valid('user'),
  }),
};

exports.getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

exports.getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

exports.updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      email: Joi.string().email(),
      phoneNumber: Joi.string().required().custom(phoneNumber),
      registerNumber: Joi.string().required().length(15),
      password: Joi.string().custom(password),
      address: Joi.object.keys({
        street: Joi.string(),
        houseNumber: Joi.string(),
        landmark: Joi.string(),
      }),
    })
    .min(1),
};

exports.deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
