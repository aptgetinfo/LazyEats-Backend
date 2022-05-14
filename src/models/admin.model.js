const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const adminSchema = mongoose.Schema(
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
      default: 'admin',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
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

adminSchema.plugin(toJSON);
adminSchema.plugin(paginate);

adminSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

adminSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const admin = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!admin;
};

adminSchema.methods.isPasswordMatch = async function (password) {
  const admin = this;
  return bcrypt.compare(password, admin.password);
};

adminSchema.pre('save', async function (next) {
  const admin = this;
  if (admin.isModified('password')) {
    admin.password = await bcrypt.hash(admin.password, 8);
  }
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
