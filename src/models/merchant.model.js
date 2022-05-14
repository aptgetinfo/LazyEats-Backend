const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const merchantSchema = mongoose.Schema(
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
    image: {
      type: String,
      trim: true,
    },
    shop: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Merchant must belong to a Shop'],
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
      default: 'merchant',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isVerified: {
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

merchantSchema.plugin(toJSON);
merchantSchema.plugin(paginate);

merchantSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

merchantSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const merchant = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!merchant;
};

merchantSchema.methods.isPasswordMatch = async function (password) {
  const merchant = this;
  return bcrypt.compare(password, merchant.password);
};

merchantSchema.pre('save', async function (next) {
  const merchant = this;
  if (merchant.isModified('password')) {
    merchant.password = await bcrypt.hash(merchant.password, 8);
  }
  next();
});

const Merchant = mongoose.model('Merchant', merchantSchema);

module.exports = Merchant;
