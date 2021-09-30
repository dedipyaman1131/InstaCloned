const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcryptjs');


//User model require
const User = require('../models/User');

module.exports = (passport)=>{
    
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

};