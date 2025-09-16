import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    address: { type: String },
    service: { type: String, required: true },
    message: { type: String },
    pricing: {
      priceRange: { type: String }, // e.g., "₹500 - ₹800"
      minPrice: { type: Number },
      maxPrice: { type: Number }
    },
    payment: {
      razorpay_payment_id: { type: String },
      razorpay_order_id: { type: String },
      razorpay_signature: { type: String },
      amount: { type: Number },
      status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
    },
    status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
    notification: {
      whatsapp: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
      email: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Booking', BookingSchema);




