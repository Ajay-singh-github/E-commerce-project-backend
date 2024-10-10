var express = require('express')
const upload = require('./multer')
var router = express.Router()
var pool=require("./pool")

router.post('/submit_banner', upload.any(), function (req, res, next) {
    try {
        var filenames=req.files.map((file)=>file.filename)
        pool.query("insert into banner (files)values(?)", [filenames+''], function (error, result) {
            if (error) {
                res.status(200).json({ status: false, message: 'Database Error, Please Contact Database Admin' })
            }
            else {
                res.status(200).json({ status: true, message: 'Poster Uploaded Successfully' })
            }
        })
    } catch (e) {
        console.log(e)
        res.status(200).json({ status: false, message: 'Server Error...' })
    }
})

router.get('/fetch_all_banner', function (req, res, next) {
    try {
        pool.query("select * from banner", function (error, result) {
            if (error) {
                res.status(200).json({ status: false, message: 'Database Error , Please Contact Database Admin' })
            }
            else {
                res.status(200).json({ data: result, status: true, message: 'success' })
            }
        })
    }
    catch (e) {
        res.status(200).json({ message: 'Server Error', status: false })
    }
})


module.exports = router