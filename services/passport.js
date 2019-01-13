const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose')


const User = mongoose.model('user');

passport.serializeUser((user,done) => {
    console.log('called serializeUser',user.id)
    done(null,user.id)
})

passport.deserializeUser((id,done) => {
    console.log('called deserializeUser')
    User.findById(id).then(user => {
        done(null,user);
    })
})
passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
    },
    (accessToken,refreshToken,profile,done) => {
            // console.log('accessToken',accessToken)
            // console.log('refreshToken',refreshToken)
            User.findOne({googleId: profile.id})
            .then((existingUser) => {
                if(existingUser){
                   console.log(' User already existed')
                   done(null,existingUser)
                }else{
                    new User({googleId: profile.id})
                    .save()
                    .then(user => done(null,user))
                }
            })
          
        }
    )
);