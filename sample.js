//index.js
const express = require("express")
const urlRoute = require("./routes/url")
const {handleConnect} = require("./connect/connection")
const URL = require("./models/url")
const staticRoute = require("./routes/staticRouter")
//for ejs
const path = require("path")

const app = express();
const port = 3000

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))

//connect database
handleConnect("mongodb://127.0.0.1:27017/short-url-1")
.then(()=>console.log('mongoDB started'))
.catch((err)=>console.log('error-->'+err))

//setup of server side rendering
app.set("view engine","ejs");
app.set("views",path.resolve('./views'))

app.use("/url",urlRoute)
app.use("/",staticRoute)



app.get("/url/:shortId",async(req,res)=>{
    const shortId = req.params.shortId
    const entry = await URL.findOneAndUpdate({shortId}, {
        $push:{ visitHours :{timestamps : Date.now()}}
    })
    return res.redirect(entry.redirectUrl);
})

app.use("/url/analytics/:shortId",urlRoute);


app.listen(port,()=>console.log(`server started at port:${port}`))

//static router
const express = require("express")

const router = express.Router();

router.get("/",(req,res)=>{
    return res.render("home")
})

module.exports = router;

//home.ejs
/*
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home page</title>
</head>
<body>
    <h1>URL SHORTNER</h1>
    <form method="POST" action="/url">
        <label>Enter URL:</label>
        <input type="text" placeholder="https://example.com" name="url">
        <button type="submit">Submit</button>
    </form>
    <% if (locals.id) { %>
     <p>URL generated is http://localhost:3000/url/<%= id %></p>
    <% } %>
</body>
</html> 

//url models
const mongoose = require("mongoose")

const urlSchema = new mongoose.Schema({
    shortId:{
        type:String,
        required:true,
        unique:true
    },
    redirectUrl:{
        type:String,
        required:true
    },
    visitHours:[{timestamps:{type:Number}}]
},{timestamps:true});

const URL = mongoose.model("urls",urlSchema);

module.exports=URL;

//routes
const express = require("express")
const { handleurl, handleAnalytics } = require("../controller/url")

const router = express.Router()

router.post('/',handleurl)
router.get('/analytics/:shortId',handleAnalytics);

module.exports = router;

//controller
const express = require("express")
const shortid = require("shortid")
const URL = require("../models/url")

async function handleurl(req,res){
    const body = req.body;
    if(!body.url) return res.status(400).json({error:"url not found"})
    const shortId = shortid()
    await URL.create({
        shortId:shortId,
        redirectUrl:body.url,
        visitHours:[]
    })

    return res.render("home",{
        id:shortId,
    })
}

async function handleAnalytics(req,res){
    const shortId = req.params.shortId
    const result = await URL.findOne({shortId})
    return res.json({totalclicks:result.visitHours.length})
}

module.exports={
    handleurl,handleAnalytics,
} */