const mongoose = require("mongoose");
require("dotenv").config();

const dbURL = process.env.DATABASE_URL;

try {
    (async ()=>{
        await mongoose.connect(dbURL);
    })();
} catch (error) {
    console.log(error.message);
    
}


const users = new mongoose.Schema({
    name:String,
    password: String
},{collection: "users"});

const userModel = mongoose.model("user",users);

const balance = new mongoose.Schema({
    name: String,
    amount: Number,
},{collection:"balance"});

const balanceModel = mongoose.model("balance",balance);

const transaction = new mongoose.Schema({
    sender: String,
    receiver: String,
    amount: Number,
    date: Date,
    status: String
},{collection:"transactions"});

const transactionModel = mongoose.model("transaction",transaction);


module.exports = {userModel,balanceModel,transactionModel};