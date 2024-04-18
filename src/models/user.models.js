import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    fullName : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    avatar : {
        type : String,    // cloudinary url
        required : true
    },
    coverImage : {
        type : String,    // cloudinary url
    },
    watchHistory : [                           // Array of Video ID's
        {
        type : Schema.Types.ObjectId,
        ref : "Video"
        }
    ],

    password : {
        type : String,
        required : [true, 'Password is required']
    },

    refreshToken : {
        type : String,
        default : ""
    }

}
, {timestamps: true});




// middleware   - It will implement the below just before saving the password
userSchema.pre("save", async function (next) {

    if(!this.isModified("password"))  return next();     

    // if password is modified then hash the password
    this.password = await bcrypt.hash(this.password, 10);
    next();
})


//compare the stored and the input data
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
} 


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(                             //payload , key and expiry time
        {
        _id : this._id,
        email : this.email,
        username : this.username,
        fullName : this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(                    //payload (same as access but less data) , key and expiry time
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}




export const User = mongoose.model("User" , userSchema)