import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req,res) => {
    res.status(200).json({
        message : "ok" 
    })
})

// const registerUser = async (req,res)=>{
//     res.send("Hello From user controller")
// }

export { registerUser };
