const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name Required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email Required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone Number Required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!value.match('[0-9]{10}')) {
          throw new Error('Please provide a valid phone number');
        }
      },
    },
    registerNumber: {
      type: String,
      required: [true, 'Registration Number Required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      houseNumber: {
        type: String,
        trim: true,
      },
      landmark: {
        type: String,
        trim: true,
      },
    },
    image: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password Required'],
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isRegisterVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      private: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  if (user.isEmailVerified === false) {
    await user.remove();
    return false;
  }
  return !!user;
};

userSchema.statics.isPhoneTaken = async function (phone, excludeUserId) {
  const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
  if (user.isPhoneVerified === false) {
    await user.remove();
    return false;
  }
  return !!user;
};

userSchema.statics.isRegisterTaken = async function (registerNumber, excludeUserId) {
  const user = await this.findOne({ registerNumber, _id: { $ne: excludeUserId } });
  if (user.isRegisterVerified === false) {
    await user.remove();
    return false;
  }
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.getOtp = function () {
  const otpSecret = speakeasy.generateSecret();
  this.temp_secret = otpSecret.base32;
  return speakeasy.totp({
    secret: this.temp_secret,
    encoding: 'base32'
  });
};

userSchema.methods.matchOtp = async function (otp) {
  return await speakeasy.totp.verify({
    secret: this.temp_secret,
    encoding: 'base32',
    token: otp,
    window: 10,
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
