import { Schema, model } from 'mongoose';

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Model',
        required: true,
      },
      brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        validate(value) {
          if (value < 0) {
            throw new Error('Price must be a positive number');
          }
        },
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    validate(value) {
      if (value < 0) {
        throw new Error('Total price must be a positive number');
      }
    },
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  zip: {
    type: Number,
    required: true,
    trim: true,
  },
  phone: {
    type: Number,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = model('Order', OrderSchema);

export default Order;
