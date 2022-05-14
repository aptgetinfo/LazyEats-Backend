const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { orderTypes } = require('../config/orders');

const orderSchema = mongoose.Schema(
  {
    shop: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Shop',
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    payment: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Payment',
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    items: [
      {
        itemID: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Item',
          required: true,
        },
        quantity: {
          type: Number,
          min: [1, 'Quantity must be above 1'],
          required: true,
        },
      },
    ],
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
    timeReceived: {
      type: Date,
    },
    timePrepared: {
      type: Date,
    },
    timeDelivered: {
      type: Date,
    },
    timeCanceled: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(toJSON);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
