
var bodyPost = document.getElementsByClassName('body-postagem')[0]
var content = document.getElementsByName('contentPost')[0]
var dateCreated = document.getElementsByName('createdAt-post')[0]
var dateUpdated = document.getElementsByName('updatedAt-post')[0]

//user id
var userId = document.getElementsByName('userId-post')[0]

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

//element number of likes
var numberOfLikes = btnLike.getElementsByTagName('small')[0]

const cardPost = {
    //dates
    updated: formatDate(dateUpdated.value),
    created: formatDate(dateCreated.value),
    likeEmpty: 'http://localhost:3000/img/btnLike.svg',
    likePress: 'http://localhost:3000/img/btnLikePress.svg',
    saveEmpty: 'http://localhost:3000/img/btnSave.svg',
    savePress: 'http://localhost:3000/img/btnSavePress.svg',
    ids_likes: [],

    checkLikeOfUser: () => {

        var isLike = cardPost.ids_likes.some(id => id == userId.value)

        isLike
            ? btnLike.children[0].src = cardPost.likePress
            : btnLike.children[0].src = cardPost.likeEmpty

    },

    checkPostSaveOfUser: () => {
        //under construction
    },

    getIdsOfLikes: () => {

        var inputsOfIds = [...cardLikes.getElementsByTagName('input')]

        cardPost.ids_likes = inputsOfIds.map(input => {
            return input.value
        })

    },

    setCountNumberLikes: () => {
        btnLike.children[0].src == cardPost.likePress
            ? btnLike.children[1].innerText = parseInt(btnLike.children[1].innerText) + 1
            : btnLike.children[1].innerText = parseInt(btnLike.children[1].innerText) - 1
    },

    setLike: async () => {

        var queryLike = `?userId=${userId.value}&postId=${postId.value}`

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
            cardPost.setCountNumberLikes()

            try {
                var response = await requestAPI.get("/set-like" + queryLike)
            } catch (error) {
                console.log(error)
            }

        } else {
            window.location.href = '/login'
        }
    },

    setSave: async () => {

        var query = `?userId=${userId.value}&postId=${postId.value}`

        if(userId.value){
            save = !save
    
            save
            ? btnSave.children[0].src = cardPost.savePress
            : btnSave.children[0].src = cardPost.saveEmpty
    
            try {
                var response = await requestAPI.get('/set-save'+query)
    
                console.log(response)
            } catch (error) {
                console.log(error)
            }
        }else{
            window.location.href = '/login'
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

        //get ids of users liked
        cardPost.getIdsOfLikes()

        //check if user is like
        cardPost.checkLikeOfUser()

        //event listener on the buttons like and save
        for (var eventType of ['mouseout', 'mouseover']) {
            btns.forEach(btn => {
                btn.addEventListener(eventType, cardPost.hoverEffectBtns)
            })
        }

        //event listener - button like post
        btnLike.addEventListener('click', cardPost.setLike)
        
        //event listener - button save post
        btnSave.addEventListener('click', cardPost.setSave)

    }
}

cardPost.initPost()