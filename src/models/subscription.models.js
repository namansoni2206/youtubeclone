import mongoose,{ Schema } from "mongoose";

// to find the subscribers of a channel , we will find the count of docs where channel is the id of the channel (unique doc will be maintained for each channel-subscriber relation)

// to find a user subscribed to how many channels - just select a subscriber with that user and then count the channel number  

const subscriptionSchema = new Schema ({
    subscriber : {
        type : Schema.Types.ObjectId ,     // one who is subscribing
        ref : "User"
    },

    channel : {
        type : Schema.Types.ObjectId ,     // one to whom is subscribing
        ref : "User"
    }

} , {timestamps : true})


export const Subscription = mongoose.model("Subscription" , subscriptionSchema)