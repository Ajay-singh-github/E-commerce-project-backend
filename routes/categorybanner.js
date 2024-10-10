var express = require('express')
const upload = require('./multer')
var router = express.Router()
var pool=require("./pool")

router.post('/submit_categorybanner', upload.any(), function (req, res, next) {
    try {
        var filenames=req.files.map((file)=>file.filename)
        pool.query("insert into categorybanner (categoryid,brandid,files)values(?,?,?)", [req.body.categoryid,req.body.brandid,filenames+''], function (error, result) {
            if (error) {
                res.status(200).json({ status: false, message: 'Database Error, Please Contact Database Admin' })
            }
            else {
                res.status(200).json({ status: true, message: 'Poster Uploaded Successfully' })
            }
        })
    } catch (e) {
        res.status(200).json({ status: false, message: 'Server Error...' })
    }
    
})

module.exports=router