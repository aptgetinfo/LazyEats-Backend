const mongoose = require('mongoose');
// const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name Required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'A item must have a cover image'],
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
    timeTaken: {
      type: Number,
      min: [1, 'Time must be above 1 minute'],
      max: [60, 'Time must be below 60 minutes'],
    },
    price: {
      type: Number,
      required: true,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    shop: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
      private: true,
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.plugin(toJSON);
itemSchema.plugin(paginate);

itemSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

itemSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const item = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!item;
};

itemSchema.methods.isPasswordMatch = async function (password) {
  const item = this;
  return bcrypt.compare(password, item.password);
};

itemSchema.pre('save', async function (next) {
  const item = this;
  if (item.isModified('password')) {
    item.password = await bcrypt.hash(item.password, 8);
  }
  next();
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
