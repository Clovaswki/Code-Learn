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
    require('./models/Postagem')
    const User = mongoose.model('usuarios')
    const Post = mongoose.model('posts')
    const Category = mongoose.model('categorias')
    const fs = require('fs')
    require('dotenv/config')
    const crudRoutes = require('./routes/all')
    const { pagination } = require('./helpers/pagination')

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
            cookie: {maxAge: 3600000}
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
        //get css static file names and script file names
        app.use((req, res, next) => {
            var filesStyle = fs.readdirSync(path.join('public', 'styles'))
            var filesScript = fs.readdirSync(path.join('public', 'scripts'))
            res.locals.styles = filesStyle
            res.locals.scripts = filesScript
            next()
        })
    //Conexao com o banco de dados MongoDB
        const {mongoURI} = require('./config/db')
        mongoose.connect(mongoURI).then(() => {
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
        app.get('/', async(req, res) => {

            //pagination system
            var postsByPage = [],
                numberPages = 0 ,
                limitItems = 5,
                pageChoosed = parseInt(req.query.page) - 1

            try {
                //pagination system
                let posts = (await Post.find().populate('user').sort({date: 'desc'}).exec()).reverse()

                var { postsByPage, numberPages } = pagination(req, posts, 
                    postsByPage, numberPages, limitItems, pageChoosed)

                //...

                if(req.isAuthenticated()){
                    let user = await User.findOne({email: req.user.email}).exec()
                    res.render('homePage', {user: user, posts: postsByPage, numberPages})
                }else{
                    res.render('homePage', {posts: postsByPage, numberPages})
                }

                postsByPage = []
                
            } catch (error) {

                postsByPage = []

                console.log(`Erro ao renderizar o homePage: ${error}`)
                res.status(404).redirect('/404')
            }
            
        })

        //erro 404: not found
        app.get('/404', (req, res) => {
            res.render('404')
        })

        //route of categories
        app.get('/categories', async (req, res) => {
            try{
                var categories = await Category.find({}).exec()
                
                if(categories.length > 0){
                    return res.render('categories', {categories: categories, user: req.user})
                }

                res.render('categories', {error: true})
    
            }catch(error){
                console.log(error)
                res.status(500).redirect('/404')
            }
        })

        //route of posts by category
        app.get('/posts/:categoryId', async (req, res) => {
            
            var { categoryId } = req.params

            try {
            
                var category = await Category.findOne({_id: categoryId}).exec()
        
                var allPosts = await Post.find().populate('user').exec()

                var postsByCategory = allPosts.filter( post => post.category.some( p => p._id == categoryId))

                res.render('postsByCategory', {user: req.user, posts: postsByCategory, category})

            } catch (error) {
                console.log(error)
                res.status(500).redirect('/404')
            }
        
        })

        //route of create a post
        app.get('/criar-post', (req, res) => {
            if(req.isAuthenticated()){
                return res.render('createPost', {user: req.user})
            }
            req.flash('error', 'Faça o seu login primeiro')
            res.redirect('/login')
        })

        //post route
        app.get('/post/:id', async (req, res) => {
            try {
                var post = await Post.findOne({_id: req.params.id}).populate('user').exec()

                if(post){
                    return res.render('post', {user: req.user, post: post})
                }

                req.flash('error', 'Nenhuma postagem encontrada')
                res.redirect('/')

            } catch (error) {
                console.log(error)
                req.flash('error', 'erro interno')
                res.redirect('/')
            }
        })

        //routes group from user
        app.use('/', usuarioRoutes)

        //routes group admin
        app.use('/admin', adminRoutes)

        //routes group to crud operations
        app.use('/', crudRoutes)


//API listening on the default port
    const defaultPort = process.env.PORT || 3000
    app.listen(defaultPort, () => {
        console.log("Servidor rodando na url http://localhost:3000")
    })