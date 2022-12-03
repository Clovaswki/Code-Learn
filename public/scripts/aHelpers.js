//formating words of each paragraph
const checkFormat = (p) => {

    var bold = "**",
        italic = "__",
        quote = ">>",
        codeBlock = "``",
        link = "++"

    var word = ''

    if (p.includes(bold)) {//text in bold
        word = p.split(bold)

        if(word.length > 3){
            if(word.indexOf('**') == 0){
                for(var i = 1; i <= word.length - 1; i+=2){
                    word[i-1] = "<strong>"+word[i-1]+"</strong>"
                }
                p = `${word.join(' ')}`
            }else{
                for(var i = 1; i <= word.length - 1; i+=2){
                    word[i] = "<strong>"+word[i]+"</strong>"
                }
                p = `${word.join(' ')}`
            }
        }else{
            word[Math.floor(word.length / 2)] = "<strong>" + word[Math.floor(word.length / 2)] + "</strong>"
            p = `${word.join(' ')}`
        }

    }
    if (p.includes(italic)) {//text in italic
        word = p.split(italic)

        if(word.length > 3){
            if(word.indexOf('__') == 0){
                for(var i = 1; i <= word.length - 1; i+=2){
                    word[i-1] = "<i>"+word[i-1]+"</i>"
                }
                p = `${word.join(' ')}`
            }else{
                for(var i = 1; i <= word.length - 1; i+=2){
                    word[i] = "<i>"+word[i]+"</i>"
                }
                p = `${word.join(' ')}`
            }
        }else{
            word[Math.floor(word.length / 2)] = "<i>" + word[Math.floor(word.length / 2)] + "</i>"
            p = `${word.join(' ')}`
        }
    }
    if (p.includes(quote)) {//text quote
        word = p.split(quote)
        word[Math.floor(word.length / 2)] = "<p class='quote'>" + word[Math.floor(word.length / 2)] + "</p>"
        p = `${word.join(' ')}`
    }
    if (p.includes(codeBlock)) {//code block

        var word = p.split(codeBlock)
        var formatingWord = word[Math.floor(word.length / 2)]
        var paragraphs = formatingWord.split('\n').filter(t => t != '')
        
        var block = document.createElement('span')
        block.setAttribute('class', 'codeBlock')

        paragraphs.forEach(paragraph => {
            var text = document.createElement('p')
            text.innerHTML = paragraph
            block.appendChild(text)
        })

        p = block

    }
    if(p.includes(link)){
        word = p.split(link)
        var getLink = ''

        if(word.length > 3){
            if(word.indexOf('++') == 0){
                for(var i = 1; i <= word.length - 1; i+=2){
                    getLink = word[i-1].split('[')[1].split(']')[0]
                    word[i-1] = `<a href='${getLink}'>${word[i-1].split('[')[0]}</a>`
                }
                p = `${word.join(' ')}`
            }else{
                for(var i = 1; i <= word.length - 1; i+=2){
                    getLink = word[i-1].split('[')[1].split(']')[0]
                    word[i] = `<a href='${getLink}'>${word[i].split('[')[0]}</a>`
                }
                p = `${word.join(' ')}`
            }
        }else{
            getLink = word[Math.floor(word.length / 2)].split('[')[1].split(']')[0]
            word[Math.floor(word.length / 2)] = `<a href='${getLink}'>` + word[Math.floor(word.length / 2)].split('[')[0] + "</a>"
            p = `${word.join(' ')}`
        }
    }

    return p

}

//format date
const formatDate = (currentDate) => {

    var date = new Date(Date.parse(currentDate)),

    formatDay = date.getDate().toString().length === 1 ?
    '0' + date.getDate().toString() : date.getDate(),
    
    month = date.getMonth() + 1,
    
    formatMonth = month.toString().length === 1 ?
    '0' + month.toString() : month,
    
    format = `${formatDay}/${formatMonth}/${date.getFullYear()}`
    
    return format
}

//request to api of system
const requestAPI = {
    //baseURL: 'http://localhost:3000',
    baseURL: "https://"+location.host,
    post: async (endpoint, body) => {

        var headers = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(body)
        }

        var response = await fetch(requestAPI.baseURL+endpoint, headers)

        var data = await response.json()

        return data
    },
    get: async (endpoint) => {

        var myHeaders = new Headers()
        var headers = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        } 

        var response = await fetch(requestAPI.baseURL+endpoint, headers)

        var data = await response.json()

        return data
        
    }
}

//post component
var postComponent = function(data){

    var { img, username, title, date, postId } = data

    return `
    <a href="/post/${postId}" style="text-decoration: none;">
        <div class="postOfCategory" onClick="">
            <div class="contentPost">
                <div id="postIcon">
                    <img src="/img/post.png" alt="postIcon">
                </div>
                <div class="infoOfPost">
                    <span class="title">
                        <p>${title}</p>
                        <small>Postado em ${formatDate(date)}</small>
                    </span>
                    <span class="infoUser">
                        <img src="${img}" alt="user">
                        <small>${username}</small>
                    </span>
                </div>
            </div>
            <div class="lineDivider"></div>
            <img id="btnSavePost" src="/img/btnSave.svg" alt="markPost">
        </div>
    </a>
    `
}