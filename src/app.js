import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))


// json data handle
app.use(express.json({limit : "16kb"}))

// url handling as url is different for different browsers   /  extended : true - objects ke andr objects bhi rakh sakte hai
app.use(express.urlencoded({extended : true , limit : "16kb"}))


//in case agr koi image file rakhni ho
app.use(express.static("public"))


//handling cookies
app.use(cookieParser())


//Routes
import userRouter from "./routes/user.routes.js"



// Routes declaration
app.use("/api/v1/users", userRouter)


export {app}