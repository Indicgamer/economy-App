const {userModel,balanceModel} = require("../config/db");
const bcrypt = require("bcrypt");


const registerController = async(req,res)=>{
    try{
        if(!req.body.name || !req.body.password){
            return res.status(400).send("Name and password are required.");
        }
        const existingUser = await userModel.findOne({name:req.body.name});
        if(existingUser){
            return res.status(400).send("User already exists.");
        }
    
        const password = String(req.body.password);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const user = new userModel({
            name:req.body.name,
            password:hashedPassword
        });
        await user.save();
        const newBalance = new balanceModel({
            name:req.body.name,
            amount: 100
        });
        await newBalance.save();
        res.cookie("name",req.body.name);
        res.redirect("../../main");
    }
    catch(e){
        console.log(e);
        res.status(500).send({
            message: "Internal server error.",
            error: e.message
        });
    }
    
}

const loginController = async(req,res)=>{
    try {
        if(!req.body.name || !req.body.password){
            return res.status(400).send("Name and password are required.");
        }
        const user = await userModel.findOne({name:req.body.name});
        if(!user){
            return res.status(400).send("User does not exist.");
        }
        const password = String(req.body.password);
        const validPassword = await bcrypt.compare(password,user.password);
        if(!validPassword){
            return res.status(400).send("Invalid password.");
        }
        res.cookie("name",req.body.name);
        res.redirect("../../main");
        // res.status(200).send("Login successful.");
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Internal server error.",
            error: e.message
        });
    }
}

module.exports = {registerController,loginController};