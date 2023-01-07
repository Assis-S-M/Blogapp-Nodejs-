//Requisição do Express
const Express = require('express')

const app = Express()

const Port = 8081

//Função de start do server
module.exports = {
    Express: Express,
    App: app,
    Listen: () => {
        app.listen(Port, () => {
            console.log(`Servidor ativo, URL: http://localhost:${Port}/`)
        })
    }
}