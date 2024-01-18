const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const { isAuth } = require("../utils");
const Order = require("../models/orderModel");
const Product = require('../models/productModel');
const mongoose = require('mongoose');
const moment = require('moment');


const orderRouter = express.Router();



// Function to get monthly profit
const getMonthlyProfit = async (userId) => {
    try {
        // Find products posted by the user
        const userProducts = await Product.find({ user: userId });

        // Get orders associated with those products
        const orderIds = userProducts.flatMap(product => product.orders);
        const orders = await Order.find({ _id: { $in: orderIds } });

        // Calculate monthly profit
        const monthlyProfit = orders.reduce((acc, order) => {
            const month = moment(order.createdAt).format('MMMM YYYY');
            acc[month] = (acc[month] || 0) + order.totalPrice;
            return acc;
        }, {});

        return monthlyProfit;
    } catch (error) {
        console.error('Error calculating monthly profit:', error.message);
        throw new Error('Internal Server Error');
    }
};



// orderRouter.get('/mine', isAuth, expressAsyncHandler(async(req, res)=>{
//     const orders = await Order.find({user: req.params.id});
  
//         res.send(orders);

// })
// );
// const checkProductOwnership = async (req, res, next) => {
//     try {
//         const orderId = req.params.orderId;
//         const userId = req.user._id;

//         const order = await Order.findById(orderId).populate('orderItems.product');

//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         const productsOwnedByUser = order.orderItems.filter(item => item.product.user.toString() === userId.toString());

//         if (productsOwnedByUser.length === 0) {
//             return res.status(403).json({ message: 'You do not have permission to view this order' });
//         }

//         // Add the order to the request object for further processing
//         req.order = order;
//         next();
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal Server Error' });
//     }
// };
orderRouter.get('/all-orders', isAuth, expressAsyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        // Find products posted by the user
        const userProducts = await Product.find({ user: userId });

        // Get orders associated with those products
        const orderIds = userProducts.flatMap(product => product.orders);
        const orders = await Order.find({ _id: { $in: orderIds } });

        res.status(200).send(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error.message);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}));


// New route to get the number of orders
orderRouter.get('/order-count', isAuth, expressAsyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        // Find products posted by the user
        const userProducts = await Product.find({ user: userId });

        // Get orders associated with those products
        const orderIds = userProducts.flatMap(product => product.orders);
        const orderCount = await Order.countDocuments({ _id: { $in: orderIds } });

        res.status(200).send({ orderCount });
    } catch (error) {
        console.error('Error fetching order count:', error.message);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}));

// New route to get the total profit from all orders
orderRouter.get('/total-profit', isAuth, expressAsyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        // Find products posted by the user
        const userProducts = await Product.find({ user: userId });

        // Get orders associated with those products
        const orderIds = userProducts.flatMap(product => product.orders);
        const orders = await Order.find({ _id: { $in: orderIds } });

        // Calculate total profit
        const totalProfit = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        res.status(200).send({ totalProfit });
    } catch (error) {
        console.error('Error calculating total profit:', error.message);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}));


// Route for getting monthly profit
orderRouter.get('/monthly-profit', isAuth, expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        const monthlyProfit = await getMonthlyProfit(userId);
        res.status(200).json(monthlyProfit);
    } catch (error) {
        console.error('Error fetching monthly profit:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}));

// New route for getting all orders created by the user
orderRouter.get('/all', isAuth, expressAsyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId });
        res.status(200).send(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error.message);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}));



orderRouter.get('/:id', isAuth, expressAsyncHandler(async(req, res)=>{
    const order = await Order.findById(req.params.id);
    if(order){
        res.send(order)
    }else{
        res.status(404).send({message:'Order Not Found'});
    }
})
);

// // New route for getting all orders created by the user along with associated products
// orderRouter.get('/all-orders', isAuth, expressAsyncHandler(async (req, res) => {
//     try {
//         const userId = req.user._id;

//         // Find products created by the user
//         const userProducts = await Product.find({ user: userId });

//         // Extract product IDs from user's products
//         const productIds = userProducts.map(product => product._id);

//         // Find orders where product IDs match user's created products
//         const orders = await Order.find({ 'orderItems.product': { $in: productIds } });

//         res.status(200).send(orders);
//     } catch (error) {
//         console.error('Error fetching user orders associated with own products:', error.message);
//         res.status(500).send({ message: 'Internal Server Error' });
//     }
// }));


// final post
// orderRouter.post('/', isAuth,  expressAsyncHandler( async (req, res)=>{

//     const order = new Order({

//         orderItems : req.body.orderItems,
//         user : req.user._id,
//         shipping:req.body.shipping,
//         payment:req.body.payment,
//         itemsPrice:req.body.itemsPrice,
//         taxPrice:req.body.taxPrice,
//         totalPrice:req.body.totalPrice,
        
//     });

//     const createdOrder = await order.save();
//     res.status(201).send({
//         message: 'New Order Created',
//         data: createdOrder
//     });

// })
// );




orderRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
    const orderItems = req.body.orderItems;

    const order = new Order({

        orderItems : req.body.orderItems,
        user : req.user._id,
        shipping:req.body.shipping,
        payment:req.body.payment,
        itemsPrice:req.body.itemsPrice,
        taxPrice:req.body.taxPrice,
        totalPrice:req.body.totalPrice,
        
    });

    const createdOrder = await order.save();

    // Update the products with the order ID
    for (const orderItem of orderItems) {
        const product = await Product.findById(orderItem.product);
        if (product) {
            product.orders.push(createdOrder._id);
            await product.save();
        }
    }

    res.status(201).send({
        message: 'New Order Created',
        data: createdOrder
    });
}));



module.exports = orderRouter;