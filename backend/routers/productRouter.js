
// const uploadImage = require('../middlewares/imageUploads.js');
// const uploadProduct = require('../middlewares/uploadProduct');
// const uploadImage1 = require('../middlewares/image1Uploads.js');

// const express = require('express');
// const expressAsyncHandler = require('express-async-handler');
// const { isAuth } = require('../utils');
// const Product = require('../models/productModel');
// const Category = require('../models/categoryModel');
// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/products");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });

// const fileFilter = (req, file, callback) => {
//   const acceptableExt = [".png", ".jpg", ".jpeg"];
//   const extname = path.extname(file.originalname).toLowerCase();
  
//   if (!acceptableExt.includes(extname)) {
//     return callback(new Error("Only .png, .jpg, and .jpeg formats are allowed"));
//   }

//   const fileSize = parseInt(req.headers["content-length"]);
//   if (fileSize > 1048576) {
//     return callback(new Error("File size is too big (max: 1 MB)"));
//   }

//   callback(null, true);
// };

// // Initialize multer with the configured storage and fileFilter
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter
// });

// const productRouter = express.Router();

// // Use multer middleware for handling file uploads
// productRouter.post('/', isAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image1', maxCount: 1 }]), expressAsyncHandler(async (req, res) => {
//   const { name, category, description, price, countInStock } = req.body;

//   try {
//     // Check if the category field is provided
//     if (!category) {
//       throw new Error('Category is required');
//     }

//     // Check if the category already exists
//     const categoryObject = await Category.findOne({ name: category });

//     // If the category does not exist, return an error
//     if (!categoryObject) {
//       res.status(404).send({ message: 'Category not found' });
//       return;
//     }

//     const product = new Product({
//       name,
//       category: categoryObject._id, // Use the category ID
//       description,
//       price,
//       countInStock,
//       user: req.user._id,
//       image: req.files['image'][0].filename, // Access the uploaded file name
//       image1: req.files['image1'][0].filename,
//     });

//     const createdProduct = await product.save();

//     // Update the products array in the associated category
//     categoryObject.products.push(createdProduct._id);
//     await categoryObject.save();

//     res.status(201).send({
//       message: 'New Product Created',
//       data: createdProduct,
//     });
//   } catch (error) {
//     res.status(400).send({ message: error.message });
//   }
// }));




const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const { isAuth } = require('../utils');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, callback) => {
  const acceptableExt = [".png", ".jpg", ".jpeg"];
  const extname = path.extname(file.originalname).toLowerCase();
  
  if (!acceptableExt.includes(extname)) {
    return callback(new Error("Only .png, .jpg, and .jpeg formats are allowed"));
  }

  const fileSize = parseInt(req.headers["content-length"]);
  if (fileSize > 1048576) {
    return callback(new Error("File size is too big (max: 1 MB)"));
  }

  callback(null, true);
};

// Initialize multer with the configured storage and fileFilter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

const productRouter = express.Router();

// Use multer middleware for handling file uploads
productRouter.post('/', isAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image1', maxCount: 1 }]), expressAsyncHandler(async (req, res) => {
  const { name, category, description, price, countInStock } = req.body;

  try {
    // Check if the category field is provided
    if (!category) {
      throw new Error('Category is required');
    }

    // Check if the category already exists
    const categoryObject = await Category.findOne({ name: category });

    // If the category does not exist, return an error
    if (!categoryObject) {
      res.status(404).send({ message: 'Category not found' });
      return;
    }

    const imagePath =req.files['image'][0].path.replace(/\\/g, "/"); // Format the image path

    const product = new Product({
      name,
      category: categoryObject._id, // Use the category ID
      description,
      price,
      countInStock,
      user: req.user._id,
      // image: imagePath, // Use the formatted image path
      // image1: req.files['image1'][0].path.replace(/\\/g, "/"), 
      image: "/" +  imagePath  ,
      image1: "/" + req.files['image1'][0].path.replace(/\\/g, "/") // Format the second image path
    });

    const createdProduct = await product.save();

    // Update the products array in the associated category
    categoryObject.products.push(createdProduct._id);
    await categoryObject.save();

    res.status(201).send({
      message: 'New Product Created',
      data: createdProduct,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}));

// GET endpoint to fetch products posted by the authenticated user
productRouter.get('/my-products', isAuth, expressAsyncHandler(async (req, res) => {
  try {
    // Fetch products for the current user
    const userProducts = await Product.find({ user: req.user._id });

    res.status(200).send({
      message: 'User Products Retrieved',
      data: userProducts,
    });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
}));


// New route to get the number of user products
productRouter.get('/product-count', isAuth, expressAsyncHandler(async (req, res) => {
  try {
    // Fetch products for the current user
    const userProducts = await Product.find({ user: req.user._id });

    const productCount = userProducts.length;

    res.status(200).send({ productCount });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
}));




// // Endpoint to fetch the image by filename
// productRouter.get('/images/:filename', (req, res) => {
//     const filename = req.params.filename;
//     // Assuming you store images in a directory called 'uploads'
//     const imagePath = path.join(__dirname, '../uploads/', filename);

//     res.sendFile(imagePath);
// });


// productRouter.post('/', isAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image1', maxCount: 1 }]), expressAsyncHandler(async (req, res) => {
//     const { name, category, description, price, countInStock } = req.body;

//     // Check if the category field is provided
//     if (!category) {
//         res.status(400).send({ message: 'Category is required' });
//         return;
//     }

//     // Check if the category already exists
//     const categoryObject = await Category.findOne({ name: category });

//     // If the category does not exist, return an error
//     if (!categoryObject) {
//         res.status(404).send({ message: 'Category not found' });
//         return;
//     }

//     const product = new Product({
//         name,
//         category: categoryObject._id, // Use the category ID
//         description,
//         price,
//         countInStock,
//         user: req.user._id,
//         image: req.files['image'][0].filename, // Access the uploaded file name
//         image1: req.files['image1'][0].filename,
//     });

//     const createdProduct = await product.save();

//     // Update the products array in the associated category
//     categoryObject.products.push(createdProduct._id);
//     await categoryObject.save();

//     // Construct image paths based on your project structure
//     const imagePath = path.join(__dirname, '../uploads/', createdProduct.image);
//     const imagePath1 = path.join(__dirname, '../uploads/', createdProduct.image1);

//     res.status(201).send({
//         message: 'New Product Created',
//         data: {
//             ...createdProduct._doc,
//             imagePath,
//             imagePath1,
//         },
//     });
// }));



// productRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
//     const { name, category, description, image, image1, price, countInStock } = req.body;

//     // Check if the category field is provided
//     if (!category) {
//         res.status(400).send({ message: 'Category is required' });
//         return;
//     }

//     // Check if the category already exists
//     const categoryObject = await Category.findOne({ name: category });

//     // If the category does not exist, return an error
//     if (!categoryObject) {
//         res.status(404).send({ message: 'Category not found' });
//         return;
//     }

//     const product = new Product({
//         name,
//         category: categoryObject._id, // Use the category ID
//         description,
//         image,
//         image1,
//         price,
//         countInStock,
//         user: req.user._id,
//     });

//     const createdProduct = await product.save();
    
//     // Update the products array in the associated category
//     categoryObject.products.push(createdProduct._id);
//     await categoryObject.save();

//     res.status(201).send({
//         message: 'New Product Created',
//         data: createdProduct,
//     });
// }));



productRouter.get('/', expressAsyncHandler(async (req, res) => {
    try {
        const productsWithCategories = await Product.find().populate('category', 'name');
        res.status(200).send(productsWithCategories);
    } catch (error) {
        console.error('Error fetching products with categories:', error.message);
        res.status(500).send({ message: 'Internal Server Error' });
    }
}));


productRouter.get("/:id", expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;

    // Find the product using the Product model
    const product = await Product.findById(productId);

    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product not found' });
    }
}));

// productRouter.get('/all', expressAsyncHandler(async (req, res) => {
//     try {
//         const productsWithCategories = await Product.find().populate({
//             path: 'category',
//             select: 'name', // Only select the 'name' field from the category
//         });

//         // Map the result to replace 'category' with 'category.name' in each product
//         const mappedProducts = productsWithCategories.map(product => ({
//             ...product.toObject(),
//             category: product.category ? product.category.name : 'Uncategorized', // Replace 'category' with 'category.name'
//         }));

//         res.status(200).send(mappedProducts);
//     } catch (error) {
//         console.error('Error fetching products with categories:', error.message);
//         res.status(500).send({ message: 'Internal Server Error' });
//     }
// }));
module.exports = productRouter;