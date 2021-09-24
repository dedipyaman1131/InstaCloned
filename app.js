const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt')
const saltRoununds = 10;
const PORT = 3000;

//ejs
app.set('view engine', 'ejs');

//css
app.use(express.static('public/src'));
//photos
app.use(express.static(__dirname + ('public/photos')))


app.get('/',(req,res)=>{
    res.render('interface')
});
app.get('/login',(req,res)=>{
    res.render('login')
});

app.get('/signup',(req,res)=>{  
    res.render('signup')
});
app.get('/login',(req,res)=>{
    res.render('login')
});
app.get('/home',(req,res)=>{
    res.render('home')
})


app.listen(PORT,(req,res)=>{
    console.log(`server is running on ${PORT}`);
})