var express = require('express');
var router = express.Router();
var pool = require('./pool');
var upload = require('./multer')

router.post('/submit_product_details', upload.any(), function (req, res) {
    try {

        //console.log("FILESSSSSS",req.files)
        var filenames=req.files.map((file,index)=>file.filename)

        pool.query('insert into productdetails (categoryid, brandid, modelno, description, color, price, offerprice, stock, status, hsncode, picture, productid) values (?,?,?,?,?,?,?,?,?,?,?,?)',
            [ req.body.categoryid,req.body.brandid, req.body.modelno, req.body.description, req.body.color, req.body.price, req.body.offerprice, req.body.stock, req.body.status, req.body.hsncode, filenames+'',req.body.productid], function (error, result) {
                if (error) {
                    res.json({ status: false, message: 'Database Error!' })
                    console.log(error)
                }
                else {
                    res.json({ status: true, message: 'Product Details added successfully!' })
                }
            })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
        console.log(e)
    }
})

router.get('/fetch_product_details', function (req, res) {
    try {
        pool.query('select P.*, (select C.categoryname from category C where C.categoryid = P.categoryid) as categoryname, (select B.brandname from brands B where B.brandid = P.brandid) as brandname, (select Pr.productname from products Pr where Pr.productid = P.productid) as productname from productdetails P', function (error, result) {
            if (error) {
                res.json({ status: false, message: 'Database Error!' })
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

router.post('/update_productdetails_data', function (req, res, next) {
    try {
        pool.query('update productdetails set productid = ?, categoryid = ?, brandid = ?, modelno = ?, description = ?, color = ?, price = ?, offerprice = ?, stock = ?, status = ?, hsncode = ? where productdetailsid = ?',
            [req.body.productid, req.body.categoryid, req.body.brandid, req.body.modelno, req.body.description, req.body.color, req.body.price, req.body.offerprice, req.body.stock, req.body.status, req.body.hsncode, req.body.productdetailsid], function (error, result) {
                if (error) {
                    res.json({ status: false, message: 'Database Error!' })
                }
                else {
                    res.json({ status: true, message: 'Product Details updated successfully!' })
                }
            })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
    }
})

router.post('/update_product_details_picture', upload.single('picture'), function (req, res, next) {
    try {
        pool.query('update productdetails set picture = ? where productdetailsid = ?', [req.file.filename, req.body.productdetailsid], function (error, result) {
            if (error) {
                res.json({ status: false, message: 'Database Error!' })
                console.log(error)
            }
            else {
                res.json({ status: true, message: 'Product Picture updated successfully!' })
            }
        })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
        console.log(e)
    }
})

router.post('/delete_product_details', function (req, res, next) {
    try {
        pool.query('delete from productdetails where productdetailsid = ?', [req.body.productdetailsid], function (error, result) {
            if (error) {
                res.json({ status: false, message: 'Database Error!' })
            }
            else {
                res.json({ status: true, message: 'Product Details deleted successfully!' })
            }
        })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
    }
})

module.exports = router;
