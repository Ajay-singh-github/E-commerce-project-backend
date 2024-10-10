var express = require('express');
var router = express.Router();
var pool=require('./pool');
var upload=require('./multer');

/* GET home page. */
router.post('/submit_category',upload.single('categoryfile'), function(req, res, next) {
    console.log("checkkkkkkkkkkkkkkk:",req.body)
  try{
    pool.query('insert into category (categoryname,image) values(?,?)',[req.body.categoryname,req.file.filename],function(error,rsult){e
      if(error)
      {
        console.log("DataBase Error:",error)
      res.status(200).json({status:false,message:'Database error,pls contact database admin'})

      }
      else
      {
        res.status(200).json({status:true,message:'Category Submitted Successfully'})
      }


    })
}
catch(e)
{
    console.log("server Error:",e)
    res.status(200).json({status:false,message:'Server Error....'})
}
  
});


router.get("/fetch_display_data",function(req,res,next){
   try{
       pool.query('select * from category',function(error,result){
        if(error)
        {
          res.status(200).json({status:false,message:'Database Error'})

        }else
        { console.log("array data:".result)
          res.status(200).json({status:true,data:result,message:'Fetch Successfully'})

        }
       })
   }catch(e)
   {

   }
})

router.post("/update_category",function(req,res,next){
  pool.query('update category set categoryname=? where categoryid=?',[req.body.categoryname,req.body.categoryid],function(error,result){
    if(error)
    {
      res.status(200).json({status:false,message:'Database Error'})
    }else{
      res.status(200).json({status:true,data:result,message:'Updated Successfully'})
    }
  })
})





router.post('/update_picture',upload.single('filecategory'), function(req, res, next) {
  console.log("checkkkkkkkkkkkkkkk:",req.body)
try{
  pool.query('update category set image=? where categoryid=?',[req.file.filename,req.body.categoryid],function(error,result){
    if(error)
    {
      console.log("DataBase Error:",error)
    res.status(200).json({status:false,message:'Database error,pls contact database admin'})

    }
    else
    {
      res.status(200).json({status:true,message:'Category Submitted Successfully'})
    }


  })
}
catch(e)
{
  console.log("server Error:",e)
  res.status(200).json({status:false,message:'Server Error....'})
}

});

router.post("/delete_category",function(req,res,next){
  pool.query('delete from category where categoryid=?',[req.body.categoryid],function(error,result){
    if(error)
    {
      res.status(200).json({status:false,message:'Database Error'})
    }else{
      res.status(200).json({status:true,data:result,message:'Deleted Successfully'})
    }
  })
})


module.exports = router;