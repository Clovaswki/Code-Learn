const postsByCategory = {
    posts: [...document.getElementsByClassName('postOfCategory')],
    cardPosts: document.getElementsByClassName('cardPosts-category')[0],
    
    noPostsComponent(){

        let element = `
        <div class="d-flex align-items-center justify-content-center" style="height: 100%;">
            <span class="d-flex flex-column align-items-center gap-3">
                <img src="/img/noPost.png" width="100px" height="100px" style="opacity: .6"/>
                <h5 class="text-muted">Nenhuma postagem para esta categoria!</h5>
            </span>
        </div>
        `
        postsByCategory.cardPosts.innerHTML = element

    },

    initPostsByCategory: function(){
        if(this.posts.length == 0){
            postsByCategory.noPostsComponent()
            styles(postsByCategory.cardPosts, {
                "flex": "none",
                "height": "100vh"
            })
        }else{
            this.posts.forEach(post => {
                
                let cardInsertDate = post.getElementsByTagName('small')[0]
                let date = post.getElementsByTagName('input')[1].value

                cardInsertDate.innerHTML = 'Postado em ' + formatDate(date)
                
            })
        }
    }
}

location.pathname.includes('/posts') && postsByCategory.initPostsByCategory()