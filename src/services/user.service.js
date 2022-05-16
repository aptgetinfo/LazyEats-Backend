const httpStatus = require('http-status');
const sharp = require('sharp');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const resizeUserPhoto = async (userId, file) => {
  const filename = `user-${userId}-${Date.now()}.jpeg`;
  await sharp(file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/users/${filename}`);
  return filename;
};

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (await User.isPhoneTaken(userBody.phone)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone already taken');
  }
  if (await User.isRegisterTaken(userBody.registerNumber)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Register Number already taken');
  }
  return User.create(userBody);
};

const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

const getUserById = async (id) => User.findById(id);

const getUserByEmail = async (email) => User.findOne({ email });
// const getUserByPhone = async (phone) => User.findOne({ phone });
// const getUserByRegister = async (registerNumber) => User.findOne({ registerNumber });

const updateUserById = async (userId, updateBody, file) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (updateBody.phone && (await User.isPhoneTaken(updateBody.phone, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone already taken');
  }
  if (updateBody.registerNumber && (await User.isRegisterTaken(updateBody.registerNumber, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Register Number already taken');
  }
  if (file) {
    updateBody.image = await resizeUserPhoto(file);
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
