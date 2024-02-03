const joi = require("joi")
const {userModel}= require("../model/model")
const bcrypt= require("bcrypt")

exports. homepage= async(req,res)=>{
try {
    if(req.session.user){
        const user= await userModel.findOne({email:req.session.user.username})
    res.json(`welcome to my session Auth Api ${user.firstName} ${user.lastName}`)}
    else{
        res.json(`youre not authenticated, please login to perform this action`)}
} catch (error) {
    res.send(error.message)
}
}


exports. createUser= async (req,res)=>{
    try {
        //validate users
        const validateSchema= joi.object({
            firstName:joi.string().required().min(3).regex(/^[a-zA-Z]+$/).messages({
                "String.pattern.base":"Kindly fill alphabets alone"
            }),
            lastName:joi.string().required().min(3).regex(/^[a-zA-Z]+$/).messages({
                "String.pattern.base":"Kindly fill alphabets alone"
            }),
            passWord:joi.string().required().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).messages({
                "String.pattern.base":"password must contain upperCase, lowerCase, number and special character "
            }),
            email:joi.string().email().required(),
            gender:joi.string().valid("male","female")
        })
     const data={
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        gender:req.body.gender,
        passWord:req.body.passWord
     }
     //validate data

     const validator=validateSchema.validate(data)

     const {error}= validator

     if (error){
        console.log(error.message)
     }

     //hash password

     const salt = await bcrypt.genSalt(12);
     const hashedPassword = await bcrypt.hash(data.passWord, salt);
     
    data.passWord= hashedPassword
    const user= await userModel.create(data)
    

    res.status(200).json({message:"user has been created successfully", user})
    } catch (error) {
        res.status(500).json(error.message)
    }
}

exports.login=async(req,res)=>{
    try {
        const {email,passWord}= req.body
        const checkUser= await userModel.findOne({email})
        if(!checkUser){
           return res.json(`user does not exist`)
        }

        const checkPassword= await bcrypt.compare(passWord, checkUser.passWord)
        if(!checkPassword){
            return res.json(`password does not match`)
        }
        const username= checkUser.email
  //session
  req.session.user={username}
       return  res.status(200).json({message:"login successfull", checkUser })
    } catch (error) {
        return res.send(error.message)
    }
}

//we downloaded express-session and required in server.js



exports.logout= async(req,res)=>{
    try {
  req.session.destroy()
  res.json({message:`you have been logged out`})
    } catch (error) {
        res.send(error.message)
    }
   

}
//google authentication 
// const passport= require("passport")

// //this on is redirecting user to google
// exports.socialAuth= passport.authenticate("google",{scope:["email", "profile"]})

//  //redirect the user back to my application
// exports.callBack= passport.authenticate("google",{

//   //if the authenticatiom is successful
//     successRedirect:"/auth/google/success",
//     //if the authentication fails
//      failureRedirect:"/auth/google/failure"
// })

//facebook
// const passport= require("passport")

// //this on is redirecting user to google
// exports.socialAuth= passport.authenticate("facebook",{scope:['user_friends', 'manage_pages']})

//  //redirect the user back to my application
// exports.callBack= passport.authenticate("facebook",{

//   //if the authenticatiom is successful
//     successRedirect:"/auth/facebook/success",
//     //if the authentication fails
//      failureRedirect:"/auth/facebook/failure"
// })
const passport = require("passport");

// Define the strategy name as a constant
const FACEBOOK_STRATEGY = 'facebook';

// Redirect the user to Facebook for authentication
exports.socialAuth = passport.authenticate(FACEBOOK_STRATEGY, { scope: ['user_friends', 'manage_pages'] });

// Redirect the user back to your application after authentication
exports.callBack = passport.authenticate(FACEBOOK_STRATEGY, {
    // If the authentication is successful
    successRedirect: "/auth/facebook/success",
    // If the authentication fails
    failureRedirect: "/auth/facebook/failure"
});
