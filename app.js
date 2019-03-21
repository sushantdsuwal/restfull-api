const express = require("express");
const app = express();
const morgan = require("morgan"); //middleware
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://sushantdsuwal:' + process.env.MONGO_ATLAS_PW + '@rest-shop-ffzpu.mongodb.net/test?retryWrites=true', {
  useNewUrlParser: true
})

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Cross - Origin Resource Sharing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //aviable for all
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  //browser will always send an option req first when you send post||put .. request
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});


const appRoute = function (path, route) {
  const BASE_URL = "/v1/api/";
  return app.use(BASE_URL + path, route)
}

// Routes which should handle requests
appRoute('products', productRoutes);
appRoute('orders', orderRoutes)


app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
