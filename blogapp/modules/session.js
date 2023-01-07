//Requisições de sessão, connect flash e passport
const config = require('./express.js')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const auth = require('./auth.js')(passport)

//Configuração da sessão
config.App.use(session({
    secret: "teste",
    resave: true,
    saveUninitialized: true
}))

//Configuração do passport na sessão
config.App.use(passport.initialize())
config.App.use(passport.session())

//Configuração do connect flash e variaveis globais
config.App.use(flash())
config.App.use((req, res, next) => {
    res.locals.successMsg = req.flash("successMsg")
    res.locals.errMsg = req.flash("errMsg")
    res.locals.err = req.flash("err")
    res.locals.user = req.user || null;
    next()
})

module.exports = {
    Session: session,
    Flash: flash
}