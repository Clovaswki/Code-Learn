

const postHomePage = {
    colors: ['#bb3939', '#4623df', '#33c575', '#cbce41', '#c560c0'],
    categoriesPostHomePage: [...document.querySelectorAll('.postHomePage .postInfo-postHomePage small')],
    postsHomePage: [...document.getElementsByClassName('postHomePage')],
    like: false,
    userId: '',
    postId: '',
    btnsLike: [...document.getElementsByClassName('btnLike-postHomePage')],
    userId: document.getElementById('userIdAuth').value,
    imgLikeEmpty: requestAPI.baseURL + '/img/btnLike.svg',
    imgLikePress: requestAPI.baseURL + '/img/btnLikePress.svg',
    iconSave: [...document.getElementsByClassName("iconSavePostHomePage")],

    applyRandomColorsInCategories: function () {

        postHomePage.categoriesPostHomePage.forEach(category => {

            let color = postHomePage.colors[Math.floor(Math.random() * 5)]

            let hastagText = `<p class="m-0" style="color: ${color};">#</p>`

            category.innerHTML = hastagText + `<p class="m-0">${category.innerHTML}</p>`
        })

    },

    formatDate: function () {

        postHomePage.postsHomePage.forEach((post, index) => {

            let date = post.getElementsByTagName('input')[1].value
            let cardDate = post.getElementsByClassName('cardDate-postHomePage')[0]
            let format = formatDate(date).split('/')

            let months = ['', 'Jan', 'Fev', 'Mar', 'Abril', 'Maio', 'Jun', 'Jul', 'Agosto', 'Set', 'Out', 'Nov', 'Dez']

            cardDate.innerHTML = `${format[2]}, ${format[0]} de ${months[parseInt(format[1])]}`

        })

    },

    checkUserIsLiked: async function () {

        if (postHomePage.userId) {
            postHomePage.postsHomePage.forEach(async post => {

                var id = post.getElementsByTagName('input')[0].value
                var imgLike = post.querySelector('.buttons-postHomePage span img')
                var numberLike = post.querySelector('.buttons-postHomePage span p')

                try {
                    var response = await requestAPI.get('/get-allposts?postId=' + id)

                    var isLiked = response.numberLike.some(likeId => likeId == postHomePage.userId)

                    if (isLiked) {
                        imgLike.src = postHomePage.imgLikePress
                    } else {
                        imgLike.src = postHomePage.imgLikeEmpty
                    }

                    numberLike.innerHTML = response.numberLike.length + " curtidas"

                } catch (error) {
                    console.log(error)
                }
            })
        }

    },

    setLike: async function (event) {

        var parentNode = event.target.parentNode,
            postId = parentNode.getElementsByTagName('input')[0].value,
            query = `?postId=${postId}`

        try {
            var response = await requestAPI.get("/set-like" + query)

            if (response.status == 204) return location.href = '/login'

        } catch (error) {
            console.log(error)
        }

        postHomePage.checkUserIsLiked()
    },

    formatDescription: function () {

        var charLimit = 35

        this.postsHomePage.forEach(post => {

            var description = post.querySelector('.userInfo-postHomePage small')

            if (description.innerText.length > charLimit) {
                var newDescription = description.innerText.slice(0, charLimit - 1)
                description.innerHTML = `${newDescription}...`
            }

        })

    },

    //check if exists a authetication
    checkAuth: () => {

        const user = document.getElementById("userIdAuth")

        postHomePage.iconSave.forEach(post => {

            if(!user.value){
                post.style.display = "none"
            }else{
                let imgElement = post.getElementsByTagName("img")[0]
                postComponent.checkPostIsSaved(imgElement)
            }

        })

    },


    initPostHomePage: function () {

        postHomePage.applyRandomColorsInCategories()

        postHomePage.formatDate()

        postHomePage.formatDescription()

        postHomePage.btnsLike.forEach(btn => btn.addEventListener('click', postHomePage.setLike))

        postHomePage.checkUserIsLiked()

        //check if user is authenticated
        postHomePage.checkAuth()
    }

}

location.pathname == '/' && postHomePage.initPostHomePage()