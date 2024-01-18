// const mongoose = require('mongoose');


// const orderSchema = new mongoose.Schema(

//     {
//         orderItems: [
//             {
//                 name : {type: String, required: true},
//                 image : {type: String, required: true},
//                 price : {type: String, required: true},
//                 qty : {type: String, required: true},
//                 product : {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required:true},

//             },
//         ],

//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//             required:true
//         },

//         shipping:{
//             address: String,
//             city: String,
//             postalCode: String,
//             country: String,
//         },

//         payment:{
//             paymentMethod: String,
//             paymentResult: {
//                 orderID:String,
//                 payerID:String,
//                 paymentID:String,
//             },
//         },

//         itemsPrice:Number,
//         taxPrice:Number,
//         totalPrice:Number,
//         // shippingPrice:Number,
//         isPaid: {

//             type:Boolean,
//             required: true,
//             default:false

//         },

//         paidAt: Date,


//         isDelivered: {

//             type:Boolean,
//             required: true,
//             default:false

//         },

//         deliveredAt: Date
        
        
       
//     },

//     {
//         timestamps: true,
//     }


// ) ;



// const Order = mongoose.model('Order', orderSchema);
// module.exports = Order;





const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            name: { type: String, required: true },
            image: { type: String, required: true },
            price: { type: String, required: true },
            qty: { type: String, required: true },
            product: { type: mongoose.Schema.Types.Mixed, ref: 'Product', required: true },
        },
    ],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    shipping: {
        address: String,
        city: String,
        postalCode: String,
        phone: String,
        country: String,
    },

    payment: {
        paymentMethod: String,
        paymentResult: {
            orderID: String,
            payerID: String,
            paymentID: String,
        },
    },

    itemsPrice: Number,
    taxPrice: Number,
    totalPrice: Number,
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: Date,
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
