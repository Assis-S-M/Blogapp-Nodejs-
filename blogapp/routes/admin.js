//Requisições do Express, mongoose e função de autenticação
const router = require('express').Router()
const mongoose = require('../modules/mongoose.js')
const { isAdmin } = require('../helpers/isAdmin')

//Rotas de categorias
router.get('/categorias', isAdmin, (req, res) => {
    mongoose.Mongoose.models.categorias.find().lean().sort({date: 'desc'}).then((categorias) => {
        res.render('admin/categorias/categorias', {categorias: categorias})  
    })
})

router.get('/addCategoria', isAdmin, (req, res) => {
    res.render('admin/categorias/addCategoria')
})

router.post('/editCategoria', isAdmin, (req, res) => {

    mongoose.Mongoose.models.categorias.findOne({_id: req.body.id}).lean().then((categorias) => {
        res.render("admin/categorias/editCategoria", {categorias: categorias})
    })
})

//Rotas de postagem
router.get('/postagens', isAdmin, (req, res) => {
    mongoose.Mongoose.models.postagens.find().lean().populate({path: 'categoria'}).sort({date: 'desc'}).then((postagens) => {
        res.render("admin/postagens/postagens", {postagens: postagens})
    }).catch((err) => {
        console.log(err)
    })
})

router.get('/addPostagem', isAdmin, (req, res) => {
    mongoose.Mongoose.models.categorias.find().lean().then((categorias) => {
        res.render("admin/postagens/addPostagem", {categorias: categorias})
    })
})

router.post("/editPostagem", isAdmin, (req, res) => {
    mongoose.Mongoose.models.postagens.findOne({_id: req.body.id}).lean().then((postagens) => {
        mongoose.Mongoose.models.categorias.find().lean().then((categorias) => {
            res.render('admin/postagens/editPostagem', {postagens: postagens, categorias: categorias})
        })
    })
})

//Rota de adição de categorias E postagens
router.post('/add', (req, res) => {

    //Adição categoria
    if (req.body.pagina == "addCategoria") {

        //Autenticação (Não são permitidos campos vazios)
        let errNome;
        let errSlug;

        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            errNome = "ERRO: Nome invalido"
        }

        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            errSlug = "ERRO: Slug invalido"
        }

        if (errNome == "ERRO: Nome invalido" || errSlug == "ERRO: Slug invalido") {
            res.render("admin/categorias/addCategoria", {errNome: errNome, errSlug: errSlug})
        } else {

        mongoose.Mongoose.models.categorias.create({
            nome: req.body.nome,
            slug: req.body.slug
        }).then(() => {
            req.flash("successMsg", "Categoria criada com sucesso!")
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash("errMsg", "Erro ao criar categoria...")
            res.redirect('/admin/categorias')
        })
    }

    //Adição postagem
    } else if (req.body.pagina == "addPostagem") {
        
        //Autenticação (Não são permitidos campos vazios)
        let errTitulo;
        let errSlug;
        let errDesc;
        let errConteudo;
        let errCategoria;

        if (!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
            errTitulo = "ERRO: Titulo invalido"
        }

        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            errSlug = "ERRO: Slug invalido"
        }

        if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
            errDesc = "ERRO: Descrição invalida"
        }
        
        if (!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null) {
            errConteudo = "ERRO: Conteudo invalido"
        }

        if (!req.body.categoria || typeof req.body.categoria == undefined || req.body.categoria == null || req.body.categoria == 0) {
            errCategoria = "ERRO: Categoria invalida, registre uma categoria"
        }

        if (errTitulo == "ERRO: Titulo invalido" || errSlug == "ERRO: Slug invalido" || errDesc == "ERRO: Descrição invalida" || errConteudo == "ERRO: Conteudo invalido" || errCategoria == "ERRO: Categoria invalida, registre uma categoria") {
            res.render("admin/postagens/addPostagem", {errTitulo: errTitulo, errSlug: errSlug, errDesc: errDesc, errConteudo: errConteudo, errCategoria: errCategoria})
        } else {
            mongoose.Mongoose.models.postagens.create({
                titulo: req.body.titulo,
                slug: req.body.slug,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                categoria: req.body.categoria
            }).then(() => {
                req.flash("successMsg", "Postagem criada com sucesso")
                res.redirect("/admin/postagens")
            }).catch((err) => {
                req.flash("errMsg", "Erro ao criar postagem...")
                res.redirect('/admin/postagens')
            })
        }
    }
})

//Rota de edição de categorias E postagens
router.post("/edit", (req, res) => {

    console.log(req.body.pagina)

    //Edição categoria
    if (req.body.pagina == "editCategoria") {

        //Autenticação (Não são permitidos campos vazios)
        let errNome;
        let errSlug;

        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            errNome = "ERRO: Nome invalido"
        }

        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            errSlug = "ERRO: Slug invalido"
        }

        if (errNome == "ERRO: Nome invalido" || errSlug == "ERRO: Slug invalido") {
            res.render("admin/categorias/editCategoria", {errNome: errNome, errSlug: errSlug})
        } else {

            mongoose.Mongoose.models.categorias.findOne({_id: req.body.id}).then((categoria) => {
                categoria.nome = req.body.nome
                categoria.slug = req.body.slug
                categoria.save()
    
                req.flash("successMsg", "Categoria editada com sucesso")
                res.redirect("/admin/categorias")
            })
        }

    //Edição postagem    
    } else if (req.body.pagina == "editPostagem") {

        //Autenticação (Não são permitidos campos vazios)
        let errTitulo;
        let errSlug;
        let errDesc;
        let errConteudo;
        let errCategoria;

        if (!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
            errTitulo = "ERRO: Titulo invalido"
        }

        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            errSlug = "ERRO: Slug invalido"
        }

        if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
            errDesc = "ERRO: Descrição invalida"
        }
        
        if (!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null) {
            errConteudo = "ERRO: Conteudo invalido"
        }

        if (!req.body.categoria || typeof req.body.categoria == undefined || req.body.categoria == null || req.body.categoria == 0) {
            errCategoria = "ERRO: Categoria invalida, registre uma categoria"
        }

        if (errTitulo == "ERRO: Titulo invalido" || errSlug == "ERRO: Slug invalido" || errDesc == "ERRO: Descrição invalida" || errConteudo == "ERRO: Conteudo invalido" || errCategoria == "ERRO: Categoria invalida, registre uma categoria") {
            res.render("admin/postagens/editPostagem", {errTitulo: errTitulo, errSlug: errSlug, errDesc: errDesc, errConteudo: errConteudo, errCategoria: errCategoria})
        } else {
            mongoose.Mongoose.models.postagens.findOne({_id: req.body.id}).then((postagem) => {
                postagem.titulo = req.body.titulo
                postagem.slug = req.body.slug
                postagem.descricao = req.body.descricao
                postagem.conteudo = req.body.conteudo
                postagem.categoria = req.body.categoria
                postagem.save()

                req.flash("successMsg", "Postagem criada com sucesso")
                res.redirect("/admin/postagens")
            })
        }
    } else {}
})
//Rota de delete de categorias E postagens
router.post('/del', (req, res) => {

    //del categoria
    if (req.body.pagina == "delCategorias") {
        
        mongoose.Mongoose.models.categorias.deleteOne({_id: req.body.id}).then(() => {
            req.flash("successMsg", "Categoria deletada com sucesso")
            res.redirect("/admin/categorias")
        }).catch(() => {
            req.flash("errMsg", "Houve um erro ao deletar a categoria")
            res.redirect("/admin/categorias")
        })

    //del postagens
    } else if (req.body.pagina == "delPostagens") {
        
        mongoose.Mongoose.models.postagens.deleteOne({_id: req.body.id}).then(() => {
            req.flash("successMsg", "Postagem deletada com sucesso")
            res.redirect("/admin/postagens")
        }).catch(() => {
            req.flash("errMsg", "Houve um erro ao deletar a postagem")
            res.redirect("/admin/postagens")
        })
    } else {}
})


module.exports = {
    Router: router
};
