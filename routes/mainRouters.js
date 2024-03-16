const express = require('express');
const axios = require('axios');
const {userModel,transactionModel} = require("../config/db");


const Router = express.Router();
const URL = "https://economy-app.vercel.app";

Router.get("/",(req,res)=>{
    if(req.cookies.name){
        res.redirect("main");
    }else{
        res.render("pages/index.ejs");
    }
   
})


Router.get("/balance",async (req,res)=>{
    if(req.cookies.name){
        try {
            const response = await axios.get(URL+'/api/transact/balance', {
                headers: {
                    Cookie: req.headers.cookie
                }
            });
            // Handle the response
            const balance = response.data.balance;
            res.render("pages/balance.ejs",{
                balance:balance,
            })
        } catch (error) {
            // Handle the error
            console.log(error.message);
            res.status(500).send("Internal server error");
        }
    }
    else{
        res.status(401).send("401 Unauthorized");
    }
    
})
Router.get("/main",async (req,res)=>{
    if(req.cookies.name){
        res.render("pages/main.ejs");
    }
    else{
        res.status(401).send("401 Unauthorized");
    }
})

Router.get("/send",async (req,res)=>{
    if(req.cookies.name){
        try {
            const pastSentTransactions = await transactionModel.find({sender:req.cookies.name});
            const pastReceivedTransactions = await transactionModel.find({receiver:req.cookies.name});
            const pastTransactions = [];
            const Find = (arr,element)=>{
                for(let i = 0; i<arr.length; i++){
                    if(arr[i].name == element){
                        return true;
                    }
                }
                return false;
            };
            pastReceivedTransactions.forEach((transaction)=>{
                if(Find(pastTransactions,transaction.sender)){
                    pastTransactions.find((element)=>{
                        if(element.name == transaction.sender){
                            element.transactions.push(transaction);
                        }
                    })
                }
                else{
                    pastTransactions.push({
                        name:transaction.sender,
                        transactions:[transaction]
                    })
                }
            })
            pastSentTransactions.forEach((transaction)=>{
                if(Find(pastTransactions,transaction.receiver)){
                    pastTransactions.find((element)=>{
                        if(element.name == transaction.receiver){
                            element.transactions.push(transaction);
                        }
                    })
                }
                else{
                    pastTransactions.push({
                        name:transaction.receiver,
                        transactions:[transaction]
                    })
                }
            })
            pastTransactions.forEach((element)=>{
                element.transactions.sort((a,b)=>{
                    return b.date - a.date;
                })
            })
            pastTransactions.sort((a,b)=>{
                return b.transactions[0].date - a.transactions[0].date;
            });

            //debugging
            // for(let i=0;i<pastTransactions.length;i++){
            //     console.log(pastTransactions[i].name);
            //     console.log(pastTransactions[i].transactions);
            // }

            const allUsers = await userModel.find({});
            const Users = allUsers.map((user)=>{
                return user.name;
            })
            res.render("pages/send.ejs",{
                pastTransactions:pastTransactions,
                Users: Users,
                User: req.cookies.name,
                selectedUsers: [],
            });
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal server error");
        }
        

    }else{
        res.status(401).send("401 Unauthorized");
    }
    
    
});

Router.get("/send/:name",async (req,res)=>{
    if(req.cookies.name){
        try {
            const sentTransactions = await transactionModel.find({sender:req.cookies.name,receiver:req.params.name});
            const receivedTransactions = await transactionModel.find({sender:req.params.name,receiver:req.cookies.name});
            const transactions = [...sentTransactions,...receivedTransactions];
            transactions.sort((a,b)=>{
                return b.date - a.date;
            });
            const Find = (arr,element)=>{
                for(let i = 0; i<arr.length; i++){
                    if(arr[i].date.date == element.date.getDate() && arr[i].date.month == element.date.toLocaleString('default',{month: 'long'}) && arr[i].date.year == element.date.getFullYear()){
                        return arr[i];
                    }
                }
            };

            const groupedTranscations = [];
            transactions.forEach((transaction)=>{
                if(Find(groupedTranscations,transaction)){
                    Find(groupedTranscations,transaction).transactions.push(transaction);
                }
                else{
                    groupedTranscations.push({
                        date: {
                            date: transaction.date.getDate(),
                            month: transaction.date.toLocaleString('default',{month: 'long'}),
                            year: transaction.date.getFullYear(),
                        },
                        transactions: [transaction]
                    })
                }
            }
            );
            groupedTranscations.sort((a,b)=>{
                return b.date - a.date;
            });
            groupedTranscations.forEach((element)=>{
                element.transactions.sort((a,b)=>{
                    return b.date-a.date;
                })
            })
            //debugging
            // groupedTranscations.forEach((e)=>{
            //     console.log(e.transactions);
            // })
            
            res.render("pages/sendName.ejs",{
                groupedTransactions:groupedTranscations,
                name:req.params.name,
            });    
        }catch (error) {
            console.log(error.message);
            res.status(500).send("Internal server error");
        }

        
        
    }else{
        res.status(401).send("401 Unauthorized");
    }

})

Router.get("/send/:name/:amount",async (req,res)=>{
    if(req.cookies.name){
        try {
            const reciever = req.params.name;
            const amount = req.params.amount;
            const {data} = await axios.post(URL+"/api/transact/send/"+reciever,{
                amount:amount
            },{
                headers:{
                    Cookie: req.headers.cookie,
                }
            });
            if(data.status === "Success"){
                console.log("success");
                res.redirect("../../../send");
            }
            else{
                res.send(data.message);
            }

            
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal sever error");
        }
    }
    else{
        res.status(401).send("401 Unauthorized");
    }
    
})




module.exports =Router;