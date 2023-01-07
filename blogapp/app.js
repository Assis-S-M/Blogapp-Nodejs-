//Requisições de modulos
const path = require('path')
const config = require('./modules/express.js')
const handlebars = require('./modules/handlebars.js')
const mongoose = require('./modules/mongoose.js')
const middleware = require('./modules/session.js')

//Requisições de grupos de rotas
const Admin = require('./routes/admin.js')
const User = require('./routes/user.js')
const Cadastro = require('./routes/cadastro.js')

//COnfiguração de pasta de arquivos estaticos (estilo.css e etc..)
config.App.use(config.Express.static(path.join(__dirname, 'public')))

//Uso de middlware
config.App.use((req, res, next) => {
    next()
})

//Configuração de grupo de rotas
config.App.use('/admin', Admin.Router)
config.App.use('/', User.Router)
config.App.use('/', Cadastro.Router)

//Função de start to servidor
config.Listen()
