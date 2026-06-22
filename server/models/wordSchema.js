import mongoose from "mongoose";

const wordSchema = new mongoose.Schema({
    category:{type:String,required:true,index:true},
    citizenWord:{type:String,required:true},
    imposterWord:{type:String,required:true},
    hint:{type:String,required:true}
})

export default mongoose.model("words",wordSchema)