// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     category: { type: String, required: true },
//     description: { type: String, required: true },
//     image: { type: String, required: true },
//     image1: { type: String, required: true },
//     price: { type: Number, required: true },
//     rating: { type: Number, default: 4.5 },
//     numbReviews: { type: Number, default: 0 },
//     countInStock: { type: Number, default: 0 },
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },

// }, {
//     timestamps: true,
// });

// const Product = mongoose.model('Product', productSchema);
// module.exports = Product;



const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    image1: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 4.5 },
    numbReviews: { type: Number, default: 0 },
    countInStock: { type: Number, default: 0 },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],


}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
