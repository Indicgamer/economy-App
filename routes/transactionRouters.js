const express = require('express');
const {getBalance, sendMoneyController,addMoneyController} = require("../controllers/transcationController");

const Router = express.Router();

Router.get("/balance",getBalance);
Router.post("/send/:name/",sendMoneyController);
Router.post("/add/",addMoneyController);

module.exports = Router;