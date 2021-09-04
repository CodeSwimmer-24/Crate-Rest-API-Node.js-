const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require("../models/order");
const Product = require("../models/product");
const checkAuth = require("../middleware/check-auth");

router.get('/',checkAuth,(req,res,next) => {
   Order.find().select("_id product quantity").exec().then(docs => {
    const response ={
        count : docs.length,
        products : docs.map(doc => {
            return {
                _id:doc._id,
                product:doc.product,
                quantity:doc.quantity,
               request:{
                   tye:'GET',
                   url:'http://localhost:3000/products/'+doc._id
               }
            }
        })
    };
    res.status(200).json(response);
   }).catch( err => {
       res.status(500).json({
           error:err
       })
   })
});

router.post('/',checkAuth,(req,res,next) => {
    // const order = {
    //     orderId: req.body.orderId,
    //     price:req.body.price,
    // };
    Product.findById(req.body.productId).then(
        product => {
            if(!product){
                return res.status(404).json({
                    message:"product not found"
                })
            }
            const order = new Order({
                _id:mongoose.Types.ObjectId(),
                quantity:req.body.quantity,
                product:req.body.productId
            });
            return order.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message:"Order stored",
                createdOrder:{
                 _id:result._id,
                 product:result.product,
                 quantity:result.quantity   
                },
                request:{
                    type:'GET',
                    url:'http://localhost:3000/products/'+result._id
                }
            })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
    // const order = new Order({
    //     _id:mongoose.Types.ObjectId(),
    //     quantity:req.body.quantity,
    //     product:req.body.productId
    // });
    // order.save().then(result => {
    //     console.log(result);
    //     res.status(201).json({
    //         message:"Order stored",
    //         createdOrder:{
    //          _id:result._id,
    //          product:result.product,
    //          quantity:result.quantity   
    //         },
    //         request:{
    //             type:'GET',
    //             url:'http://localhost:3000/products/'+result._id
    //         }
    //     });
    // }).catch(err => {
    //     console.log(err);
    //     res.status(500).json({
    //         error:err
    //     })
    // })
    // res.status(201).json({
    //     message:'Order was created',
    //     createdOrder: order
    // })
})

router.get('/:orderId',checkAuth,(req,res,next) => {
    Order.findById(req.params.orderId).exec().then(order => {
        if(!order){
            return res.status(404).json({
                message:'Order not found'
            })
        }
        res.status(200).json({
            order:order,
            request:{
                type:'GET',
                url:'http://localhost:8000/orders'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    })
//    const id = req.params.orderId;
//    if(id === "special"){
//      res.status(200).json({
//      message:"Special orderId",
//      id : id
//      });
//    }else {
//        res.status(200).json({
//            message:'you passed id only'
//        })
//    }
});

router.delete('/:orderId',checkAuth,(req,res,next) => {
    Order.remove({_id:req.params.orderId}).exec().then(
        result => {
            res.status(200).json({
                message:'Order deleated',
                request:{
                    type:'POST',
                    url:"http://localhost:8000/orders",
                    body:{productId:'ID',quantity:'Number'}
                }
            })
        }
    ).catch();
    // res.status(200).json({
    //     message:'Deleated order',
    //     orderId: req.params.orderId
    // })
});

module.exports = router;