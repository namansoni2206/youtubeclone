import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js"
import { User } from "../models/user.models.js";
import {uploadonCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse..js";



// generate the access and refresh token. Here I am creating a method

const generateAccessandRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating tokens")
        
    }
}


// const registerUser = asyncHandler(async (req,res) => {
//     res.status(200).json({
//         message : "Finally Error Resolved" 
//     })
// })

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
    // console.log("email : ",email);

    // 1) for file handling - data - user.routes


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
  //const coverImagePath = req.files?.coverImage[0]?.path;

  //what if cover Image is not given by user , then there is undefined. We will do :-
  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0) 
  {
        coverImageLocalPath = req.files.coverImage[0].path ; 
  }

  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is required")
  }

  // 5) 
  const avatar = await uploadonCloudinary(avatarLocalPath);
  const coverImage = await uploadonCloudinary(coverImageLocalPath);
  
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



// Login User 

const loginUser = asyncHandler( async (req,res)=> {

    // 1) req.data -> data 
    // 2) username or email
    // 3) find the user
    // 4) password check
    // 5) access and refresh tokens
    // 6) send cookie

    // 1)
    const {email,username,password} = req.body;

    // 2)
    if (!username || !email) {
        throw new ApiError(400,"Username or email required")  
    }

    // 3)
    const user = await User.findOne(
        {$or : [ {username},{email}]})

    if(!user){
        throw new ApiError(404,"user does not exist")
    }

    // 4)
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401,"Password is Wrong")  
    }

    // 5) 
    const {accessToken , refreshToken} = await generateAccessandRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // 6)
    const options = {
        httpOnly : true,
        secure : true
    }

    return res.statu(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
            new ApiResponse (200 ,{
            user : loggedInUser,
            accessToken,
            refreshToken
        },
        "User logged In successfully"))

})


const logoutUser = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(req.user._id,
    {
        $set : {
            refreshToken : undefined
        }
    },
    {
        new : true
    }
  )

  const options = {
    httpOnly : true,
    secure : true
   }

   return res.status(200).clearCookie("accessToken" ,options).clearCookie("refreshToken" ,options).json(
    new ApiResponse(200,{},"User logged out successfully")
   )
})

export { registerUser , loginUser , logoutUser };
