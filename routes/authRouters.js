const express = require('express');
const { registerController,loginController,validateUser } = require('../controllers/authController');

const Router = express.Router();

Router.post("/register",registerController);
Router.post("/login",loginController);
Router.post("/validateUser",validateUser);

module.exports = Router;