const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { queryTypes } = require('../config/querys');

const supportSchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order',
      required: [true, 'Query must belong to a order.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Query must belong to a user'],
    },
    shop: {
      type: mongoose.Schema.ObjectId,
      ref: 'Shop',
      required: [true, 'Query must belong to a shop'],
    },
    query: {
      type: String,
      required: [true, 'Query can not be empty!'],
    },
    type: {
      type: String,
      enum: [queryTypes.ORDER, queryTypes.PAYMENT, queryTypes.PLATFORM],
      required: true,
    },
    isSolved: {
      type: Boolean,
      default: false,
    },
    timeAsked: {
      type: Date,
      default: Date.now,
    },
    timeSolved: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

supportSchema.plugin(toJSON);

const Support = mongoose.model('Support', supportSchema);

module.exports = Support;
