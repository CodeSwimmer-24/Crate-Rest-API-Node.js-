const express = require('express');
const router = express.Router();

//<----------------- File,Image storage-------------------->
const multer = require('multer');
const storage = multer.diskStorage({
   destination:function(req,file,cb){
   cb(null,'./uploads/');
   },
   filename:function(req,file,cb){
   cb(null,new Date().toISOString() + file.originalname);
   }
});
const fileFilter = (req,file,cb) => {
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
    cb(null,false);
    }
}
const upload = multer({storage:storage,limits:{
    fileSize:1024 * 1025 * 5
},
fileFilter: fileFilter
});
// <-------------------------------------------------------------->

const mongoose = require('mongoose');
const Product = require('../models/product');

router.get('/',(req,res,next) => {
    // res.status(200).json({
    //     message:"Handling GET request to /products"
    // });
        // console.log(docs);
        Product.find().select("name price_id productImage").exec().then(docs => {
            const response ={
                count : docs.length,
                products : docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id:doc._id,
                       request:{
                           tye:'GET',
                           url:'http://localhost:3000/products/'+doc._id
                       }
                    }
                })
            };
            res.status(200).json(response);
        })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});


router.post('/',upload.single('productImage'),(req,res,next) => {
    console.log(req.file)
    // const product = {
    //     name: req.body.name,
    //     price:req.body.price,
    // };
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        console.log(result);
        res.status(200).json({
            message:"Handling POST request to /products",
            createdProducts: result
        });
    }).catch(err => {
        console.log(err);
    res.status(500).json({
        error:err
    })
    });
});

router.get("/:productId",(req,res,next) => {
    const id = req.params.productId;
    // if(id === 'special'){
    //     res.status(200).json({
    //         message: 'You discovered a special ID',
    //         id:id
    //     })
    // } else {
    //     res.status(200).json({
    //         message:'You passed an ID'
    //     })
    // }
    Product.findById(id)
    .select('name price_id productImage')
    .exec()
    .then(doc => {
        console.log('From Database',doc);
       if(doc){
        res.status(200).json(doc)
       } else {
           res.status(404).json({
               message:"No valid productId found"
           })
       }
    })
    .catch(err => {console.log(err)
    res.status(500).json({error:err})});
});


// <-----Patch (for changing the data with productID)----------->
router.patch("/:productId",(req,res,next) => {
   const id = req.params.productId;
   const updateOps = {};
   for(const ops of req.body){
       updateOps[ops.propName] = ops.value;
   }
   Product.update({_id:id}, { $set:updateOps}).exec().then(result => {
       console.log(res)
       res.status(200).json(result)
   }).catch(err => {
       console.log(err);
       res.status(500).json({
           error:err
       })
   })
});
// <-----------------------------||---------------------------------->

router.delete("/:productId",(req,res,next) => {
    // res.status(200).json({
    //     message:'Delete products'
    // });
    const id = req.params.productId
    Product.remove({_id: id}).exec()
    .then( result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});
module.exports = router;