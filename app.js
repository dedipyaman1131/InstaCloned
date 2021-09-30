const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const session =  require('express-session')
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs')
const saltRoununds = 10;
const PORT = 3000;
const flash = require('connect-flash');

// //Passport Config
require('./configg/passport')(passport);

//passport
app.use(session({
    secret:'this is a secret message',
    cookie:{maxAge:6000},
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session())

 // Connect flash
 app.use(flash());
 //Global variables
app.use((req,res,next)=> {
    res.locals.error = req.flash('error');
   
    next();
  });
//model

const User = require('./models/User');


passport.use(User.createStrategy());

//bodyparser

app.use(bodyParser.urlencoded({ extended: false }));
//ejs
app.set('view engine', 'ejs');

//css
app.use(express.static('public/src'));
//photos
app.use(express.static(__dirname + ('public/photos')));
//js
app.use(express.static('public/js'));

//databse connecting

mongoose.connect('mongodb://localhost:27017/instaClonedDB', ({
    useNewUrlParser: true,
    useUnifiedTopology: true,
}))
    .then(() => {
        console.log('connected to db Succesfully')
    })
    .catch((err) => {
        console.log(err)
    })



app.get('/', (req, res) => {
    res.render('interface')
});
app.get('/login', (req, res) => {
    res.render('login')
});

app.get('/signup', (req, res) => {
    res.render('signup')
});
app.get('/login', (req, res) => {
    res.render('login')
});
app.get('/home', (req, res) => {
    if(req.isAuthenticated()){
        User.find({}, function (err, data) {

            res.render('home', { data })
        })
    }else{
        res.render('login')
    }
})


//


    
    passport.use(
    new LocalStrategy({usernameField:'email'},(email,password,done)=>{
        User.findOne({email:email})
        .then((user)=>{
            if(!user){
                return done(null , false , {message:'the email you entered is not registered!!!'})
            }else{

                 //matching password
                
                bcrypt.compare(password ,user.password , (err, isMatch)=>{

                    if(err){
                       throw err 
                    }
                    if(!isMatch){
                        return done(null , false, {message:'password that you entered is not correct!!'})
                    }else{
                        return done(null , user)
                    }

                })
            }
        })
        .catch((err)=>{
            if(err){
                console.log(err)
            }
        })
    })

    )

    passport.serializeUser((user, done)=> {
        done(null, user.id);
      });
    
      passport.deserializeUser((id, done)=> {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });



//post

app.post('/signup', (req, res) => {

    let email = req.body.email;
    let name = req.body.name;
    let password = req.body.password;
       User.findOne({email:email})
       .then((user)=>{
           if(user){
               res.send({code:0,msg:'you are already registered'})
           }else{
            const newUser = User({
                username:name,
                email:email,
                password:password
            })

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser.save();
                
            
            res.send({code:1,msg:'user saved succesfully,please login to use instaCloned'})
        });
    });
           }
       })   

});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/home',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });


app.listen(PORT, (req, res) => {
    console.log(`server is running on ${PORT}`);
});


//res.statusCode = 500;
//    res.setHeader("Content-Type", "application/json");
//    res.json({ err: "err" });