//Import dos modulos
    const express = require('express')
    const app = express()
    const Handlebars = require('handlebars')
    const handlebars = require('express-handlebars')
    const path = require('path')
    const usuarioRoutes = require('./routes/usuario')
    const adminRoutes = require('./routes/admin')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')
    const passport = require('passport')
    require('./models/Usuario')
    const User = mongoose.model('usuarios')
    const fs = require('fs')
    require('dotenv/config')

//Config
    //Permissao do handlebars
        const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
    //template engine
        app.engine('handlebars', handlebars.engine({
            defaultLayout: 'main',
            handlebars: allowInsecurePrototypeAccess(Handlebars)
        }))
        app.set('view engine', 'handlebars')
    //Session
        app.use(session({
            secret: process.env.SECRET_SESSION,
            resave: false,
            saveUninitialized: false,
            cookie: {maxAge: 24 * 60 * 60 * 1000}
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    //middleware locals
        app.use(async(req, res, next) => {
            res.locals.success = req.flash('success')
            res.locals.error = req.flash('error')
            res.locals.userAuth = req.isAuthenticated()
            res.locals.searchName = req.flash('search')
            //adm variables
            res.locals.true = true
            res.locals.false = false
            //
            //Date footer
            var date = new Date()
            var anoAtual = date.getFullYear()
            res.locals.dateFooter = anoAtual
            //
            //subdirectory: imgUsers
            //
            next()
        })
    //Conexao com o banco de dados MongoDB
        mongoose.connect(process.env.MONGO_URI).then(() => {
            console.log('MongoDB conectado...')
        }).catch((err) => {
            console.log(`Erro: ${err}`)
        })
    //body-parser: parsing dos dados
        app.use(express.urlencoded({extended: true}))
        app.use(express.json())
    //files estaticos
        app.use(express.static(path.join(__dirname, 'public')))
//Rotas
    //rota do home page
        app.get('/', (req, res) => {
            if(req.isAuthenticated()){
                User.findOne({email: req.user.email}).then((user) => {
                    res.render('homePage', {user: user})
                }).catch((err) => {
                    req.flash('Erro interno!')
                    res.redirect('/404')
                })
            }else{
                try{
                    res.render('homePage')
                }catch(err){
                    console.log(`Erro ao renderizar o homePage: ${err}`)
                    res.redirect('/404')
                }
            }
        })

        //erro 404: not found
        app.get('/404', (req, res) => {
            res.send('#404')
        })

        //grupo de rotas do usuario
        app.use('/', usuarioRoutes)

        //grupo de rotas admin
        app.use('/admin', adminRoutes)


//API rodando na defaultPort
    const defaultPort = process.env.PORT || 3000
    app.listen(defaultPort, () => {
        console.log("Servidor rodando na url http://localhost:3000")
    })

