const router= require("express").Router()
require("dotenv").config()

const{ createUser, callBack, socialAuth,homepage,logout}=require("../controller/controller")

router.post("/createUser", createUser)

 router.get("/", homepage)

router.get("/sociallogin",async(req,res)=>{
    // res.redirect("http://localhost:4455/auth/google/")
    res.redirect("http://localhost:4455/auth/facebook/")
})
router.get("/auth/facebook/callback", callBack)

router.get("/auth/facebook", socialAuth)

router.get("/auth/facebook/success", (req,res)=>{
const username=req.user.email
req.session.user={username}
res.json("user authenticated")

})

 router.post("/logOut", logout) 

module.exports=router

