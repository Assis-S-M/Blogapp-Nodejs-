//Requisições do express e mongoose
const router = require('express').Router()
const mongoose = require('../modules/mongoose.js')

//Pagina home
router.get('/', (req, res) => {

    mongoose.Mongoose.models.postagens.find({
        date: {
            $gte: new Date((Date.now() - 86400000)).toString()
        }
    }).lean().populate({path: 'categoria'}).sort({date: 'desc'}).then((postagens) => {
        res.render("main", {postagens: postagens})
    })
})

//Rotas de categorias
router.get('/categorias', (req, res) => {
    mongoose.Mongoose.models.categorias.find().lean().then((categorias) => {
        res.render('user/categorias/categorias', {categorias: categorias})
    })
})

router.post('/postsRelacionados', (req, res) => {
    mongoose.Mongoose.models.postagens.find({categoria: req.body.categoria}).lean().then((postagens) => {
        res.render('user/categorias/postsRelacionados', {postagens: postagens})
    })
})

//Rotas de postagens
router.get('/postagens', (req, res) => {
    mongoose.Mongoose.models.postagens.find().populate({path: 'categoria'}).lean().then((postagens) => {
        res.render('user/postagens/postagens', {postagens: postagens})
    })
})

router.post('/postagemFocus', (req, res) => {
    mongoose.Mongoose.models.postagens.findOne({_id: req.body.postagemFocus}).populate({path: 'categoria'}).lean().then((postagemFocus) => {
        res.render('user/postagens/postagemFocus', {postagemFocus: postagemFocus})
    })
})

module.exports = {
    Router: router
}