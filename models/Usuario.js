const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = Schema({
    nome: {
        type: String,
        required: true
    }, 
    sobrenome: {
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
    adm: {
        type: Boolean,
        default: false
    },
    idade: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    savePosts: [
        {type: String}
    ],
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('usuarios', User)
