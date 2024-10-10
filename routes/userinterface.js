var express = require('express')
const upload = require('./multer')
var router = express.Router()
var pool=require("./pool")

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

router.get('/display_all_category',function(req,res,next){
    try{
      pool.query('select * from category',function(error,result){
        if(error)
        {
        res.status(200).json({status:false,message:'Database error,pls contact database admin'})
  
        }
        else
        {
          res.status(200).json({data:result,status:true,message:'Success'})
        }
  
  
      })
  }
  catch(e)
  {
  
      res.status(200).json({status:false,message:'Server Error....'})
  }
    
  
  })
  
  router.post('/display_all_products_by_status', function (req, res) {
    try {
        pool.query('select P.*, (select C.categoryname from category C where C.categoryid = P.categoryid) as categoryname, (select B.brandname from brands B where B.brandid = P.brandid) as brandname, (select Pr.productname from products Pr where Pr.productid = P.productid) as productname,(select Pr.picture from products Pr where Pr.productid = P.productid) as productpicture from productdetails P where P.status=?',[req.body.status], function (error, result) {
            if (error) {
                console.log(error)
                res.json({ status: false, message: 'Database Error!' })
            }
            else {
                console.log(result)
                res.json({ status: true, data: result })
            }
        })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
    }
})

router.post('/display_all_products_for_menu', function (req, res, next) {
    try {
        pool.query("select products.*,category.categoryname,brands.brandname from products,category,brands where products.categoryid=category.categoryid and products.brandid=brands.brandid and products.categoryid=?",[req.body.categoryid], function (error, result) {
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

router.get('/display_all_brands',function(req,res,next){
    try{
      pool.query('select * from brands group by brandname',function(error,result){
        if(error)
        {
        res.status(200).json({status:false,message:'Database error,pls contact database admin'})
  
        }
        else
        {
          res.status(200).json({data:result,status:true,message:'Success'})
        }
  
  
      })
  }
  catch(e)
  {
  
      res.status(200).json({status:false,message:'Server Error....'})
  }
    
  
  })
  
  router.post('/fetch_product_details_by_productid', function (req, res) {
    try {
        pool.query('select P.*, (select C.categoryname from category C where C.categoryid = P.categoryid) as categoryname, (select B.brandname from brands B where B.brandid = P.brandid) as brandname, (select Pr.productname from products Pr where Pr.productid = P.productid) as productname from productdetails P where P.productid=?',[req.body.productid], function (error, result) {
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

router.post('/display_productdetails_by_id', function (req, res) {
    try {
        pool.query('select P.*, (select C.categoryname from category C where C.categoryid = P.categoryid) as categoryname, (select B.brandname from brands B where B.brandid = P.brandid) as brandname, (select Pr.productname from products Pr where Pr.productid = P.productid) as productname,(select Pr.picture from products Pr where Pr.productid = P.productid) as productpicture from productdetails P where P.productdetailsid=?',[req.body.productdetailsid], function (error, result) {
            if (error) {
                console.log(error)
                res.json({ status: false, message: 'Database Error!' })
            }
            else {
                console.log(result)
                res.json({ status: true, data: result })
            }
        })
    }
    catch (e) {
        res.json({ status: false, message: 'Server Error!' })
    }
})

// router.post('/order_submit', function (req, res) {
//     try {
//         var q="insert into orders (orderdate, productdetailsid, qty, paymentstatus, deliverystatus, mobileno, emailid, address, username) values ? ";
        
//         pool.query(q,[req.body.cart.map((item)=>{
//             return([new Date(),item.productdetailsid,item.qty,req.body.paymentstatus,"undelivered",req.body.user.mobileno,req.body.user.emailid,req.body.user.address,req.body.user.username])
//         }),], function (error, result) {
//             if (error) {
//                 console.log(error)
//                 res.json({ status: false, message: 'Database Error!' })
//             }
//             else {
//                 console.log(result)
//                 res.json({ status: true, message:'Order Successfully Submmitted' })
//             }
//         })
//     }
//     catch (e) {
//         res.json({ status: false, message: 'Server Error!' })
//     }
// })




router.post('/order_submit', function (req, res) {
    try {
        var q = "INSERT INTO orders (orderdate, productdetailsid, qty, paymentstatus, deliverystatus, mobileno, emailid, address, username) VALUES ?";
        
        // Create an array of values
        var values = req.body.cart.map((item) => {
            return [new Date(), item.productdetailsid, item.qty, req.body.paymentstatus, "undelivered", req.body.user.mobileno, req.body.user.emailid, req.body.user.address, req.body.user.username];
        });

        pool.query(q, [values], function (error, result) {
            if (error) {
                console.log(error);
                res.json({ status: false, message: 'Database Error!' });
            } else {
                console.log(result);
                res.json({ status: true, message: 'Order Successfully Submitted' });
            }
        });
    } catch (e) {
        console.log(e);
        res.json({ status: false, message: 'Server Error!' });
    }
});



// router.post('/product_filter', function (req, res) {
//     try {
//         // var q = "select p.* ,PD.* from productdetails PD ,products p where PD.productid=p.productid and PD.modelno like ('%'?'%' or p.productname like '%'?'%')";
//         // var q="SELECT p.*, PD.* FROM productdetails PD, products p WHERE PD.productid = p.productid AND (PD.modelno LIKE CONCAT(%?%) OR p.productname LIKE CONCAT(%?%))";
//         // Create an array of values
       
//         var q = "select c.* , b.* , p.*, pr.* from category c , brands b ,productdetails p , products pr where c.categoryid =b.categoryid and b.brandid=pr.brandid and pr.productid=p.productid and (c.categoryname like '%?%' or b.brandname like '%?%' or pr.productname like '%?%' or p.description like '%?%')"
//         pool.query(q, [req.body.text,req.body.text,req.body.text,req.body.text], function (error, result) {
//             if (error) {
//                 console.log(error);
//                 res.json({ status: false, message: 'Database Error!' });
//             } else {
//                 console.log(result);
//                 res.json({ status: true,data:result, message: 'Order Successfully Submitted' });
//             }
//         });
//     } catch (e) {
//         console.log(e);
//         res.json({ status: false, message: 'Server Error!' });
//     }
// });


router.post('/product_filter', function (req, res) {
    try {
        const searchText = req.body.text.toLowerCase(); // Assuming text is passed from the frontend
         
        // Adjusting searchText to include wildcard for partial matching
        const searchParam = `%${searchText}%`;

        // SQL query to search for products
        const q = `
            SELECT c.*, b.*, p.*, pr.*
            FROM category c
            INNER JOIN brands b ON c.categoryid = b.categoryid
            INNER JOIN products pr ON b.brandid = pr.brandid
            INNER JOIN productdetails p ON pr.productid = p.productid
            WHERE 
                c.categoryname LIKE ? OR
                b.brandname LIKE ? OR
                pr.productname LIKE ? OR
                p.description LIKE ?
        `;

        // Execute the query
        pool.query(q, [searchParam, searchParam, searchParam, searchParam], function (error, result) {
            if (error) {
                console.error(error);
                res.json({ status: false, message: 'Database Error!' });
            } else {
                console.log(result);
                res.json({ status: true, data: result, message: 'Products filtered successfully' });
            }
        });
    } catch (e) {
        console.error(e);
        res.json({ status: false, message: 'Server Error!' });
    }
});


// router.post('/product_filter', function (req, res) {
//     try {
//         const searchText = req.body.text.toLowerCase(); // Assuming text is passed from the frontend

//         // SQL query to search for products
//         const q = `
//             SELECT p.*, PD.*
//             FROM products p
//             INNER JOIN productdetails PD ON PD.productid = p.productid
//             WHERE PD.modelno LIKE ? OR p.productname LIKE ?
//         `;

//         // Execute the query
//         pool.query(q, [`%${searchText}%`, `%${searchText}%`], function (error, result) {
//             if (error) {
//                 console.error(error);
//                 res.json({ status: false, message: 'Database Error!' });
//             } else {
//                 console.log(result);
//                 res.json({ status: true, data: result, message: 'Products filtered successfully' });
//             }
//         });
//     } catch (e) {
//         console.error(e);
//         res.json({ status: false, message: 'Server Error!' });
//     }
// });


// router.post('/product_filter', function (req, res) {
//     try {
//         const searchText = req.body.text.toLowerCase(); // Assuming text is passed from the frontend

//         // SQL query to search for products
//         const q = `
//             SELECT p.*, PD.*
//             FROM products p
//             INNER JOIN productdetails PD ON PD.productid = p.productid
//             INNER JOIN brands B ON B.brandid = p.brandid
//             WHERE 
//                 PD.modelno LIKE ? OR 
//                 p.productname LIKE ? OR 
//                 PD.description LIKE ? OR 
//                 B.brandname LIKE ?
//         `;
     

//         // Adjusting searchText to include wildcard for single character search
//         const searchParam = `%${searchText}%`;

//         // Execute the query
//         pool.query(q, [searchParam, searchParam, searchParam, searchParam], function (error, result) {
//             if (error) {
//                 console.error(error);
//                 res.json({ status: false, message: 'Database Error!' });
//             } else {
//                 console.log(result);
//                 res.json({ status: true, data: result, message: 'Products filtered successfully' });
//             }
//         });
//     } catch (e) {
//         console.error(e);
//         res.json({ status: false, message: 'Server Error!' });
//     }
// });

router.post('/display_all_category_by_filter', function(req, res, next) {
    try {
      const { categories } = req.body; // 'categories' should be a comma-separated string of category IDs
      console.log("yes coming till here",categories.join(','))
      let query = 'SELECT d.*,c.categoryname as categoryname ,b.brandname as brandname FROM productdetails d,category c,brands b';
      // select d.*,c.categoryname as categoryname ,b.brandname as brandname from productdetails d,category c,brands b where c.categoryid = d.categoryid and d.brandid=b.brandid and d.categoryid in (28,12)
      if (categories) {
        

        // const categoryIds = categories.split(',').map(id => parseInt(id, 10)); // Convert to array of integers
        query += ` where c.categoryid = d.categoryid and d.brandid=b.brandid and d.categoryid IN (${categories.join(',')})`;
      }
  
      pool.query(query, function(error, result) {
        if (error) {
          res.json({ status: false, message: 'Database error, please contact database admin' });
        } else {
            console.log("yes succesful fetch data data is:",result)
          res.json({ data: result, status: true, message: 'Success' });
        }
      });
    } catch (e) {
      res.json({ status: false, message: 'Server Error....' });
    }
  });
  



module.exports = router