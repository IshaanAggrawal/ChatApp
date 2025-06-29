const mongoose=require('mongoose')

const schema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true,
    },
    profilePic:{
        type:String,
        default:""
    },
    description:{
        type:String,
        default:"Hey I am a ChatterBox !"
    }
},{timestamps:true});
const User = mongoose.model('User', schema);
module.exports=User