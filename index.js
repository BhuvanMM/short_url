const express = require("express")
const URL = require("./models/url")
const {handleConnection} = require("./connect/connection")
const urlRoute = require("./routes/url")
const path = require("path")
const staticRoute = require("./routes/staticRouter")

//connection to MongoDB
handleConnection("mongodb://127.0.0.1:27017/short-url-1")
.then(()=>console.log("MongoDB started success"))
.catch((err)=>console.log("error --->"+err))


const app = express();
const port = 3000;

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))


//routes
app.use("/url",urlRoute)
app.use("/url/analytics/:shortId",urlRoute)
app.use("/",staticRoute)

//ejs setup
app.set("view engine","ejs")
app.set("views",path.resolve('./views'))


app.get("/url/:shortId",async(req,res)=>{
    const shortId = req.params.shortId
    const entry = await URL.findOneAndUpdate({shortId},{
        $push:{visitHistory:{
            timestamp:Date.now()
        }}
    })
    return res.redirect(entry.redirectUrl)
})

app.listen(port,()=>console.log(`server started at port ${port}`))