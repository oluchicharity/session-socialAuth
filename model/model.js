const mongoose= require("mongoose")

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
        
    },
   email:{
        type:String,
        unique:true
    },
    gender:{
        type:String, 
    },
    //dont put password to be required
    passWord:{
        type:String,
    }
    ,
    profilePicture:{
        type:String,  
    }
    ,
    isVerified:{
        type:Boolean,   
    }
    

},{timestamps:true})

const userModel= mongoose.model("sessionAuth", userSchema)


module.exports={userModel}