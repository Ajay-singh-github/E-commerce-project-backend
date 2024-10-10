var express = require('express')
var router = express.Router()
var pool = require('./pool')
var upload = require('./multer')

router.post('/submit_products', upload.single('picture'), function (req, res, next) {
    try {
        console.log('product', req.body)
        pool.query("insert into products(productname, brandid, categoryid,picture) values(?,?,?,?)", [req.body.productname, req.body.brandid, req.body.categoryid, req.file.filename], function (error, result) {
            if (error) {
                console.log(error)
                res.status(200).json({ status: false, message: 'Database Error , Pls contact database Admin' })
            }
            else {
                res.status(200).json({ status: true, message: 'product submitted successfully' })
            }
        })
    } catch (e) {
        res.status(200).json({ status: false, message: 'Server Error...' })
    }
})

router.post('/fetch_products_by_brands', function (req, res, next) {
    try {
        pool.query("select * from products where categoryid=? and brandid=?",[req.body.categoryid,req.body.brandid],function (error, result) {
            if (error) {
                console.log(error)
                res.status(200).json({ status: false, data: 'Database Error , Please Contact Database Admin' })
            }
            else {
                console.log("xxxxxxxxxxxxx",result)
                res.status(200).json({ status: true, data: result })
            }
        })
    } catch (e) {
        res.status(200).json({ status: false, data: 'server Error...' })
    }
})




router.get('/display_all_products', function (req, res, next) {
    try {
        pool.query("select products.*,category.categoryname,brands.brandname from products,category,brands where products.categoryid=category.categoryid and products.brandid=brands.brandid", function (error, result) {
            if (error) {
                res.status(200).json({ status: false, data: 'Database Error , Please Contact Database Admin' })
            }
            else {
                res.status(200).json({ status: true, data: result })
            }
        })
    } catch (e) {
        res.status(200).json({ status: false, data: 'server Error...' })
    }
})

router.post('/edit_product_picture', upload.single('picture'), function (req, res, next) {
    try {
        pool.query("update products set picture=? where productid=?", [req.file.filename, req.body.productid], function (error, result) {
            if (error) {
                console.log(error)
                res.status(200).json({ status: false, message: 'Database Error , Please Contact Database Admin' })
            }
            else {
                res.status(200).json({ status: true, message: 'Picture Uploaded Successfully' })
            }
        })
    } catch (e) {
        res.status(200).json({ status: false, message: 'server Error...' })
    }
})

router.post('/edit_product', function (req, res, next) {
    try {
        pool.query("update products set productname=?,categoryid=?,brandid=? where productid=?", [req.body.productname, req.body.categoryid, req.body.brandid, req.body.productid], function (error, result) {
            if (error) {
                console.log(error)
                res.status(200).json({ status: false, message: 'Database Error , Please Contact Database Admin' })
            }
            else {
                res.status(200).json({ status: true, message: 'Product Edit Successfully' })
            }
        })
    } catch (e) {
        res.status(200).json({ status: false, message: 'Server Error....' })
    }
})

router.post('/delete_product', function (req, res, next) {
    try {
        pool.query("delete from products where productid=?", [req.body.productid], function (error, result) {
            if (error) {
                res.status(200).json({ status: false, message: 'Database Error , Please Contact Database Admin' })
            }
            else {
                res.status(200).json({ status: true, message: 'Product Deleted Successfully' })
            }
        })
    } catch (e) {
        res.status(200).json({ status: false, message: 'server error...' })
    }
})

module.exports = router;