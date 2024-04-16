import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import { User } from "../models/user.models.js";
import {uploadonCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse..js";

// const registerUser = asyncHandler(async (req,res) => {
//     res.status(200).json({
//         message : "Finally Error Resolved" 
//     })
// })

// const registerUser = async (req,res)=>{
//     res.send("Hello From user controller")
// }

const registerUser = asyncHandler(async (req,res) => {
    //1)get user details from frontend
    //2)validation - not empty 
    //3)check if user already exists
    //4) check for images , check for avatar
    //5) upload them to cloudinary , avatar
    //6) create user object - create entry in db
    //7) remove password and refresh token field
    //8) check for user creation 
    //9) return response/error



    //1) json data 
    const {fullName,email,username,password} = req.body
    console.log("email : ",email);
    console.log("username : ",username);
    console.log(password);
    console.log(fullName);

    // for file handling - data - user.routes


    // 2) validation    ----- 2 ways 

  // i)  if(fullName === ""){
  //    throw new ApiError(400,"Full Name is Required")
  // }

  // ii)
  if (
    [fullName , email , username , password].some((field) => field?.trim()==="")
  ) {
    throw new ApiError(400,"All fields are required")
  }

  // 3) 
   const existedUser = await User.findOne({
    $or : [ { username } , { email }]
  })

  if(existedUser){
    throw new ApiError(409,"User already exists")
  }

  // 4) images
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImagePath = req.files?.coverImage[0]?.path;

  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is required")
  }

  // 5) 
  const avatar = await uploadonCloudinary(avatarLocalPath);
  const coverImage = await uploadonCloudinary(coverImagePath);
  
  if(!avatar){
    throw new ApiError(400,"Avatar is required")
  }

  // 6)
  const user = await User.create({
    fullName,
    avatar : avatar.url,
    coverImage : coverImage?.url||"",       // if not there then ""
    email,
    username : username.toLowerCase(),
    password
  })

  // 7)
  const createdUser = await User.findById(user._id).select("-password -refreshToken")
  console.log(createdUser);

  // 8)
  if(!createdUser){
    throw new ApiError(500,"Something went wrong while creating user");
  }

  //9)
  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")
  );


});

export { registerUser };