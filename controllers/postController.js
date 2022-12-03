const mongoose = require('mongoose')
require('../models/Postagem')
require('../models/Usuario')
const Post = mongoose.model('posts')
const User = mongoose.model('usuarios')

module.exports = {

    putPost: async (req, res) => {

        var { 
            title,
            content,
            slug, 
            description,
            userId,
            categoriesChoosed 
        } = req.body


        var newPost = new Post({
            title,
            content, 
            slug,
            description,
            category: categoriesChoosed,
            user: userId
        })

        try {
            var post = await newPost.save()

            if(post){
                return res.status(201).json(post)
            }

            res.status(500)
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'erro interno', errorLog: error})
        }

    }, 
    getPost: async (req, res) => {

        try {
            var posts = req.query.postId ? 
            await Post.findOne({_id: req.query.postId})
            : await Post.find().exec()

            if(posts.length > 0 || posts){
                return res.status(200).json(posts)
            }

            res.status(200).json({message: 'Nenhum post encontrado'})

        } catch (error) {
            res.status(500).json({error: 'erro interno', errorLog: error})
        }

    },
    setLikePost: async (req, res) => {

        var { userId, postId } = req.query

        var idUser = !userId ? req.user?._id.toString() : userId

        if(!userId && !req.user?._id.toString()) return res.status(200).json({status: 204})

        try{
            
            var post = await Post.findOne({_id: postId}).exec()

            var userLiked = post.numberLike.some( like => like == idUser)

            var setLikes = []

            if(userLiked){
                setLikes = post.numberLike.filter( like => like != idUser)
            }else{
                setLikes = [...post.numberLike, idUser]
            }

            post.numberLike = setLikes

            var postSave = await post.save()

            res.status(200).json(postSave)

        }catch(error){
            console.log(error)
            res.status(500).json({error: 'erro interno', errorLog: error})
        }

    },
    setSavePost: async (req, res) => {

        var { userId, postId } = req.query

        try {

            var user = await User.findOne({_id: userId}).exec()

            var saved = user.savePosts.some( p => p == postId)

            var newPosts_ids = []

            saved
            ? newPosts_ids = user.savePosts.filter( p => p != postId)
            : newPosts_ids = [...user.savePosts, postId]

            user.savePosts = newPosts_ids

            var userSave = await user.save()

            res.status(200).json(userSave)

        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'erro interno', errorLog: error})
        }

    },
    getPostsByUser: async (req, res) => {

        var { userId } = req.params

        try {
            
            var posts = await Post.find({user: userId}).exec()

            res.status(200).json(posts)

        } catch (error) {
            res.status({error: 'erro interno', errorLog: error})
        }

    }

}