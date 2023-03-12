//formating words of each paragraph
const checkFormat = (p) => {

    let bold = "**",
        italic = "__",
        quote = ">>",
        codeBlock = "``",
        link = "++"

    let word = ''

    if (p.includes(codeBlock)) {//code block

        let word = p.split(codeBlock)
        let formatingWord = word[Math.floor(word.length / 2)]
        let paragraphs = formatingWord.split('\n').filter(t => t != '')

        let block = document.createElement('span')
        block.setAttribute('class', 'codeBlock')

        paragraphs.forEach(paragraph => {
            let text = document.createElement('p')
            text.innerHTML = paragraph
            block.appendChild(text)
        })

        p = block

    } else {

        if (p.includes(bold)) {//text in bold
            word = p.split(bold)

            if (word.length > 3) {
                if (word.indexOf('**') == 0) {
                    for (let i = 1; i <= word.length - 1; i += 2) {
                        word[i - 1] = "<strong>" + word[i - 1] + "</strong>"
                    }
                    p = `${word.join(' ')}`
                } else {
                    for (let i = 1; i <= word.length - 1; i += 2) {
                        word[i] = "<strong>" + word[i] + "</strong>"
                    }
                    p = `${word.join(' ')}`
                }
            } else {
                word[Math.floor(word.length / 2)] = "<strong>" + word[Math.floor(word.length / 2)] + "</strong>"
                p = `${word.join(' ')}`
            }

        }
        if (p.includes(italic)) {//text in italic
            word = p.split(italic)

            if (word.length > 3) {
                if (word.indexOf('__') == 0) {
                    for (let i = 1; i <= word.length - 1; i += 2) {
                        word[i - 1] = "<i>" + word[i - 1] + "</i>"
                    }
                    p = `${word.join(' ')}`
                } else {
                    for (let i = 1; i <= word.length - 1; i += 2) {
                        word[i] = "<i>" + word[i] + "</i>"
                    }
                    p = `${word.join(' ')}`
                }
            } else {
                word[Math.floor(word.length / 2)] = "<i>" + word[Math.floor(word.length / 2)] + "</i>"
                p = `${word.join(' ')}`
            }
        }
        if (p.includes(quote)) {//text quote
            word = p.split(quote)
            word[Math.floor(word.length / 2)] = "<p class='quote'>" + word[Math.floor(word.length / 2)] + "</p>"
            p = `${word.join(' ')}`
        }
        if (p.includes(link)) {
            word = p.split(link)
            let getLink = ''

            if (word.length > 3) {
                if (word.indexOf('++') == 0) {
                    for (let i = 1; i <= word.length - 1; i += 2) {
                        getLink = word[i - 1].split('[')[1].split(']')[0]
                        word[i - 1] = `<a href='${getLink}'>${word[i - 1].split('[')[0]}</a>`
                    }
                    p = `${word.join(' ')}`
                } else {
                    for (let i = 1; i <= word.length - 1; i += 2) {
                        getLink = word[i].split('[')[1].split(']')[0]
                        word[i] = `<a href='${getLink}'>${word[i].split('[')[0]}</a>`
                    }
                    p = `${word.join(' ')}`
                }
            } else {
                getLink = word[Math.floor(word.length / 2)].split('[')[1].split(']')[0]
                word[Math.floor(word.length / 2)] = `<a href='${getLink}'>` + word[Math.floor(word.length / 2)].split('[')[0] + "</a>"
                p = `${word.join(' ')}`
            }
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
    baseURL: location.protocol + "//" + location.host,
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

        try {
            var response = await fetch(requestAPI.baseURL + endpoint, headers)

            var data = await response.json()

            return data
        } catch (error) {
            return error
        }
    },
    get: async (endpoint) => {

        var myHeaders = new Headers()
        var headers = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        }

        try {
            var response = await fetch(requestAPI.baseURL + endpoint, headers)

            var data = await response.json()

            return data
        } catch (error) {
            return error
        }

    }
}

//random items
const randomItems = function (data, limitItems) {
    var length = data.length
    var item = data[Math.floor(Math.random() * length)]
    var array = []

    for (var i = 0; i < limitItems; i++) {
        while (array.includes(item)) {
            item = data[Math.floor(Math.random() * length)]
        }
        array.push(item)
    }

    return array
}

//post component
const postComponent = {
    
    //set save
    savePost: async (element) => {
        
        //change element
        element.src = element.src.split("/img/")[1] === "btnSave.svg"
        ? "/img/btnSavePress.svg"
        : "/img/btnSave.svg"

        //get post id
        const getPostId = element.parentNode.getElementsByTagName("input")[0].value
        
        const query = `?postId=${getPostId}`

        if(!userId.value){
            return window.location.href = '/login'
        }

        try {
            await requestAPI.get('/set-save'+query)
            
            //if save post update cookie
            let userStorage = auth.getUserLocalStorage()

            userStorage.savePosts = element.src.split("/img/")[1] !== "btnSave.svg"
            ? [...userStorage.savePosts, getPostId]
            : userStorage.savePosts.filter( post => post != getPostId)
            
            auth.setUserLocalStorage(userStorage)

        } catch (error) {
            console.log(error)
        }
    },

    checkPostIsSaved: (element) => {

        if(userIdAuth.value){
            const savePosts = auth.getUserLocalStorage().savePosts
    
            const postId = element.parentNode.getElementsByTagName("input")[0].value
    
            //check if this post it's saved
            let currentPost = savePosts.find( post => post === postId )
    
            element.src = typeof currentPost === "undefined" 
            ? "/img/btnSave.svg" 
            : "/img/btnSavePress.svg"
        }

    },
    
    cardComponent: function(data){

        const { img, username, title, date, postId } = data

        const savePosts = auth.getUserLocalStorage().savePosts

        //check if this post it's saved
        let currentPost = savePosts.find( post => post === postId )
        
        return `
            <div class="postOfCategory" onClick="">
                <div class="contentPost">
                    <div id="postIcon">
                        <img src="/img/post.png" alt="postIcon">
                    </div>
                    <a href="/post/${postId}" style="text-decoration: none;">
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
                    </a>
                </div>
                <div class="lineDivider"></div>
                <div>
                    <img 
                        id="btnSavePost" 
                        src="${typeof currentPost === "undefined" ? "/img/btnSave.svg" : "/img/btnSavePress.svg"}" 
                        alt="markPost" 
                        style="z-index: 1000" 
                        onClick="postComponent.savePost(this)"
                    >    
                    <input value="${postId}" type="hidden">
                </div>
            </div>
        `
    }

}

//styles css
var styles = function (obj, atrs) {
    var style = []
    Object.entries(atrs).forEach(([key, value]) => {
        style.push(`${key}:${value};`)
        obj.setAttribute('style', `${style.join(' ')}`)
    })
    style = []
}



//data of user authenticated
const auth = {
    checkAuth: async function () {

        try {

            var response = await requestAPI.get('/check-auth')

            if (response.auth) {
                auth.setUserLocalStorage(response.user)
            }
            else if (!response.auth) {
                auth.setUserLocalStorage(null)
            }

        } catch (error) {
            console.log(error)
            auth.setUserLocalStorage(null)
        }

    },
    setUserLocalStorage: function (user) {

        localStorage.setItem('user-codeLearn', user ? JSON.stringify(user) : null)

    },
    getUserLocalStorage: function () {

        var user = localStorage.getItem('user-codeLearn')
        var data = JSON.parse(user)
        return data

    }

}

auth.checkAuth()