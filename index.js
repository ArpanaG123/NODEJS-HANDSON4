const express = require("express");
const auth = require("./route/auth")
const app = express();
app.use(express.json());
app.use('/auth',auth)

app.get('/',(req,res)=>{
    res.send("working!!");
})

app.listen(7000,()=>{
    console.log("Server is connect to 7000...");
})