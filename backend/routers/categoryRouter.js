const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const { isAuth, isAdmin } = require('../utils');
const Category = require('../models/categoryModel');

const categoryRouter = express.Router();

categoryRouter.get('/', expressAsyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.status(200).send(categories);
}));

categoryRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const category = new Category({
        name,
        description,
        user: req.user._id,
    });

    const createdCategory = await category.save();
    res.status(201).send({
        message: 'New Category Created',
        data: createdCategory,
    });
}));

categoryRouter.get('/with-products', expressAsyncHandler(async (req, res) => {
    const categories = await Category.find().populate({
        path: 'products',
        populate: {
            path: 'user',
            select: 'name',
        },
    });

    res.status(200).send(categories);
}));



// New route to get a specific category with its associated products
categoryRouter.get('/:categoryId', expressAsyncHandler(async (req, res) => {
    const categoryId = req.params.categoryId;

    // Find the category
    const category = await Category.findById(categoryId);

    if (!category) {
        res.status(404).send({ message: 'Category not found' });
        return;
    }

    // Find products associated with the category
    const products = await Product.find({ category: categoryId }).populate('user', 'name');

    // Add products to the category object
    category.products = products;

    res.status(200).send(category);
}));

module.exports = categoryRouter;
