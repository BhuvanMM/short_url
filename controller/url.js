const shortid = require("shortid")
const URL = require("../models/url")

async function handleUrl(req,res){
    const body = req.body
    if(!body.url) return res.status(400).json({error:"url not found"})
    const shortId = shortid()
    await URL.create({
        shortId:shortId,
        redirectUrl:body.url,
        visitHistory:[]
    })
    return res.render("home",{
        id:shortId
    })

}

async function handleAnalytics(req,res){
    const shortId = req.params.shortId
    const result = await URL.findOne({shortId})
    return res.json({totalclicks:result.visitHistory.length})
}

module.exports={
    handleUrl,handleAnalytics
}