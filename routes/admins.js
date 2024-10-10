var express = require('express');
var router = express.Router();
var pool=require('./pool')
/* GET users listing. */
router.post('/check_admin_login', function(req, res, next) {
  pool.query('select *  from admins where (emailid=? or mobileno=?) and password=?',[req.body.emailid,req.body.emailid,req.body.password],function(error,result){
   if(error)
   { res.status(200).json({message:'Database Error',status:false})}
   else
   { 
    if(result.length==1)
    res.status(200).json({message:'Success',status:true,data:result[0]})
    else
    res.status(200).json({message:'Invalid Emailid/Mobileno/Password',status:false})

}
   

  })
 
});

module.exports = router;
