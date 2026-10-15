const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    brand: String,
    thumbnail: String,
    price: Number,
    originalPrice: Number,
    quantity: Number,
    size: String,
    color: String,
}, { _id: false });

const timelineStepSchema = new mongoose.Schema({
    stage: String,   // 'Ordered' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out for delivery' | 'Delivered'
    at: Date,
    location: String,
    done: Boolean,
    current: Boolean,
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    address: {
        label: String, fullName: String, phone: String,
        line1: String, line2: String, city: String, state: String, pincode: String,
    },
    delivery: { id: String, label: String, days: String, fee: Number, note: String },
    payment: {
        id: String,
        label: String,
        status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
        razorpayOrderId: String,
        razorpayPaymentId: String,
        paidAt: Date,
    },
    coupon: { code: String, value: Number },
    totals: {
        subtotal: Number, discount: Number, couponDiscount: Number,
        deliveryFee: Number, tax: Number, codFee: Number, total: Number,
    },
    status: {
        type: String,
        enum: ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled', 'Returned'],
        default: 'Placed',
    },
    timeline: [timelineStepSchema],
    trackingNumber: String,
    partner: String,
    estimatedDelivery: Date,
    invoiceNumber: String,
    cancelledAt: Date,
    cancelReason: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);