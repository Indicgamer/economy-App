const express = require('express');
const { registerController,loginController } = require('../controllers/authController');

const Router = express.Router();

Router.post("/register",registerController);
Router.post("/login",loginController);


module.exports = Router;