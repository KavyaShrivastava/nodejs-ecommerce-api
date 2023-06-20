import mongoose from "mongoose"

const Schema = mongoose.Schema;

//Generate random numbers for order 

const randomText = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumbers = Math.floor(1000 + Math.random()*90000);

const orderSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [
        {
            type: Object,
            required: true,
        }
    ],
    shippingAddress: {
        type: Object, 
        required: true,
    },
    orderNumber: {
        type: String,
        required: true,
        default: randomText + randomNumbers, 
    },
    //for stripe payment
    paymentStatus: {
        type: String, 
        required: true,
        default: "Not paid",
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'Not Specified',
    },
    currency: {
        type: String, 
        default: "Not specified"
    }, 
    //for admin
    status: {
        type: String, 
        default: "pending",
        enum: ['pending', 'processing', 'shipped', 'delivered'],
    },
    deliveredAt:{
        type: Date,
    }, 
    totalPrice: {
        type: Number,
        default: 0.0,
    }
}, {
    timestamps: true
});

//compile to form model
const Order = mongoose.model('Order', orderSchema);

export default Order;
