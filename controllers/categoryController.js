require('../models/Categoria')
require('../models/Usuario')
const mongoose = require('mongoose')
const User = mongoose.model('usuarios')
const Category = mongoose.model('categorias')

module.exports = {

    getCategories: async (req, res) => {

        try {
            var categories = await Category.find().exec()

            res.status(200).json(categories)

        } catch (error) {
            res.status(500).json({error: 'erro interno'})
        }

    }

}