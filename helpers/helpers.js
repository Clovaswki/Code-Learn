
const fs = require('fs')//modules

module.exports = {

    //access of routes
    admin: (req, res, next) => {
        if(req.isAuthenticated() && req.user.adm == true){
            return next()
        }else{
            req.flash('error', 'Faça login para acessar esta página!')
            res.redirect('/')
        }
    },
    //validation primary of form login
    loginFlash: (req, res, next) => {
        if(!req.body.username && !req.body.password){
            req.flash('error', 'Usuário e senha inválidos!')
            res.redirect('/login')
        }else if(req.body.username && !req.body.password){
            req.flash('error', 'Digite a sua senha!')
            res.redirect('/login')
        }else{
            return next()
        }
    },
    //conversion of img in string of base64
    fileEncode: (file) => {
        let bitmap = fs.readFileSync(file, err => console.log("Erro na leitura: "+err))
        return Buffer.from(bitmap).toString('base64')
    }
    /*fileDecode: (string64, filename) => {
        let bitmap = Buffer.from(string64, 'base64')
        fs.writeFile('./public/imgUsers/'+filename, bitmap, 'binary', err => {if(err)console.log(err)})
    }*/

}