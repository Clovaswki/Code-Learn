const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: [{}],
    user:{
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
        required: true
    },
    numberLike:[
        
    ]
}, {timestamps: true})

mongoose.model('posts', Post)