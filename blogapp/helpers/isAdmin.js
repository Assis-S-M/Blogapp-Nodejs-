//Função de autenticação de usuario e verificação de Admin
module.exports = {
    isAdmin: (req, res, next) => {

        if(req.isAuthenticated() && req.user.isAdmin) {
            return next();
        }

        req.flash('errMsg', "Voçe deve ser admin para acessar essa rota")
        res.redirect('/')
    }
}
