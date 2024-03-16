const express = require('express');
const cookieParser = require('cookie-parser');
const ejs = require("ejs");


const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));

// set the view engine to ejs
app.set('view engine', 'ejs');


app.use("/api/auth",require("./routes/authRouters"));
app.use("/api/transact",require("./routes/transactionRouters"));
app.use("/",require("./routes/mainRouters"));





app.listen(3030,()=>{
    console.log("Server is up and running on port 3030.");
})