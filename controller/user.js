const USER = require("../models/user")

async function handleSignup(req,res){
    const {username,email,password} = req.body
    await USER.create({
        username,
        email,
        password
    });

    return res.render("home")
}

async function handleLogin(req,res){
    const {email,password} = req.body
    const result = await USER.findOne({email,password})
    if(!result) return res.render('login',{error:"invalid email or password"})
    return res.redirect("/")
}


module.exports = {
    handleSignup,handleLogin
}