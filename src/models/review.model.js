const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating can not be empty!'],
      min: 1,
      max: 5,
    },
    order: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order',
      required: [true, 'Review must belong to a order.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    shop: {
      type: mongoose.Schema.ObjectId,
      ref: 'Shop',
      required: [true, 'Review must belong to a shop'],
    },
    items: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Items',
      },
    ],
  },
  {
    timestamps: true,
  }
);

reviewSchema.plugin(toJSON);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
