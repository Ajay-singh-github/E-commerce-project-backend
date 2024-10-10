var express = require('express');
var router = express.Router();
var pool = require('./pool');
var upload = require('./multer')

router.post('/submit_brand', upload.single('logo'), function (req, res) {
    try {
        pool.query('insert into brands (brandname, categoryid, logo) values (?,?,?)', [req.body.brandname, req.body.category, req.file.filename], function (error, result) {
            if (error) {
                res.json({ status: false, message: 'Database Error!' })
                console.log(error)
            }
            else {
                res.json({ status: true, message: 'Brand added successfully!' })
            }
        })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
    }
})

router.get('/fetch_brands', function (req, res) {
    try {
        pool.query('select B.*, (select C.categoryname from category C where C.categoryid = B.categoryid) as categoryname from brands B', function (error, result) {
            if (error) {
                res.json({ status: false, message: 'Database Error!' })
                console.log(error)
            }
            else {
                res.json({ status: true, brandsData: result })
            }
        })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
    }
})

router.post('/update_brand_data', function (req, res, next) {
    try {
        pool.query('update brands set brandname = ?, categoryid = ? where brandid = ?', [req.body.brandname, req.body.categoryid, req.body.brandid], function (error, result) {
            if (error) {
                res.json({ status: false, message: 'Database Error!' })
            }
            else {
                res.json({ status: true, message: 'Brand updated successfully!' })
            }
        })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
    }
})

router.post('/update_brand_logo', upload.single('logo'), function (req, res, next) {
    try {
        pool.query('update brands set logo = ? where brandid = ?', [req.file.filename, req.body.brandid], function (error, result) {
            if (error) {
                res.json({ status: false, message: 'Database Error!' })
                console.log(error)
            }
            else {
                res.json({ status: true, message: 'Brand updated successfully!' })
            }
        })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
        console.log(e)
    }
})

router.post('/delete_brand', function (req, res, next) {
    try {
        pool.query('delete from brands where brandid = ?', [req.body.brandid], function (error, result) {
            if (error) {
                res.json({ status: false, message: 'Database Error!' })
            }
            else {
                res.json({ status: true, message: 'Brand deleted successfully!' })
            }
        })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
    }
})

router.post('/fetch_brands_by_category', function (req, res) {
    try {
        pool.query('select B.*, (select C.categoryname from category C where C.categoryid = B.categoryid) as categoryname from brands B where B.categoryid=?',[req.body.categoryid], function (error, result) {
            if (error) {
                res.json({ status: false, message: 'Database Error!' })
                console.log(error)
            }
            else {
                res.json({ status: true, data: result })
            }
        })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
    }
})


module.exports = router;
