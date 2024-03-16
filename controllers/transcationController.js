const {balanceModel,transactionModel} = require("../config/db");

const getBalance = async(req,res)=>{
    try {
        const balance = await balanceModel.findOne({name:req.cookies.name});
        if(!balance){
            return res.status(400).send("User does not exist.");
        }
        res.status(200).send({
            balance: balance.amount
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Internal server error.",
            error: e.message
        });
    }
}

const sendMoneyController = async(req,res)=>{
    try {
        const sender = await balanceModel.findOne({name:req.cookies.name});
        if(!sender){
            return res.status(400).send({
                message: "User does not exist.",
                status: "Failure"
            });
        }
        const receiver = await balanceModel.findOne({name:req.params.name});
        if(!receiver){
            return res.status(400).send({
                message: "Receiver does not exist.",
                status: "Failure"
            });
        }
        const senderBalance = parseInt(sender.amount);
        const sendingAmount = parseInt(req.body.amount);
        if(senderBalance< sendingAmount){
            return res.status(200).send({
                message: "Insufficient balance.",
                status: "Faiure"
            });
        }
        if(sendingAmount<=0){
            return res.status(200).send({
                message: "Invalid amount.",
                status: "Faiure"
            });
        }
        sender.amount -= sendingAmount;
        receiver.amount += sendingAmount;
        const transaction = new transactionModel({
            sender: req.cookies.name,
            receiver: req.params.name,
            amount: sendingAmount,
            date: new Date(),
            status: "success"
        });
        await sender.save();
        await receiver.save();
        await transaction.save();
        res.status(200).send({
            message: "Amount sent successfully.",
            status: "Success"
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Internal server error.",
            status: "Failure",
            error: e.message
        });
    }
}

const addMoneyController = async(req,res)=>{
    try {
        const user = await balanceModel.findOne({name:req.cookies.name});
        if(!user){
            return res.status(400).send("User does not exist.");
        }
        user.amount += req.body.amount;
        await user.save();
        res.status(200).send("Amount added successfully.");
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Internal server error.",
            error: e.message
        });
    }
}




module.exports = {getBalance,sendMoneyController,addMoneyController};