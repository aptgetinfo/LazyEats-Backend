const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const shopSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name Required'],
      trim: true,
    },
    slug: String,
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
    imageCover: {
      type: String,
      required: [true, 'A shop must have a cover image'],
    },
    images: [String],
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    timeAverage: {
      type: Number,
      default: 1,
      min: [1, 'Average Time must be above 1 minute'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ordersTotal: {
      type: Number,
      default: 0,
    },
    ordersTotalAmount: {
      type: Number,
      default: 0,
    },
    offlinePaymentAccepted: {
      type: Boolean,
      default: false,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    operators: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Merchant',
      },
    ],
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

shopSchema.plugin(toJSON);
shopSchema.plugin(paginate);

shopSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

shopSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const shop = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!shop;
};

shopSchema.methods.isPasswordMatch = async function (password) {
  const shop = this;
  return bcrypt.compare(password, shop.password);
};

shopSchema.pre('save', async function (next) {
  const shop = this;
  if (shop.isModified('password')) {
    shop.password = await bcrypt.hash(shop.password, 8);
  }
  next();
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
