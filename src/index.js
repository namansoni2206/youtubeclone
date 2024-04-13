import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path : './env'
});

// require('dotenv').config({path:'./env'});


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