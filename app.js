const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { API_VERSION } = require("./constants");

const app = express();

//import routings
const authRoutes = require("./router/auth");
const userRoutes = require("./router/user");
const serviceRoute = require("./router/route");

//configure body parse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//configure static folder
app.use(express.static("uploads"));

//configure Header HTTP - CORS
app.use(cors());

//configure routtings
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, serviceRoute);

module.exports = app;
