//Requisições do Handlebars
const config = require('./express.js')
const Handlebars = require('express-handlebars')

//Configuração do handlebars
config.App.engine('handlebars', Handlebars.engine({defaultLayout: 'index'}))
config.App.set('view engine', 'handlebars')

//COnfiguração do body-parser usando Express
config.App.use(config.Express.urlencoded({extended: false}))
config.App.use(config.Express.json())

module.exports = {
    Handlebars: Handlebars
}