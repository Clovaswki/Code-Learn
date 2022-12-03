if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI: "mongodb+srv://clodo:prime123@cluster0.f2p2p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"}
}else{
    module.exports ={mongoURI: "mongodb://localhost/codelearn"}
}
//module.exports ={mongoURI: "mongodb://localhost/codelearn"}
// module.exports = {mongoURI: "mongodb+srv://clodo:prime123@cluster0.f2p2p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"}