//scope
var navEdit = document.getElementById('navEdit')//nav edit
var navPreview = document.getElementById('navPreview')//nav preview
var preview = document.getElementsByClassName('body-paragraphs')[0]
var headerPreview = document.getElementById('titlePreview')
var input = document.getElementsByName('content')[0]
var caretPos = 0

var descriptionPost = document.getElementsByName('description')[0]
var slugPost = document.getElementsByName('slug')[0]
var titlePost = document.getElementById('inputTitle')

var btnPublish = [...document.getElementsByClassName('btnPublish')]
var btnRevert = document.getElementById('btnRevert')

var post_finalResult = ''

//btn close create post card
var closeCreatePost = document.getElementById('close-createPost')


function selectComponentByNavs() {

    var bodyCreatePost = document.querySelector('.body-createPost')//card create and edit a new post
    var previewCreatePost = document.querySelector('.preview-createPost')//card show results

    var navs = [navEdit, navPreview]

    navs.forEach(nav => {

        nav.addEventListener('click', (event) => {

            var otherNav = navs.find(n => n != event.target)
            event.target.classList.add('nav-active')//active nav press
            otherNav.classList.remove('nav-active')//disable other nav

            bodyCreatePost.style.display = nav.id == "navEdit" ? 'flex' : 'none'
            previewCreatePost.style.display = nav.id == "navEdit" ? 'none' : 'flex'

        })

    })
}
selectComponentByNavs()


//update position of mouse cursor in input
for (var eventType of ['keyup', 'click']) {
    input.addEventListener(eventType, e => {
        caretPos = e.target.selectionStart
       // console.log(caretPos)
        convertPost(input.value)
    })
}

function formatPostByTools() {

    var bold = document.getElementById('bold'),
        italic = document.getElementById('italic'),
        link = document.getElementById('link'),
        codeBlock = document.getElementById('codeBlock'),
        quote = document.getElementById('quote')

    var tools = [bold, italic, link, codeBlock, quote]

    tools.forEach(tool => {

        tool.addEventListener('click', event => {

            var text = input.value.split('')

            switch (tool.id) {
                case 'bold':
                    for (var index in text) {
                        if (index - 1 == caretPos - 1) {
                            text[index] = `**${text[index]}`
                        }else if(caretPos == text.length){
                            text = [...text, '**']
                        }
                    }
                    break
                case 'italic':
                    for (var index in text) {
                        if (index - 1 == caretPos - 1) {
                            text[index] = `__${text[index]}`
                        }else if(caretPos == text.length){
                            text = [...text, '__']
                        }
                    }
                    break
                case 'link':
                    for (var index in text) {
                        if (index - 1 == caretPos - 1) {
                            text[index] = `++${text[index]}`
                            
                            for(var i=index; i<text.length; i++){
                                if(text[i] == ' ') {
                                    text[i] = `[link]++ ` 
                                    break
                                }
                            }

                            break
                        }
                    }
                    break
                case 'codeBlock':
                    for (var index in text) {
                        if (index - 1 == caretPos - 1) {
                            text[index] = "\`\`" + text[index]
                        }else if(caretPos == text.length){
                            text = [...text, "\`\`"]
                        }
                    }
                    break
                case 'quote':
                    for (var index in text) {
                        if (index - 1 == caretPos - 1) {
                            text[index] = `>>${text[index]}`
                        }
                    }
                    break
            }

            input.value = `${text.join('')}`
            convertPost(input.value)
        })


    })

}
formatPostByTools()

//formating post by specials characters  
const convertPost = (text) => {
    preview.innerHTML = ''

    headerPreview.innerHTML = document.getElementById('inputTitle').value

    post_finalResult = text

    var paragraphs_suite1 = text.split('\r\n\r\n')
    var paragraph_suite2 = text.split('\n\n')
    var paragraphs = []

    if (paragraph_suite2.length != paragraphs_suite1.length) {
        paragraphs = paragraph_suite2 > paragraphs_suite1 ?
            paragraph_suite2 :
            paragraphs_suite1
    }//gambiarra
    
    if(paragraphs.length == 0){
        preview.innerHTML += `<p class="m-0">${checkFormat(text)}</p>`
    }else{
        paragraphs.forEach(paragraph => {
    
            var format = checkFormat(paragraph)
    
            if (typeof format == 'object') {
                return preview.appendChild(format)
            }
    
            preview.innerHTML += `<p class="m-0">${format}</p>`
    
        })
    }

}


//manipulation categories on the creation of a post
const categories = {
    
    cardCategoriesChoosed: document.getElementById('all-categoriesChoosed'),
    selectCategories: document.getElementById('selectCategories'),
    options: [...document.querySelectorAll('.selectCategories option')],
    allCategories: [],
    btnRemove: document.getElementById('removeCategories'),
    
    getCategories: async () => {
        
        var data = await requestAPI.get('/get-categories')

        categories.allCategories = [...data]

        const option = (name, value) => `<option value='${value}'>${name}</option>`    

        data.forEach( category => {
            selectCategories.innerHTML += option(category.nome, category._id)
        })

    },
    selectCategories: () => {
        
        const catChoosed = (name, id) => `<span class='lead fw-light' title='${id}'>#${name}</span>`

        selectCategories.addEventListener('change', event => {
            
            // if(categories.cardCategoriesChoosed.length)
            var cat = categories.allCategories.find( c => c._id === event.target.value)

            if(categories.cardCategoriesChoosed.childNodes.length - 1 <= 4){
                if(!categories.cardCategoriesChoosed.innerText.includes(cat.nome)){
                    categories.cardCategoriesChoosed.innerHTML += catChoosed(cat.nome, cat._id)
                }
            }

        })


    },
    removeCategories: () => {

        categories.btnRemove.addEventListener('click', () => {

            categories.cardCategoriesChoosed.innerHTML = ''

        })

    },
    getCategoriesChoosed: () => {

        var choosed = categories.allCategories.filter( cat => 
            categories.cardCategoriesChoosed.innerHTML.includes(cat._id)   
        )

        return choosed

    }
}

categories.getCategories()
categories.selectCategories()
categories.removeCategories()

//modal
    var modal = document.getElementsByClassName('modalCreatePost-publish')[0]
    var contentModal = modal.getElementsByClassName('contentModal-createPost')[0]
    var btnModalPublish = document.getElementById('btnModalPublish')

    //preload modal
    var preloadModal = `
    <span id="preload-modal">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <p>Publicando...</p>
    </span>
    `

//close modal event click
document.getElementsByClassName('btn-close')[0].addEventListener('click', () =>
    modal.classList.toggle('showModal')
)

//check if content of post is valid
var postIsValid = false

//all data of post
var dataOfPost = {}

//check all data of post for before publish
const checkPost = () => {

    var contentPost = post_finalResult,
        description = descriptionPost.value,
        slug = slugPost.value,
        categoriesChoosed = categories.getCategoriesChoosed(),
        title = titlePost.value,
        userId = document.getElementsByName('userId')[0].value

    var errors = []

    if(!contentPost || typeof contentPost == undefined || contentPost == null){
        errors.push({error: 'Conteúdo inválido'})
    }
    if(!description || typeof description == undefined || description == null){
        errors.push({error: 'Descrição inválida'})
    }
    if(!title || typeof title == undefined || title == null){
        errors.push({error: 'Título inválido'})
    }
    if(!slug || typeof slug == undefined || slug == null){
        errors.push({error: 'Slug inválida'})
    }
    if(!userId){
        errors.push({error: 'id de usuário não encontrada'})
    }
    if(categoriesChoosed.length == 0){
        errors.push({error: 'Nenhuma categoria selecionada'})
    }

    var successCard = `
        <div class="success-publish" >
            <img src="/img/ok.png" alt="ok" width="50px" height="50px">
            <p>Tudo pronto para publicar</p>
        </div>
    `

    const divAlert = (error) => `<div class="alert alert-danger" role="alert">${error}</div>`

    if(errors.length > 0){

        postIsValid = false

        contentModal.innerHTML = ''
        
        errors.forEach( error => {
            contentModal.innerHTML += divAlert(error.error)
        })
        
        //btn publish disabled
        btnModalPublish.disabled = true
        
        modal.classList.toggle('showModal')
    }else{
        postIsValid = true
        
        dataOfPost = {
            title,
            slug,
            content: contentPost,
            description,
            userId,
            categoriesChoosed
        }
        
        contentModal.innerHTML = successCard
        
        //btn publish enabled
        btnModalPublish.removeAttribute('disabled')
        
        modal.classList.toggle('showModal')
    }

}

btnPublish.forEach( btn => btn.addEventListener('click', checkPost))

//set none all fields of create post card
const setNoneAllFields = () => {
    input.value = ''
    preview.innerHTML = ''
    titlePost.value = ''
    slugPost.value = ''
    descriptionPost.value = ''
    categories.cardCategoriesChoosed.innerHTML = ''
}

//publish post = send to database by api 
const publishPost = async () =>{

    //active preload modal
    contentModal.innerHTML = preloadModal

    if(postIsValid){
        
        try {
            var response = await requestAPI.post('/send-post', dataOfPost)

            //set none all fields
            setNoneAllFields()

            contentModal.innerHTML = `
                <div class="d-flex flex-column justify-content-center align-items-center gap-3 h-100">
                    <img src="/img/success.png" alt="success" width="30px" height="30px"/>
                    <p class="m-0 lead">Publicado com sucesso</p>
                </div>
            `

        } catch (error) {

            contentModal.innerHTML = `
                <div class="d-flex flex-column justify-content-center align-items-center gap-3 h-100">
                    <img src="/img/error.png" alt="success" width="30px" height="30px"/>
                    <p class="m-0 lead">Erro na publicação</p>
                </div>
            `

            console.log(error)
        }

    }

}

btnModalPublish.addEventListener('click', publishPost)

//revert content modal post
btnRevert.addEventListener('click', setNoneAllFields)

//close create post
closeCreatePost.addEventListener('click', () => location.href = '/')