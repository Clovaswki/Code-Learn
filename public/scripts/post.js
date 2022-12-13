
var bodyPost = document.getElementsByClassName('body-postagem')[0]
var content = document.getElementsByName('contentPost')[0]
var dateCreated = document.getElementsByName('createdAt-post')[0]
var dateUpdated = document.getElementsByName('updatedAt-post')[0]

//user id
var userId = document.getElementById('userIdAuth')

//post id
var postId = document.getElementsByName('postId-post')[0]

//buttons
var btnLike = document.getElementById('btn-like')
var btnSave = document.getElementById('btn-save')
var btns = [btnLike, btnSave]

var save = false
var like = false

//info of user
var fieldDates = document.querySelector('#infoUserPost div small')

//number like
var cardLikes = document.getElementById('number-like')

const cardPost = {
    //dates
    updated: formatDate(dateUpdated.value),
    created: formatDate(dateCreated.value),
    btnLikeMobile: document.getElementById('btn-like-mobile'),
    likeEmpty: requestAPI.baseURL+'/img/btnLike.svg',
    likePress: requestAPI.baseURL+'/img/btnLikePress.svg',
    saveEmpty: requestAPI.baseURL+'/img/btnSave.svg',
    savePress: requestAPI.baseURL+'/img/btnSavePress.svg',
    ids_likes: [],
    bodyMoreCategories: document.getElementsByClassName('body-moreCategories')[0],
    postsReadNext: document.getElementsByClassName('posts-read-next')[0],
    colors: ['#bb3939', '#4623df', '#33c575', '#cbce41', '#c560c0'],
    months: ['', 'Jan', 'Fev', 'Mar', 'Abril', 'Maio', 'Jun', 'Jul', 'Agosto', 'Set', 'Out', 'Nov', 'Dez'],

    checkLikeOfUser: (btn) => {

        var isLike = cardPost.ids_likes.some(id => id == userId.value)

        isLike
            ? btn.children[0].src = cardPost.likePress
            : btn.children[0].src = cardPost.likeEmpty

    },

    checkPostSaveOfUser: () => {
        btnSave.children[0].src = cardPost.savePress
        btnSave.children[0].src = cardPost.saveEmpty
        
        var user = auth.getUserLocalStorage()
        
        if(user){

            //under construction
            
            console.log(auth.getUserLocalStorage().savePosts)

        }
    },

    getIdsOfLikes: () => {

        var inputsOfIds = [...cardLikes.getElementsByTagName('input')]

        cardPost.ids_likes = inputsOfIds.map(input => {
            return input.value
        })

    },

    setCountNumberLikes: (btn) => {
        btn.children[0].src == cardPost.likePress
            ? btn.children[1].innerText = parseInt(btn.children[1].innerText) + 1
            : btn.children[1].innerText = parseInt(btn.children[1].innerText) - 1
    },

    setLike: async (event) => {

        var queryLike = `?postId=${postId.value}`

        if (userId.value) {

            like = !like

            if(cardPost.ids_likes.length == 0){
                cardPost.ids_likes = [...cardPost.ids_likes, userId.value]
            }else{
                like
                    ? cardPost.ids_likes = cardPost.ids_likes.filter(id => id != userId.value)
                    : cardPost.ids_likes = [...cardPost.ids_likes, userId.value]
            }

            cardPost.checkLikeOfUser()
            cardPost.setCountNumberLikes(event.target)

            try {
                var response = await requestAPI.get("/set-like" + queryLike)
            } catch (error) {
                console.log(error)
            }

        } else {
            window.location.href = '/login'
        }
    },

    //save the post on the user authenticated
    setSave: async () => {

        var query = `?postId=${postId.value}`

        if(!userId.value){
            return window.location.href = '/login'
        }

        save = !save

        cardPost.checkPostSaveOfUser()

        try {
            var response = await requestAPI.get('/set-save'+query)
            // console.log(response)
        } catch (error) {
            console.log(error)
        }

    },

    getCategories: async function(){

        try {
            
            var categories = await requestAPI.get('/get-categories')

            this.bodyMoreCategories.innerHTML = ''

            if(categories || categories.length > 0){

                styles(this.bodyMoreCategories, {
                    "display": "grid",
                    "justify-content": "start"
                })

                var maxLoop = categories.length > 9 ? 9 : categories.length 

                categories = randomItems(categories, maxLoop)

                for(var i = 0; i < maxLoop; i++){

                    var randomColor = this.colors[Math.floor(Math.random() * this.colors.length)]
    
                    this.bodyMoreCategories.innerHTML +=
                        `
                        <a href="/posts/${categories[i]._id}" style="text-decoration: none;">
                            <span class="d-flex">
                                <p class="m-0" style="color: ${randomColor};">#</p>
                                <p class="m-0">${categories[i].nome}</p>
                            </span>
                        </a>
                        `

                }

            }

        } catch (error) {
            console.log(error)
            this.bodyMoreCategories.innerHTML = `
                <div class="d-flex gap-2 align-items-center">
                    <img src="/img/frown-face.png" width="30px" height="30px"/>
                    <p class="m-0 fw-bold opacity-50">Erro 404</p>
                </div>
            `
        }

    },

    //post read next component
    postReadNext: function(id, title, img, name, date){

        return `<a href="/post/${id}" style="text-decoration: none;">
        <span class="d-flex gap-3 align-items-center" style="color: black;">
                <img src="data:image/jpg;base64,${img}" alt="user" width="65px" height="65px" style="border-radius: 50%; object-fit:cover;"/>
                <div style="padding: .2rem 0;">
                    <p class="h5 fw-bold opacity-75" style="margin: 0; margin-bottom: .4rem;">${title}</p>
                    <small class="fs-6 text-muted">${name} - ${date}</small>
                </div>
        </span>
        </a>
        `
    },

    //get posts to read next
    getPosts: async function(){

        try {
            var posts = await requestAPI.get('/get-allposts')
            
            this.postsReadNext.innerHTML = ''

            var limitPosts = 4

            posts = randomItems(posts, limitPosts)
            
            if(posts || posts.length > 0){
                for(var i = 0; i < limitPosts; i++){    
                    var { _id, user, title, createdAt } = posts[i]

                    var format = formatDate(createdAt).split('/')

                    var date = `${format[2]}, ${format[0]} de ${this.months[format[1]]}`

                    this.postsReadNext.innerHTML += this.postReadNext(_id, title, user.file, user.nome, date)
                }
            }

        } catch (error) {
            console.log(error)
        }

    },

    //formating post content accords specials characters
    formatingContentPost: (text) => {
        //gambiarra
        var paragraphs_suite1 = text.split('\r\n\r\n')
        var paragraph_suite2 = text.split('\n\n')
        var paragraphs = []

        if (paragraph_suite2.length != paragraphs_suite1.length) {
            paragraphs = paragraph_suite2 > paragraphs_suite1 ?
                paragraph_suite2 :
                paragraphs_suite1
        }//gambiarra

        paragraphs.forEach(paragraph => {

            var format = checkFormat(paragraph)

            if (typeof format == 'object') {
                return bodyPost.appendChild(format)
            }

            bodyPost.innerHTML += `<p class="m-0">${format}</p>`

        })
    },
    //effect of buttons
    hoverEffectBtns: (event) => {
        var urlServer = requestAPI.baseURL
        var likeEmpty = urlServer + '/img/btnLike.svg',
            saveEmpty = urlServer + '/img/btnSave.svg',
            likePress = urlServer + '/img/btnLikePress.svg',
            savePress = urlServer + '/img/btnSavePress.svg'

        var button = event.target

        if (button.id == 'btn-like') {
            if (like) button.children[0].src = event.type == 'mouseover' ? likePress : likeEmpty
        } else {
            if (save) button.children[0].src = event.type == 'mouseover' ? savePress : saveEmpty
        }

    },

    initPost: () => {
        fieldDates.innerHTML = `Postado em ${cardPost.created} - atualizado em ${cardPost.updated}`

        //content post
        cardPost.formatingContentPost(content.value)

        //get categories
        cardPost.getCategories()

        //get posts to read next
        cardPost.getPosts()

        //get ids of users liked
        cardPost.getIdsOfLikes()

        //check if user is like
        for(var btnOfLike of [btnLike, cardPost.btnLikeMobile]){
            cardPost.checkLikeOfUser(btnOfLike)
        }

        //check if user is save
        cardPost.checkPostSaveOfUser()

        //event listener on the buttons like and save
        for (var eventType of ['mouseout', 'mouseover']) {
            btns.forEach(btn => {
                btn.addEventListener(eventType, cardPost.hoverEffectBtns)
            })
        }

        //event listener - button like post
        btnLike.addEventListener('click', cardPost.setLike)
        cardPost.btnLikeMobile.addEventListener('click', cardPost.setLike)
        
        //event listener - button save post
        btnSave.addEventListener('click', cardPost.setSave)

    }
}

cardPost.initPost()