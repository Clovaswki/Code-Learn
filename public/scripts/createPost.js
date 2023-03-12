
class CreatePost {

    //scope
    navEdit = document.getElementById('navEdit')//nav edit
    navPreview = document.getElementById('navPreview')//nav preview
    preview = document.getElementsByClassName('body-paragraphs')[0]
    headerPreview = document.getElementById('titlePreview')
    input = document.querySelector('[name="content"]')

    caretPos = 0

    descriptionPost = document.querySelector('[name="description"]')
    titlePost = document.getElementById('inputTitle')

    btnPublish = [...document.getElementsByClassName('btnPublish')]
    btnRevert = document.getElementById('btnRevert')

    post_finalResult = ''

    //btn close create post card
    closeCreatePost = document.getElementById('close-createPost')

    //manipulation of categories
    cardCategoriesChoosed = document.getElementById('all-categoriesChoosed')
    selectCategories = document.getElementById('selectCategories')
    options = [...document.querySelectorAll('.selectCategories option')]
    allCategories = []
    btnRemove = document.getElementById('removeCategories')

    //modal
    modal = document.getElementsByClassName('modalCreatePost-publish')[0]
    contentModal = this.modal.getElementsByClassName('contentModal-createPost')[0]
    btnModalPublish = document.getElementById('btnModalPublish')

    //preload modal
    preloadModal = `
    <span id="preload-modal">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <p>Publicando...</p>
    </span>
    `
    //check if content of post is valid
    postIsValid = false

    //all data of post
    dataOfPost = {}

    //navigation between edit card and preview card
    selectComponentByNavs() {
        let bodyCreatePost = document.querySelector('.body-createPost')//card create and edit a new post
        let previewCreatePost = document.querySelector('.preview-createPost')//card show results

        let navs = [this.navEdit, this.navPreview]

        navs.forEach(nav => {

            nav.addEventListener('click', (event) => {

                let otherNav = navs.find(n => n != event.target)
                event.target.classList.add('nav-active')//active nav press
                otherNav.classList.remove('nav-active')//disable other nav

                bodyCreatePost.style.display = nav.id == "navEdit" ? 'flex' : 'none'
                previewCreatePost.style.display = nav.id == "navEdit" ? 'none' : 'flex'

            })

        })
    }

    //formatted the posts by tools of formatting 
    formatPostByTools() {
        var bold = document.getElementById('bold'),
            italic = document.getElementById('italic'),
            link = document.getElementById('link'),
            codeBlock = document.getElementById('codeBlock'),
            quote = document.getElementById('quote')

        let tools = [bold, italic, link, codeBlock, quote]

        tools.forEach(tool => {

            tool.addEventListener('click', event => {

                let text = this.input.value.split('')

                switch (tool.id) {
                    case 'bold':
                        for (let index in text) {
                            if (index - 1 == this.caretPos - 1) {
                                text[index] = `**${text[index]}`
                            } else if (this.caretPos == text.length) {
                                text = [...text, '**']
                            }
                        }
                        break
                    case 'italic':
                        for (let index in text) {
                            if (index - 1 == this.caretPos - 1) {
                                text[index] = `__${text[index]}`
                            } else if (this.caretPos == text.length) {
                                text = [...text, '__']
                            }
                        }
                        break
                    case 'link':
                        for (let index in text) {
                            if (index - 1 == this.caretPos - 1) {
                                text[index] = `++${text[index]}`

                                for (let i = index; i < text.length; i++) {
                                    if (text[i] == ' ' || i == text.length - 1) {

                                        i == text.length - 1
                                            ? text[i] += `[link]++ `
                                            : text[i] = `[link]++ `

                                        break
                                    }
                                }

                                break
                            }
                        }
                        break
                    case 'codeBlock':
                        for (let index in text) {
                            if (index - 1 == this.caretPos - 1) {
                                text[index] = "\`\`" + text[index]
                            } else if (this.caretPos == text.length) {
                                text = [...text, "\`\`"]
                            }
                        }
                        break
                    case 'quote':
                        for (let index in text) {
                            if (index - 1 == this.caretPos - 1) {
                                text[index] = `>>${text[index]}`
                            }
                        }
                        break
                }

                this.input.value = `${text.join('')}`
                this.convertPost(this.input.value)
            })


        })
    }

    //formating post by specials characters  
    convertPost(text) {
        // Limpa a área de visualização
        this.preview.innerHTML = '';

        // Define o cabeçalho da postagem na área de visualização do cabeçalho
        const inputTitle = document.getElementById('inputTitle').value;
        this.headerPreview.innerHTML = inputTitle;

        // Armazena o texto original da postagem
        this.post_finalResult = text;

        // Divide o conteúdo da postagem em parágrafos
        const paragraphs = text.split(/\r?\n\r?\n/);

        // Formata e exibe cada parágrafo na área de visualização
        paragraphs.forEach(paragraph => {
            const formattedParagraph = checkFormat(paragraph);
            if (typeof formattedParagraph === 'object') {
                // Se checkFormat() retornar um objeto, adiciona esse objeto à área de visualização
                this.preview.appendChild(formattedParagraph);
            } else {
                // Se checkFormat() retornar uma string, adiciona um parágrafo formatado contendo essa string à área de visualização
                const formattedHtml = `<p class="m-0">${formattedParagraph}</p>`;
                this.preview.innerHTML += formattedHtml;
            }
        });
    }

    //manipulation categories on the creation of a post
    async getCategories() {

        let data = await requestAPI.get('/get-categories')

        this.allCategories = [...data]

        const option = (name, value) => `<option value='${value}'>${name}</option>`

        data.forEach(category => {
            this.selectCategories.innerHTML += option(category.nome, category._id)
        })

    }
    methodSelectCategories() {

        const colors = [
            "#e0766e", "#a6eb8f", "#56a1b3", "#a470db", "#e30535"
        ]

        const randomColor = () => colors[Math.floor(Math.random() * colors.length)]

        const catChoosed = (name, id) =>
            `<span class='lead fw-light cardCategoryChoosed' title='${id}'>
            <p style="color: ${randomColor()}; margin: 0">#</p>
            ${name}
        </span>`

        this.selectCategories.addEventListener('change', event => {

            let cat = this.allCategories.find(c => c._id === event.target.value)

            if (this.cardCategoriesChoosed.childNodes.length - 1 <= 4) {
                if (!this.cardCategoriesChoosed.innerText.includes(cat.nome)) {
                    this.cardCategoriesChoosed.innerHTML += catChoosed(cat.nome, cat._id)

                    this.addListenerInCategories()
                }
            }

        })

    }

    //add click listeners to selected categories
    addListenerInCategories(){
        this.cardCategoriesChoosed.childNodes.forEach( cardCategory => {
            cardCategory.addEventListener("click", event => this.removeCategories(event))
        })
    }

    removeCategories(event) {

        if (event) {
            this.cardCategoriesChoosed.removeChild(event.target)
        } else {

            this.btnRemove.addEventListener('click', () => {

                this.cardCategoriesChoosed.innerHTML = ''

            })
        }

    }
    getCategoriesChoosed() {

        let choosed = this.allCategories.filter(cat =>
            this.cardCategoriesChoosed.innerHTML.includes(cat._id)
        )

        return choosed

    }

    //formatting post slug
    formattingSlug(slug) {

        let formattedSlug = slug.split(" ")

        for (let i = 0; i < formattedSlug.length; i++) {
            if (i != formattedSlug.length - 1) {
                formattedSlug[i] += "-"
            }
        }

        return `${formattedSlug.join("").toLowerCase().trim()}`

    }

    //check all data of post for before publish
    checkPost(This) {

        let contentPost = This.post_finalResult,
            description = This.descriptionPost.value,
            slug = This.formattingSlug(This.titlePost.value),
            categoriesChoosed = This.getCategoriesChoosed(),
            title = This.titlePost.value,
            userId = document.getElementsByName('userId')[0].value

        let errors = []

        if (!contentPost || typeof contentPost == undefined || contentPost == null) {
            errors.push({ error: 'Conteúdo inválido' })
        }
        if (!description || typeof description == undefined || description == null) {
            errors.push({ error: 'Descrição inválida' })
        }
        if (!title || typeof title == undefined || title == null) {
            errors.push({ error: 'Título inválido' })
        }
        if (!slug || typeof slug == undefined || slug == null) {
            errors.push({ error: 'Slug inválida' })
        }
        if (!userId) {
            errors.push({ error: 'id de usuário não encontrada' })
        }
        if (categoriesChoosed.length == 0) {
            errors.push({ error: 'Nenhuma categoria selecionada' })
        }

        let successCard = `
        <div class="success-publish" >
            <img src="/img/ok.png" alt="ok" width="50px" height="50px">
            <p>Tudo pronto para publicar</p>
        </div>
        `

        const divAlert = (error) => `<div class="alert alert-danger" role="alert">${error}</div>`

        if (errors.length > 0) {

            This.postIsValid = false

            This.contentModal.innerHTML = ''

            errors.forEach(error => {
                This.contentModal.innerHTML += divAlert(error.error)
            })

            //btn publish disabled
            This.btnModalPublish.disabled = true

            This.modal.classList.toggle('showModal')
        } else {
            This.postIsValid = true

            This.dataOfPost = {
                title,
                slug,
                content: contentPost,
                description,
                userId,
                categoriesChoosed
            }

            This.contentModal.innerHTML = successCard

            //btn publish enabled
            This.btnModalPublish.removeAttribute('disabled')

            This.modal.classList.toggle('showModal')
        }

    }

    //set none all fields of create post card
    setNoneAllFields(This) {
        This.input.value = ''
        This.preview.innerHTML = ''
        This.titlePost.value = ''
        This.descriptionPost.value = ''
        This.cardCategoriesChoosed.innerHTML = ''
    }

    //publish post = send to database by api 
    async publishPost(This) {

        //active preload modal
        This.contentModal.innerHTML = This.preloadModal

        if (this.postIsValid) {

            try {
                await requestAPI.post('/send-post', This.dataOfPost)

                //set none all fields
                This.setNoneAllFields(this)

                This.contentModal.innerHTML = `
                <div class="d-flex flex-column justify-content-center align-items-center gap-3 h-100">
                    <img src="/img/success.png" alt="success" width="30px" height="30px"/>
                    <p class="m-0 lead">Publicado com sucesso</p>
                </div>
            `

            } catch (error) {

                This.contentModal.innerHTML = `
                <div class="d-flex flex-column justify-content-center align-items-center gap-3 h-100">
                    <img src="/img/error.png" alt="success" width="30px" height="30px"/>
                    <p class="m-0 lead">Erro na publicação</p>
                </div>
            `

                console.log(error)
            }

        }

    }

    init() {

        this.selectComponentByNavs()

        this.formatPostByTools()

        //categories functions instances
        this.getCategories()
        this.methodSelectCategories()
        this.removeCategories()

        //close modal event click
        document.getElementsByClassName('btn-close')[0].addEventListener('click', () =>
            this.modal.classList.toggle('showModal')
        )

        //events click buttons of publish
        this.btnPublish.forEach(btn => btn.addEventListener('click', () => this.checkPost(this)))

        //update position of mouse cursor in input
        for (let eventType of ['keyup', 'click']) {
            this.input.addEventListener(eventType, e => {
                this.caretPos = e.target.selectionStart
                // console.log(caretPos)
                this.convertPost(this.input.value)
            })
            this.titlePost.addEventListener(eventType, e => {
                this.convertPost(this.input.value)
            })
        }

        //listener click publish button in the modal
        this.btnModalPublish.addEventListener('click', () => this.publishPost(this))

        //revert content modal post
        this.btnRevert.addEventListener('click', () => this.setNoneAllFields(this))

        //close create post
        this.closeCreatePost.addEventListener('click', () => location.href = '/')

    }

}

const createPost = new CreatePost()

createPost.init()