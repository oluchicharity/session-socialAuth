const express= require("express")
const session= require("express-session")
const passport= require("passport")
// const GoogleStrategy= require("passport-google-oauth2").Strategy
const FacebookStrategy= require("passport-facebook").Strategy
require("./dbconfig/dbconfig")
require("dotenv").config()
const https = require('https')
const fs = require('fs')
const {userModel}= require("./model/model")

const router= require("./router/router")

const app= express()

app.use(express.json())
app.use(session({
    //put these in env
    
    secret:`keyboard cat`,
    resave:false,
    saveUninitialized:false,
    cookie:{secure:false}
})) 

//initialize passport, passport is used to authenticate a user through social
app.use(passport.initialize())
//integrate passport with our session
app.use(passport.session())

// passport.use(new GoogleStrategy({
//     clientID:   process.env.clientID,
//     clientSecret: process.env.clientsecret,
//     callbackURL: process.env.callbackurl,
//     //passReqToCallback   : true
//   },

passport.use(new FacebookStrategy({
    clientID: process.env.facebookAppID,
    clientSecret: process.env.facebookAppSecret,
    callbackURL: process.env.callbackurlFacebook,
    profileFields: ['id', 'displayName', 'photos', 'email'],
    enableProof: true
  },
  async function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
 console.log(profile);
//   async function(accessToken, refreshToken, profile, done) {
    try {
        // Check if the user already exists in your database
       //const{firstName,lastName,gender,passWord}=
        // let user = await userModel.findOne({ email:profile.email});

       let user= await userModel.findOrCreate({ email:profile.email})
        console.log(profile);

        if (user) {

            // User already exists, log them in
            // return done(null, user);

            return cb(null, user);
        } else {
            // User doesn't exist, create a new user
            user = new userModel({
                
                
                email: profile.email,
                firstName:profile.displayName,
                //  lastName: profile.family_name,
                 profilePicture:profile.photos[0].value,
                //  isVerified:profile.verified
                 //gender: profile.gender,
                
                // Add other profile data as needed
            });

            // Save the new user to the database
            await user.save();

            // Log in the newly created user
            // return done(null, user);
            return cb(null, user);
        }
    } catch (error) {
        // return done(error, null);
        return cb(error,null);
    }
}
));

//2 ways to access the information in the cookies
passport.serializeUser(
    // (user,done)=>{
    // return done(null, user);
    (user,cb)=>{
        return cb(null, user);
})

passport.deserializeUser( 
    // (user,done)=>{
    // return done(null, user);
    (user,cb)=>{
        return cb(null, user);
})

app.use(router)

const port= 4455
// // https.createServer({
// //     key:fs.readFileSync('key.pem'),
// //     cert:fs.readFileSync('')
// }app).listen(port,()=>{
//     console.log(`listening on port ${port}`)
// })

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})


