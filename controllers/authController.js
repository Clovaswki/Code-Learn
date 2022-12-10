const mongoose = require('mongoose')
require('../models/Usuario')
const User = mongoose.model('usuarios')

module.exports = {

    checkAuth: async (req, res) => {

        var isAuthenticated = req.isAuthenticated()

        if(isAuthenticated){
            var { id, email, nome, sobrenome, file, savePosts } = req.user
            var dataUser = {
                id,
                email,
                nome,
                sobrenome,
                file, 
                savePosts
            }

            return res.status(200).json({auth: true, user: dataUser})
        }

        res.status(200).json({auth: false})

    }

}