const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Category = mongoose.model('categorias')
require('../models/Usuario')
const User = mongoose.model('usuarios')
require('../models/Postagem')
const Post = mongoose.model('posts')
const fs = require('fs')
 //function de controle de acesso (small middleware)
    const {admin} = require('../helpers/helpers')

    //rota da page admin -> categorias
    router.get('/home',async (req, res) => {
        Category.find().sort({date: 'desc'}).then((categories) => {
            User.find().then((users) => {
                Post.find().then((posts) => {
                    res.render('admin/homePageCategorias', {users: users, categories: categories, posts: posts})
                })
            })
        }).catch((err) => {
            res.status(404).send('#404')
        })
    })

    //categorias
        //rota de add categorias
        router.get('/addcategorias', (req, res) => {
            User.find().then((users) => {
                res.render('admin/addcategorias', {users: users})
            })
        })

        //rota de inserção das categorias no mongoDB
        router.post('/addcategorias', (req, res) => {
            var erros = []
            var nome = req.body.categoria
                slug = req.body.slug

            if(!nome || typeof nome == undefined || nome == null){
                erros.push({text: "Categoria inválida!"})
            }
            if(!slug || typeof slug == undefined || slug == null){
                erros.push({text: "Slug inválida!"})
            }
            if(nome.length < 3){
                erros.push({text: "Nome da categoria curto!"})
            }
            if(slug.length <= 2){
                erros.push({text: "Nome da slug muito curto!"})
            }
            if(erros.length > 0){
                res.render('admin/addcategorias', {erros: erros})
            }else{
                
                new Category({
                    nome: nome,
                    slug: slug
                }).save().then(() => {
                    req.flash('success', 'Categoria adicionada')
                    res.redirect('/admin/addcategorias')
                }).catch((err) => {
                    req.flash('error', 'Erro ao salvar categoria')
                    res.redirect('/admin/addcategorias')
                })

            }
        })

        //rota de exclusao de categorias
        router.get('/deletecategorias/:slug', (req, res) => {
            Category.deleteOne({slug: req.params.slug}).then(() => {
                req.flash('success', 'Categoria deletada')
                res.redirect('/admin/home')
            }).catch((err) => {
                req.flash('error', 'Erro ao deletar categoria!')
                res.redirect('/admin/home')
            })
        })

        //rota de edicao de categorias
        router.get('/editcategorias/:slug', (req, res) => {
            User.find().then((users) => {
                Category.findOne({slug: req.params.slug}).then((category) => {
                    res.render('admin/editcategorias', {categoria: category, users: users})
                }).catch((err) => {
                    req.flash('error', 'Erro interno!')
                    res.redirect('/admin/home')
                })
            })
        })

        //rota post de edicao das categorias
        router.post('/editcategorias', (req, res) => {
            var erros = []
            var nome = req.body.categoria
                slug = req.body.slug

            if(!nome || typeof nome == undefined || nome == null){
                erros.push({text: "Categoria inválida!"})
            }
            if(!slug || typeof slug == undefined || slug == null){
                erros.push({text: "Slug inválida!"})
            }
            if(nome.length < 3){
                erros.push({text: "Nome da categoria curto!"})
            }
            if(slug.length <= 2){
                erros.push({text: "Nome da slug muito curto!"})
            }
            if(erros.length > 0){
                res.render('admin/addcategorias', {erros: erros})
            }else{

                Category.findOneAndUpdate({slug: req.body.id}, {$set: {nome: nome}}, {$set: {slug: slug}}).then(() => {
                    req.flash('success', 'Categoria alterada')
                    res.redirect('/admin/home')
                }).catch((err) => {
                    req.flash('error','Erro ao editar categoria!')
                    res.redirect('/admin/editcategoria')
                })
                
            }
        })
        
        //rota de pesquisa de categorias
        router.post('/search-categorias', (req, res) => {
            var search = req.body.search
            Category.find({nome: search}).then((categories) => {
                if(categories){
                    req.flash('search', categories)
                    res.redirect('/admin/home')
                }
            }).catch((err) => {
                req.flash('error', 'Nenhum resultado para a busca')
                res.redirect('/admin/home')
            })
        })

    //clientes
        //rota exibicao dos dados dos clientes
        router.get('/clientes', (req, res) => {
            User.find().sort({date: 'desc'}).then((users) => {
                Post.find().then((posts) => {
                    res.render('admin/client', {users: users, posts: posts})
                })
            })
        })

        //rota de pesquisa dos usuarios
        router.post('/search-usuarios', async(req, res) => {
            var search = req.body.search
            
            var userInfos = [
                {nome: search},
                {sobrenome: search},
                {email: search}
            ]

            /*userInfos.map(async(userInfo) => {
    
                var users = await User.find(userInfo)
                
                try{
                    if(users.length > 0){
                        req.flash('search', users)
                        return res.redirect('/admin/clientes')
                    }
                }catch(err){
                    console.log("Errinho: "+err)
                }

            })*/

            for(var i = 0; i < userInfos.length; i++){    
                
                var users = await User.find(userInfos[i])
                
                if(users.length > 0){
                    req.flash('search', users)
                    return res.redirect('/admin/clientes')
                }
                
                if(i == 2){
                    if(users.length <= 0){
                        req.flash('error', 'Nenhum resultado encontrado para busca')
                        res.redirect('/admin/clientes')            
                    }
                }

            }
        
        })

        //rota de exclusao de clientes
        router.get('/deleteclientes/:id', (req, res) => {
            //apagando foto user pelo diretorio
            User.findOne({_id: req.params.id}).then((user) => {
                try{
                    fs.readFile(`./public/fotosUsers/${user.foto}`, (err) => {
                        if(!err){
                            fs.unlink(`./public/fotosUsers/${user.foto}`, () => console.log(`Imagem do usuário deletada`))
                        }
                    })
                }catch(err){
                    console.log("Erro esperado: "+err)
                }
            })
            //apagando user do mongodb
            User.deleteOne({_id: req.params.id}).then(() => {
                req.flash('success', 'Usuarios deletado')
                res.redirect('/admin/clientes')
            }).catch((err) => {
                req.flash('error', 'Erro ao deletar usuário!')
                res.redirect('/admin/clientes')
            })
            
        })

        //rota de edit dos clientes
        router.get('/editclientes/:id', (req, res) => {
            
            User.find().then((users) => {
                User.findOne({_id: req.params.id}).then((user) => {
                    res.render('admin/editclientes', {users: users, user: user})
                })
            })
            
        })

        //rota post de edit dos clientes
        router.post('/editclientes', (req, res) => {
            var erros = []
            var nome = req.body.nome,
                sobrenome = req.body.sobrenome,
                email = req.body.email,
                select = req.body.adm

            if(!nome || typeof nome == undefined || nome == null){
                erros.push({text: "Nome inválido!"})
            }
            if(!sobrenome || typeof sobrenome == undefined || sobrenome == null){
                erros.push({text: "Sobrenome inválido!"})
            }
            if(!email || typeof email == undefined || email == null){
                erros.push({text: "Email inválido!"})
            }
            if(nome.length < 3){
                erros.push({text: "Nome curto!"})
            }
            if(sobrenome.length < 3){
                erros.push({text: "Sobrenome curto!"})
            }
            if(email.length < 9){
                erros.push({text: "Email curto!"})
            }
            if(erros.length > 0){
                res.render('admin/addcategorias', {erros: erros})
            }else{

                User.findOneAndUpdate(
                    {_id: req.body.id},
                    {$set: {
                        nome: nome,
                        sobrenome: sobrenome,
                        email: email,
                        adm: select
                    }}
                ).then((user) => {
                    req.flash('success', 'Alterações salvas')
                    res.redirect(`/admin/editclientes/${user._id}`)
                }).catch((err) => {
                    req.flash('error', 'Erro ao alteras dados!')
                    res.redirect(`/admin/editclientes/${user._id}`)
                })

            }
        })

    //postagens
        //rota de posts
        router.get('/postagens', (req, res) => {
            User.find().then((users) => {
                Post.find().populate("category").sort({date: 'desc'}).then((posts) => {
                    res.render('admin/posts', {posts: posts, users: users})
                })
            })
        })
        //rota de add de posts
        router.get('/addpost', (req, res) => {
            User.find().then((users) => {
                Post.find().then((posts) => {
                    Category.find().then((categories) => {
                        res.render('admin/addposts', {categories: categories, users: users, posts: posts})
                    })
                })
            })
        })
        //rota post add posts
        router.post('/addpost', (req, res) => {
            var erros = []
            var title = req.body.title,
                description = req.body.description,
                slug = req.body.slug,
                category = req.body.category,
                content = req.body.content

            if(!title || typeof title == undefined || title == null){
                erros.push({text: 'Título inválido!'})
            }
            if(!description || typeof description == undefined || description == null){
                erros.push({text: 'Descrição inválida!'})
            }
            if(!slug || typeof slug  == undefined || slug == null){
                erros.push({text: 'SLug inválida!'})
            }
            if(!content || typeof content == undefined || content == null){
                erros.push({text: 'Conteúdo inválido!'})
            }
            if(title.length < 3){
                erros.push({text: 'Título pequeno!'})
            }
            if(content.length < 80){
                erros.push({text: 'Conteúdo pequeno!'})
            }
            if(erros.length > 0){
                res.render('admin/addposts', {erros: erros})
            }else{

                var newPost = {
                    title: title,
                    description: description,
                    slug: slug,
                    content: content,
                    category: category
                }

                new Post(newPost).save().then(() => {
                    req.flash('success', 'Postagem criada')
                    res.redirect('/admin/postagens')
                }).catch((err) => {
                    req.flash('error', 'Erro ao criar postagem')
                    res.redirect('/admin/addpost')
                })

            }
        })

module.exports = router