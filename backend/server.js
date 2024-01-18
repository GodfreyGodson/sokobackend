const express = require("express");
const data = require('./data.js');
const mongoose = require("mongoose");
const path = require('path');
const cors = require('cors');
const { MONGO_DB_CONFIG } = require("./config/app.config.js");
// Import the userRouter using require
const userRouter = require("./routers/userRouter.js");
const orderRouter = require("./routers/orderRouter.js");
const categoryRouter = require("./routers/categoryRouter.js");

const productRouter = require("./routers/productRouter.js");
const app = express();


mongoose.Promise = global.Promise;
mongoose
  .connect(MONGO_DB_CONFIG.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database connected");
    },
    (error) => {
      console.log("Database can't be connected: " + error);
    }
  );

  app.use(express.json());
  // app.use("/uploads", express.static("uploads"));

app.use(cors());
// Use the userRouter without destructuring
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

app.use((req, res, next) => {
  console.log(`Received request for: ${req.method} ${req.url}`);
  next();
});

// app.use('/uploads', express.static(path.join(__dirname, 'uploads/products')));
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// app.get('/uploads/products/:filename', (req, res) => {
//   const filename = req.params.filename;
//   res.sendFile(path.join(__dirname, 'uploads', 'products', filename));
// });

// app.use("/uploads", express.static("uploads/products"));
// app.use("/uploads", express.static("uploads"));
// app.get("/api/products", (req, res) => {
//   res.send(data.products);
// });

// app.get("/api/products/:id", (req, res) => {
//   const product = data.products.find((x) => x._id === req.params.id);

//   if (product) {
//     res.send(product);
//   } else {
//     res.status(404).send({ message: 'Product not found' });
//   }
// });

app.use((err, req, res, nex)=>{

  const status = err.name && err.email === 'ValidationError'? 400: 500;
  res.status(status).send({message: err.message});

});

app.listen(5000, () => {
  console.log('server at http://localhost:5000');
});
