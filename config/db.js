if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI: "mongodb+srv://clodaski:prime123@cluster0.zdr37a1.mongodb.net/codelearn?retryWrites=true&w=majority"}
}else{
    module.exports ={mongoURI: "mongodb://127.0.0.1/codelearn"}
}