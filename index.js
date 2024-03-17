const express = require('express');
const cookieParser = require('cookie-parser');
const ejs = require("ejs");
const path = require('path');
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 3030;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set("views",path.join(__dirname, "views"));
console.log(path.join(__dirname, "views"));


app.use("/api/auth",require("./routes/authRouters"));
app.use("/api/transact",require("./routes/transactionRouters"));
app.use("/",require("./routes/mainRouters"));





app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})