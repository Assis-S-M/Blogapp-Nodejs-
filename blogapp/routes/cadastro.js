//Requisições do Express, bcrypt e passport
const router = require('express').Router()
const mongoose = require('../modules/mongoose.js')
const bcrypt = require('bcryptjs')
const passport = require('passport')

//Rotas de cadastro / singIn / Sing in
router.get('/usuarioRegistro', (req, res) => {
    res.render('cadastro/usuarioRegistro')
})

router.post('/cad', (req, res) => {
    let errNome;
    let errEmail;
    let errSenha;

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        errNome = "ERRO, Nome invalido"
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        errEmail = "ERRO, Email invalido"
    }

    if (req.body.senha != req.body.senhaRepeat) {
        errSenha = "ERRO, Senhas diferentes"
    } else if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        errSenha = "ERRO, Senha invalida"
    }

    if (errNome == "ERRO, Nome invalido" || errEmail == "ERRO, Email invalido" || errSenha == "ERRO, Senha invalida" || errSenha == "ERRO, Senhas diferentes") {
        
        res.render('cadastro/usuarioRegistro', {errNome: errNome, errEmail: errEmail, errSenha: errSenha})
    } else {
       
        mongoose.Mongoose.models.usuarios.findOne({email: req.body.email}).then((usuario) => {
            if(usuario) {
                req.flash('errMsg', "Email já cadastrado")
                res.redirect('/usuarioRegistro')
            } else {
                mongoose.Mongoose.models.usuarios.create({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: bcrypt.hashSync(req.body.senha, bcrypt.genSaltSync(10)),
                    isAdmin: req.body.isAdmin
                }).then(() => {
                    req.flash('successMsg', "Usuario cadastrado com sucesso")
                    res.redirect('/usuarioRegistro')
                }).catch(() => {
                    req.flash('errMsg', "Houve um erro ao cadastrar o usuario")
                    res.redirect('/usuarioRegistro')
                })
            }
        })
    }
})

//Rotas de login
router.get('/usuarioLogin', (req, res) => {
    res.render('cadastro/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/usuarioLogin",
        failureFlash: true
    }) (req, res, next)
})

//Rota de logout / logOut
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { 
            return next(err) 
        }
        req.flash('successMsg', 'Deslogado com sucesso!')
        res.redirect('/')
      })
})

module.exports = {
    Router: router
}