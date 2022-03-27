const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
require('../models/Usuario')
const User = mongoose.model('usuarios')

module.exports = (passport) => {

    passport.use(new localStrategy({passReqToCallback: true}, (req, username, password, done) => {

        User.findOne({email: username}).then((user) => {

            if(!user){
                return done(null, false, req.flash('error', 'Este cliente não existe!'))
            }

            var isValid = bcrypt.compareSync(password, user.senha)

            if(isValid){
                return done(null, user)
            }else{
                return done(null, false, req.flash('error', 'Senha incorreta!'))
            }

        })

    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async(id, done) => {
        try{
            const user = await User.findById(id)
            return done(null, user)
        }catch(err){
            console.log(err)
            done(err, false)
        }
    })

}