//Requisições de bcrypt e passport
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const mongoose = require('./mongoose.js')

//Funçao de configuração do passport na estrategia passport-local
module.exports = function(passport) {

    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {
        mongoose.Mongoose.models.usuarios.findOne({email: email}).then((usuario) => {
            if(!usuario) {
                return done (null, false, {message: 'Não foi encontrada uma conta com este email'})
            } else {
                bcrypt.compare(senha, usuario.senha, (err, equal) => {
                    if (equal) {
                        return done(null, usuario)
                    } else {
                        return done(null, false, {message: "Email ou senha invalidos"})
                    }
                })
            }
        })
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id) 
    })

    passport.deserializeUser((id, done) => {
        mongoose.Mongoose.models.usuarios.findById(id, (err, usuario) => {
            done(err, usuario)
        })
    })
}
