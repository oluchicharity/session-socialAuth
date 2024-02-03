const mongoose= require("mongoose")

mongoose.connect(`mongodb+srv://agbakwuruoluchi29:ilmaw5oRyBIKQ2DB@cluster0.wqncxtt.mongodb.net/sessionAuthentication`).then(()=>{
  console.log(`connected to mongoose `)
}).catch((err)=>{
  console.log(err.message)
})