import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    name: String,
    phone: String,
    location: String,
    photoUrl: String,
    role: { type: String, default: 'CUSTOMER', enum: ['CUSTOMER', 'STAFF', 'ADMIN'] },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);

// Order Schema
const orderItemSchema = new mongoose.Schema({
  itemName: String,
  itemPrice: Number,
  quantity: Number,
  subtotal: Number,
});

const orderSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    status: { type: String, default: 'PENDING', enum: ['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'] },
    total: Number,
    gst: Number,
    grandTotal: Number,
    paymentMethod: { type: String, default: 'UPI' },
    paymentStatus: { type: String, default: 'PENDING', enum: ['PENDING', 'PAID', 'FAILED', 'CANCELLED'] },
    orderType: { type: String, default: 'DINE_IN', enum: ['DINE_IN', 'TAKEAWAY'] },
    tableNumber: String,
    specialNote: String,
    items: [orderItemSchema],
    cashfreeOrderId: String,
    cashfreePaymentId: String,
    cashfreePaymentSessionId: String,
    paymentError: String,
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

// MenuItem Schema
const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    imageUrl: String,
    categoryId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

export const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);

// Table Schema
const tableSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true, unique: true },
    capacity: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Table = mongoose.models.Table || mongoose.model('Table', tableSchema);

// Reservation Schema
const reservationSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    tableId: mongoose.Schema.Types.ObjectId,
    date: Date,
    time: String,
    guests: Number,
    status: { type: String, default: 'CONFIRMED', enum: ['CONFIRMED', 'CANCELLED', 'COMPLETED'] },
  },
  { timestamps: true }
);

export const Reservation = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);
