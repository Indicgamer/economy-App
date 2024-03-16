const mongoose = require("mongoose");

(async ()=>{
    await mongoose.connect("mongodb+srv://indic_gamer:admin123@cluster0.3gah2fh.mongodb.net/economy?retryWrites=true&w=majority&appName=Cluster0")
})();

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