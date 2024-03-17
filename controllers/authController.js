const {userModel,balanceModel} = require("../config/db");
const bcrypt = require("bcrypt");


const registerController = async(req,res)=>{
    try{
        if(!req.body.name || !req.body.password){
            return res.status(400).send("Name and password are required.");
        }
        const username = String(req.body.name).trim();
        const password = String(req.body.password).trim();
        const existingUser = await userModel.findOne({name:username});
        if(existingUser){
            return res.status(400).send("User already exists.");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const user = new userModel({
            name:username,
            password:hashedPassword
        });
        await user.save();
        const newBalance = new balanceModel({
            name:username,
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

const validateUser = async(req,res)=>{
    try{
        if(req.cookies.name){
            const User = await userModel.findOne({name:req.cookies.name});
            if(User){
                const password = String(req.body.password);
                const validPassword = await bcrypt.compare(password,User.password);
                if(!validPassword){
                    return res.status(400).send({
                        message: "Invalid Password",
                        status: "Failure"
                    });
                }
                return res.status(200).send({
                    message: "Validation Successful",
                    status: "Success"
                })
            }
            else{
                return res.status(400).send({
                    message: "User does not exist",
                    status: "Failure"
                });
            }

        }
        else{
            return res.status(401).send("401 Unauthorized");
        }
    }
    catch(e){
        console.log(e);
        res.status(500).send({
            message: "Internal server error.",
            error: e.message
        });
    }
}
module.exports = {registerController,loginController,validateUser};