var express = require('express')
var router = express.Router()
var pool = require('./pool')
var upload = require('./multer')


router.post('/user_submit', function (req, res, next) {
    
    try {
        pool.query("insert into useraccount(username, emailid, mobileno, address, pincode) values(?,?,?,?,?)", [req.body.username, req.body.emailid, req.body.mobileno, req.body.address,req.body.pincode], function (error, result) {
            if (error) {
                console.log(error)
                res.status(200).json({ status: false, message: 'Database Error , Pls contact database Admin' })
            }
            else {
                res.status(200).json({ status: true, message: 'User Data submitted successfully' })
            }
        })
    } catch (e) {
        res.status(200).json({ status: false, message: 'Server Error...' })
    }
})

router.post('/check_account', function (req, res, next) {
     
    try {
        pool.query("select * from useraccount where mobileno=? || emailid=?", [req.body.mobileno, req.body.mobileno], function (error, result) {
            if (error) {
               
                res.status(200).json({ status: false, message: 'Database Error , Pls contact database Admin' })
            }
            else {
                
                if(result.length==1)
                {
                    res.status(200).json({data:result, status: true, message: 'successfully' })

                }
                else
                {
                    res.status(200).json({data:[], status: false, message: 'successfully' })
                }
                
            }
        })
    } catch (e) {
        res.status(200).json({ status: false, message: 'Server Error...' })
    }
})

module.exports = router;