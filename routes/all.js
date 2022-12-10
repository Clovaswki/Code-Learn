const express = require('express')
const router = express.Router()

//controllers
//controller category
const {
    getCategories
} = require('../controllers/categoryController')
//controllers post
const {
    putPost, 
    getPost,
    setLikePost,
    setSavePost,
    getPostsByUser
} = require('../controllers/postController')

//controllers auth
const { checkAuth } = require('../controllers/authController')
    
//categories
        //get all categories
        router.get('/get-categories', getCategories)

    //posts
        //send a post
        router.post('/send-post', putPost)

        //get all posts
        router.get('/get-allposts', getPost)

        //set like
        router.get('/set-like', setLikePost)

        //set save post
        router.get('/set-save', setSavePost)

        //get posts created by user
        router.get('/get-postsByUser/:userId', getPostsByUser)

    //user
        //check authentication
        router.get('/check-auth', checkAuth)
        
module.exports = router