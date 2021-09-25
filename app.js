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
//bodyparser

app.use(bodyParser.urlencoded({extended:false}));
//ejs
app.set('view engine', 'ejs');

//css
app.use(express.static('public/src'));
//photos
app.use(express.static(__dirname + ('public/photos')));
//js
app.use(express.static('public/js'));

//databse connecting

 mongoose.connect('mongodb://localhost:27017/instaClonedDB',({
 useNewUrlParser: true,
 useUnifiedTopology: true,
 }))
 .then(()=>{
    console.log('connected to db Succesfully')
 })
 .catch((err)=>{
    console.log(err)
 })

 const instaSchema = new mongoose.Schema({
     email: String,
     name: String,
     password:String
 });

 const User = mongoose.model('user',instaSchema);



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
    // const users = User.find({});
    // res.render('home',{users:req.users});

    User.find({}, function(err, data) {
      
        res.render('home', {data})
})
})


//post

app.post('/signup',(req,res)=>{

   let email = req.body.email;
   let name = req.body.name;
   let password = req.body.password;
   User.findOne({email:email})
   .then((user)=>{
       if(user){
           res.send({code:0,msg:'you are already registered'})
       }else{
        const newUser = User({
            email:email,
            name:name,
            password:password
        })
        newUser.save();
     
        res.send({code:1,msg:'user saved succesfully'})
       }
   })

})

app.post('/login',(req,res)=>{
    let {email, password} = req.body;

   User.findOne({email:email})
   .then((user)=>{
       if(!user){
           res.send({code:0,msg:'You are not registered'})
       }else{
           res.send({code:1,msg:'welcome'})
       }
   })


})

app.listen(PORT,(req,res)=>{
    console.log(`server is running on ${PORT}`);
})