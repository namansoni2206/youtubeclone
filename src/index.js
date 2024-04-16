import connectDB from "./db/index.js";
import dotenv from "dotenv";
import express from "express"
import {app} from "./app.js"

// const app = express()   // don't use this as we need to import the app.js

dotenv.config({
    path : './env'
});

// require('dotenv').config({path:'./env'});

// app.get("/", (req, res) => {
//     res.send("Hello, world!"); // Or any other response you want to send
//   });


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})






/*


;(async()=>{
    try {
        await mongoose.connect('${process.env.MONGODB_URI}/${DB_NAME}')
        app.on("error",(error)=>{
            console.log("ERROR : can not connect to database")
        })
    } catch (error) {
        console.error("ERROR" , error)
    }
})()
*/