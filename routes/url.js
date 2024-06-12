const express = require("express")
const {handleUrl, handleAnalytics} = require("../controller/url");

const router = express.Router();

router.post("/",handleUrl)
router.get("/analytics/:shortId",handleAnalytics)

module.exports = router;