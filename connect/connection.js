const mongoose = require("mongoose")

async function handleConnection(url){
    return mongoose.connect(url);
}

module.exports={
    handleConnection
}