
// import mongoose from 'mongoose';

// const orderSchema = new mongoose.Schema({
//   orderNumber: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   user: {
//     _id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     name: {
//       type: String,
//       required: true
//     },
//     email: {
//       type: String,
//       required: true
//     }
//   },
//   shippingInfo: {
//     fullName: { type: String, required: true },
//     address: { type: String, required: true },
//     city: { type: String, required: true },
//     postalCode: { type: String, required: true },
//     country: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: String, required: true }
//   },
//   items: [{
//     product: {
//       _id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'MedicalHardwares',
//         required: true
//       },
//       name: { type: String, required: true },
//       price: { type: Number, required: true },
//       quantity: { type: Number, required: true }
//     },
//     quantity: { type: Number, required: true },
//     price: { type: Number, required: true }
//   }],
//   paymentMethod: {
//     type: String,
//     required: true,
//     enum: ['credit-card', 'bank-transfer']
//   },
//   paymentDetails: {
//     cardLastFour: String,
//     cardBrand: String,
//     cardholderName: String
//   },
//   subtotal: { type: Number, required: true },
//   shipping: { type: Number, required: true, default: 0 },
//   tax: { type: Number, required: true },
//   total: { type: Number, required: true },
//   status: {
//     type: String,
//     required: true,
//     enum: ['processing', 'shipped', 'delivered', 'cancelled'],
//     default: 'processing'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// const Order = mongoose.model('Order', orderSchema);
// export default Order;
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  shippingInfo: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  items: [{
    product: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalHardwares',
        required: true
      },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String } // Add image field
  }],
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit-card', 'bank-transfer', 'cod'] // Add 'cod' to enum
  },
  paymentDetails: {
    cardLastFour: String,
    cardBrand: String,
    cardholderName: String,
    codAmount: Number // Add codAmount for cash on delivery
  },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true, default: 0 },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ orderNumber: 1 })
orderSchema.index({ status: 1 })

const Order = mongoose.model('Order', orderSchema);
export default Order;
