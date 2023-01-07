//Requisição do mongoose
const mongoose = require('mongoose')

const Schema = mongoose.Schema

//Configuração do mongoose
mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/blogapp", {useNewUrlParser: true}).then(() => {
    console.log("Conexão realizada com sucesso")
}).catch((err) => {
    console.log(`Erro na conexão\nERROR MESSAGE: ${err}`)
})

//Schemas do aplicativo
const CategoriaSchema = new Schema({ 
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

const PostagemSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "categorias"
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const UsuarioSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

const Categoria = mongoose.model('categorias', CategoriaSchema)
const Postagem = mongoose.model('postagens', PostagemSchema)
const Usuario = mongoose.model('usuarios', UsuarioSchema)
module.exports = {
    Mongoose: mongoose
}