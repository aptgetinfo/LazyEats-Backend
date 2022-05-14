const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { orderTypes } = require('../config/orders');

const orderSchema = mongoose.Schema(
  {
    shop: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    transaction: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Transaction',
      required: true,
    },
    status: {
      type: String,
      enum: [orderTypes.WAITING, orderTypes.RECEIVED, orderTypes.PREPARING, orderTypes.DELIVERED, orderTypes.CANCELED],
      default: orderTypes.WAITING,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(toJSON);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
