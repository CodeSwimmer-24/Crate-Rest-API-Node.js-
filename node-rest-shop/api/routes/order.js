const express = require('express');
const router = express.Router();

router.get('/',(req,res,next) => {
    res.status(200).json({
        message:'order were fetched'
    });
});

router.post('/',(req,res,next) => {
    const order = {
        orderId: req.body.orderId,
        price:req.body.price,
    };
    res.status(201).json({
        message:'Order was created',
        createdOrder: order
    })
})

router.get('/:orderId',(req,res,next) => {
   const id = req.params.orderId;
   if(id === "special"){
     res.status(200).json({
     message:"Special orderId",
     id : id
     });
   }else {
       res.status(200).json({
           message:'you passed id only'
       })
   }
});

router.delete('/:orderId',(req,res,next) => {
    res.status(200).json({
        message:'Deleated order',
        orderId: req.params.orderId
    })
});

module.exports = router;