
//scope
var currentDate = document.getElementById('createdUser').value
var cardDate = document.getElementById('date-user').children[1]
var cardBtnShowPosts = document.getElementById('injectBtnSowPosts')

//modal profile
var modalProfile= document.getElementsByClassName('modal-profile')[0]
var btnCloseModalProfile = document.getElementById('btnClose-modalProfile')

//number of user posts
var cardNumberPosts = document.querySelector('#postsUser span p')

//user 
var id = document.getElementsByName('userId-profile')[0].value
var userImg = document.querySelector('.contentImg span img').src
var username = document.getElementById('nameUser').innerText

//posts created by user
var posts = []

//element inject post created by user
var cardInjectPosts = document.getElementById('injectPostsCreated')

var btnShowPosts = `
    <button onClick="profile.modalProfile()" class="btn btn-outline-primary">
        Mostrar
    </button>
`

const profile = {

    random: function(array, data) {
        
        var length = data.length
        var obj = data[Math.floor(Math.random() * length)]
        
        while (array.includes(obj)) {
            obj = data[Math.floor(Math.random() * length)]
        }
        
        array.push(obj)
        
        return obj
        
    },
    
    randomCategories: async () => {
        
        var cardLoad = document.getElementById('card-load')
        var cardCategories = document.querySelector('[data_categories]')
        
        var colors = ['#2A8CC2', '#e0ce9d', '#91cf98', '#9586bd']
        
        //get all categories of system api
        try {
            
            var data = await requestAPI.get('/get-categories')
            
            cardLoad.parentNode.removeChild(cardLoad)//remove load
            
            var categories = []
            
            if (data.length <= 3) {
                categories = [...data]
            } else {
                
                var aleatory = []
                
                for (var i = 0; i < 3; i++) {
                    profile.random(aleatory, data)
                }
                
                categories = [...aleatory]
            }
            
            categories.forEach(category => {
                
                var randomBackground = colors[Math.floor(Math.random() * 4)]
                
                cardCategories.innerHTML += `
                <a href="/posts/${category._id}" style="text-decoration: none;">
                    <div class="componentCategory-cardProfile" style="background: ${randomBackground}">
                    <img src="/img/hastag.png" alt="hastag" width="30px" height="30px">
                    <p class="m-0">${category.nome}</p>
                    </div>
                </a>
                `
            })
        } catch (error) {
            console.log(error)
        }
        
    },
    
    buttonShowPostsCreated: function(bool){
        
        true
        ? cardBtnShowPosts.innerHTML = btnShowPosts
        : cardBtnShowPosts.innerHTML = ''

    },

    getPostsCreatedByuser: async function(){
        const param = id
        try {
            var response = await requestAPI.get('/get-postsByUser/'+param)
            
            if(response.length > 0){
                profile.buttonShowPostsCreated()
                posts = [...response]
                cardNumberPosts.innerHTML =  response.length+" Posts publicados"
            }

        } catch (error) {
            console.log(error)
        }

    },

    modalProfile: function(){

        //set none 
        cardInjectPosts.innerHTML = ''

        modalProfile.classList.toggle('showModalProfile')
            
            posts.forEach( ({title, _id, createdAt}) => {
                var data = {
                    img: userImg,
                    username,
                    title,
                    postId: _id,
                    date: createdAt
                }
                cardInjectPosts.innerHTML += postComponent.cardComponent(data)
            })
        
    },
    
    initProfile: function(){
        
        //request and random selection of categories
        profile.randomCategories()
        
        //format date of profile
        cardDate.innerHTML += formatDate(currentDate)


        profile.getPostsCreatedByuser()

        //event listener close modal
        btnCloseModalProfile.addEventListener('click', profile.modalProfile)
        
    }
}

location.pathname == '/perfil' && profile.initProfile()