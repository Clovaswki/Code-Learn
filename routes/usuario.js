//Rotas do usuario
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const User = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')
const passport = require('passport')
require('../config/auth')(passport)
const upload = require('../config/configMulter')
const fs = require('fs')
const {loginFlash, fileEncode} = require('../helpers/helpers')//functions helpers

    //rota de cadastro
    router.get('/cadastro', (req, res) => {
        res.render('usuario/register')
    })

    //rota de inserção dos dados 
    router.post('/cadastro', upload, async(req, res) => {
        
        var erros = [] 
        let nome = req.body.nome.toLowerCase(),
            sobrenome = req.body.sobrenome.toLowerCase(),
            email = req.body.email.toLowerCase(),
            senha = req.body.senha.toLowerCase(),
            senha2 = req.body.senha2.toLowerCase(),
            filename = req.file.filename,
            fileContent = fileEncode(req.file.path),
            descricao = req.body.descricao,
            idade = req.body.idade

        if(!nome || typeof nome == undefined || nome == null){
            erros.push({text: "Nome inválido!"})
        }
        if(!sobrenome || typeof sobrenome == undefined || sobrenome == null){
            erros.push({text: "Sobrenome inválido!"})
        }
        if(!email || typeof email == undefined || email == null){
            erros.push({text: "Email inválido!"})
        }
        if(!senha || typeof senha == undefined || senha == null){
            erros.push({text: "Senha inválido!"})
        }
        if(senha.length < 3){
            erros.push({text: "Senha muito curta!"})
        }
        if(senha != senha2){
            erros.push({text: "As senhas são diferentes!"})
        }
        if(erros.length > 0){
            res.render('usuario/register', {erros: erros})
        }else{
            User.findOne({email: req.body.email}).then(async(user) => {
                if(user){
                    req.flash('error', 'Esta conta já existe!')
                    res.redirect('/cadastro')
                }else{
                    var salt = bcrypt.genSaltSync(10)
    
                    const newUser = {
                        nome: nome,
                        sobrenome: sobrenome,
                        email: email,
                        senha: bcrypt.hashSync(senha, salt),
                        filename: filename,
                        file: fileContent,
                        idade,
                        descricao
                    }
    
                    await new User(newUser).save().then(() => {
                        req.flash('success', "Cliente cadastrado")
                        res.redirect('/cadastro')
                    }).catch((err) => {
                        req.flash('error', "Erro ao cadastrar!")
                        res.redirect('/cadastro')
                    })
                }


            }).catch(err => console.log(`Erro: ${err}`))
        }
    
    })

    //Rota login
    router.get('/login', (req, res) => {
        res.render('usuario/login')
    })

    
    //Rota de envio dos dados login
    router.post('/login', loginFlash, (req, res, next) => {
        passport.authenticate('local', {session: true}, (err, user, info) => {
            if(err)next(err)
            if(!user){
                return res.redirect('/login')
            }

            req.logIn(user, (err) => {
                if(err){next(err)}
                return res.redirect('/')
            })
        })(req, res, next)
    })

    //rota de perfil
    router.get('/perfil', (req, res) => {
        if(req.isAuthenticated()){
            return res.render('profile', {user: req.user})
        }
        req.flash('error', 'Faça login primeiro')
        res.redirect('/')
        
    })

    //rota de logout
    router.get('/logout', (req, res) => {
        req.logout()
        res.redirect('/')
    })

module.exports = router