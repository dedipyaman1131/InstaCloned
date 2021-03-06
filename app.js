const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session')
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs')
const saltRoununds = 10;
const PORT = 3000;
const flash = require('connect-flash');
const { isLoggedIn } = require('./configg/auth');
const multer = require('multer');

// //Passport Config
// require('./configg/passport')(passport);

// storage for image upload
const storage = multer.diskStorage({
    //destination for files
    destination: function (request, file, callback) {
        callback(null, './public/uploads');
    },

    //add back the extension
    filename: function (request, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});
//upload parameters for multer
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    },
});

//passport
app.use(session({
    secret: 'this is a secret message',
    cookie: { maxAge: 6000000 },
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session())

// Connect flash
app.use(flash());
//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
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
app.use('/public/uploads', express.static('public/uploads'));
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
app.get('/home', isLoggedIn, (req, res) => {
    res.render('home', {
        user: req.user
    })

});
//



passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email: email })
            .then((user) => {
                if (!user) {
                    return done(null, false, { message: 'the email you entered is not registered!!!' })
                } else {

                    //matching password

                    bcrypt.compare(password, user.password, (err, isMatch) => {

                        if (err) {
                            throw err
                        }
                        if (!isMatch) {
                            return done(null, false, { message: 'password that you entered is not correct!!' })
                        } else {
                            return done(null, user)
                        }

                    })
                }
            })
            .catch((err) => {
                if (err) {
                    console.log(err)
                }
            })
    })

)

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});



//post

app.post('/signup', (req, res) => {

    let email = req.body.email;
    let name = req.body.name;
    let password = req.body.password;
    User.findOne({ email: email })
        .then((user) => {
            if (user) {
                res.send({ code: 0, msg: 'you are already registered' })
            } else {
                const newUser = User({
                    username: name,
                    email: email,
                    password: password
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save();


                        res.send({ code: 1, msg: 'user saved succesfully,please login to use instaCloned' })
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


app.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

// post for image upload

app.post('/home', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file)
    let img = req.file.filename;
    let user_id = req.user._id;
    User.findByIdAndUpdate(user_id, { displayPicture: img },
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                res.redirect('/home')
            }



        })

});

app.listen(PORT, (req, res) => {
    console.log(`server is running on ${PORT}`);
});
