const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/user');
// <--------- CORS for security--------->
app.use((req,res,next) => {
    res.header("Access-control-Allow-Origin","*");
    res.header(
        "Accress-Control-Allow-Headers",
        "Origin, X-Requested-with,Content-Type,Accept,Authorization"
    );
    if(req.method === "OPTIONAL"){
        res.header('Access-Control-Allow-Method',"PUT,POST,PATCH,DELETE,GET");
        return res.status(200).json({});
    }
    next();
}); 
// <------------------||---------------------->

// DataBase (MONGODB)

mongoose.connect('mongodb+srv://ProfileView:gGQcvSNCgQk5n6c@cluster0.vbnfg.mongodb.net/verification?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
.then(() => {
    console.log(`Connection Sucessfull`)
})
.catch((err) => console.log(`No connection`));

// -------------------||-----------------------


app.use(morgan('dev'));

app.use('/uploads',express.static('uploads'))

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);

app.use('/user',userRoutes);

app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            err:error
        }
    })
})

module.exports = app;