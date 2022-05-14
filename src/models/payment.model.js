const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { paymentTypes, paymentStatusTypes } = require('../config/payments');

const paymentSchema = mongoose.Schema(
  {
    shop: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Shop',
      required: true,
    },
    userFrom: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    userTo: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Order',
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      enum: [paymentTypes.CASH, paymentTypes.UPI, paymentTypes.DEBIT, paymentTypes.CREDIT],
    },
    paymentStatus: {
      type: String,
      enum: [
        paymentStatusTypes.PENDING,
        paymentStatusTypes.SUCCESS,
        paymentStatusTypes.FAILED,
        paymentStatusTypes.CANCELED,
        paymentStatusTypes.REQUEST,
        paymentStatusTypes.REFUNDED,
      ],
      default: paymentStatusTypes.PENDING,
    },
    amount: {
      type: Number,
      required: true,
    },
    timeInitialized: {
      type: Date,
    },
    timeCompleted: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.plugin(toJSON);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
