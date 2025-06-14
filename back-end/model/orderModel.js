// models/Order.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
}, { _id: false });

const DeliveryAddressSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine: { type: String, required: true },
  ward: { type: String },
  district: { type: String },
  city: { type: String }
}, { _id: false });

const OrderSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },

  items: { type: [OrderItemSchema], required: true },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },

  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'failed', 'refunded'],
    default: 'unpaid'
  },

  paymentMethod: {
    type: String,
    enum: ['COD', 'momo', 'zalopay', 'credit_card'],
    default: 'COD'
  },

  deliveryMethod: {
    type: String,
    enum: ['grab', 'ghn', 'shop-delivery'],
    default: 'shop-delivery'
  },

  deliveryAddress: { type: DeliveryAddressSchema, required: true },

  deliveryFee: { type: Number, default: 0 },
  totalProductAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },

  notes: { type: String },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
