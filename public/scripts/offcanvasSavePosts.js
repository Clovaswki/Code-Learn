
const offcanvasSavePosts = {
    
    bodyOffcanvas: document.getElementsByClassName('posts-offcanvas')[0],
    savePosts: [],
    savePostsElements: [],
    inputSearch: document.getElementById('searchSavePosts'),
    btnOffcanvas: document.getElementById('btn-offcanvas'),
    btnOffcanvasMobile: document.getElementById('btnOffcanvasMobile'),
    numberPostsElement: document.getElementById('numberPosts-savePosts'),
    months: ['', 'Jan', 'Fev', 'Mar', 'Abril', 'Maio', 'Jun', 'Jul', 'Agosto', 'Set', 'Out', 'Nov', 'Dez'],

    componentSavePost(post){

        var { title, user, createdAt, _id } = post

        let date = formatDate(createdAt),
            splitDate = date.split('/'),
            dateFormating = `${splitDate[2]}, ${splitDate[0]} de ${this.months[parseInt(splitDate[1])]}`
        
        const formatTitle = function(title) {

            if(title.length >= 50){
                title = title.slice(0, 50)
                title = title+'...'
            }

            return title

        }

        var component = `
        <a href="/post/${_id}" style="text-decoration: none; color: black;">
        <div class="p-2 savePost-component my-3 p-3 bg-body rounded shadow-sm">
            <span class="d-flex flex-column gap-2 mb-2">
                <p class="m-0 h5">${formatTitle(title)}</p>
            </span>
            <span class="d-flex justify-content-between">
                <div class="d-flex gap-2 align-items-center">
                    <img 
                        src="data:image/jpg;base64,${user.file}" 
                        width="30px" 
                        height="30px"
                        style="border-radius: 50%; object-fit: cover;"
                    />
                    <small>${user.nome}</small>
                </div>
                <div>
                    <small>${dateFormating}</small>
                </div>
            </span>
        </div>
        </a>
        `

        offcanvasSavePosts.bodyOffcanvas.innerHTML += component

    },

    searchPost(event){

        let value = event.target.value

        offcanvasSavePosts.savePostsElements.forEach( post => {

            if(post.innerHTML.toLowerCase().includes(value.toLowerCase())){
                post.style.display = 'block'
            }else{
                post.style.display = 'none'
            }

        })

    },

    async getPosts(){
        
        var posts = await requestAPI.get('/get-many-posts')
        
        offcanvasSavePosts.savePosts = [...posts]

        offcanvasSavePosts.bodyOffcanvas.innerHTML = ''

        if(posts.length == 0){

            let noSavePosts = `
            <div class="w-100 d-flex align-items-center justify-content-center" style="height: 80%">
                
                <span class="d-flex align-items-center flex-column gap-3">
                    <img src="/img/addPost.png" width="70px" height="70px" class="opacity-75"/>
                    <h6>Nenhuma postagem salva!</h6>
                </span>

            </div>
            `

            offcanvasSavePosts.bodyOffcanvas.innerHTML = noSavePosts

            return
        }

        offcanvasSavePosts.savePosts.forEach( post => {
            offcanvasSavePosts.componentSavePost(post)
        })

        this.savePostsElements = [...document.getElementsByClassName('savePost-component')]

        this.numberPostsElement.innerHTML = this.savePosts.length+' posts'

    },

    async init(){

        var userAuth = document.getElementById('userIdAuth').value//check auth

        let buttons = [offcanvasSavePosts.btnOffcanvas, offcanvasSavePosts.btnOffcanvasMobile]

        buttons.forEach( async button => {
           
            button.addEventListener('click', async () => {

                if(userAuth) await this.getPosts()
            
            })

        })

        //listener from search input
        this.inputSearch.addEventListener('input', this.searchPost)
    
    }

}

offcanvasSavePosts.init()