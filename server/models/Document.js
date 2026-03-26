import mongoose from "mongoose";

const qaHistorySchema = new mongoose.Schema({
    question : {
        type : String,
        required : true 
    },
    answer : {
        type : String,
        required : true
    },
    timestamp : {
        type : Date,
        default : Date.now
    }
})

const documentSchema = new mongoose.Schema({
    filename : {
        type : String,
        required : true
    },
    user : { // taki hme pta rhe ki ye pdf ya document kis user ka h 
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    extractedText : {
        type : String, 
        required : true
    },
    summary : {
        type : String
    },
    qaHistory : [qaHistorySchema] // ye isiliye taki us pdf se related sare question bhi show ho
},{
    timestamps : true
});

const Document = mongoose.model('Document', documentSchema);
export default Document;