
var HomePage = {

    numberPages: parseInt(document.getElementsByName('numberPages')[0].value),
    componentPagination: document.getElementById('paginationComponent'),
    pathname: window.location.pathname,
    cardCategoriesRole: document.getElementsByClassName('roleCategories')[0],

    createPagination: () => {

        var listPages = HomePage.componentPagination.getElementsByTagName('ul')[0]
        var pageChoosed = 1

        //check page choosed
        !location.search
        ? pageChoosed = 1
        : pageChoosed = parseInt(location.search.split('=')[1])
        
        //add btn previous in pagination
        var hrefPrevious = pageChoosed == 2 || pageChoosed == 1? '/' : '/?page='+(pageChoosed-1)

        listPages.innerHTML += `
        <li class="page-item ${pageChoosed == 1 && 'disabled'}" >
            <a class="page-link" href="${hrefPrevious}">Anterior</a>
        </li>
        `

        for(var i=1; i<=HomePage.numberPages; i++){
            listPages.innerHTML += `
            <li class="page-item ${pageChoosed == i && 'active'}">
                <a class="page-link" href="${i == 1? '/': '/?page='+i}">${i}</a>
            </li>
            `
        }

        //add btn next in pagination
        var hrefNext = pageChoosed == HomePage.numberPages ? '/' : '/?page='+(pageChoosed+1)
        
        listPages.innerHTML += `
        <li class="page-item ${pageChoosed == HomePage.numberPages && 'disabled'}">
            <a class="page-link" href="${hrefNext}" >Próximo</a>
        </li>
        `
        
    },

    randomCategories: async function(){

        try {
            
            var categories = await requestAPI.get('/get-categories')

            HomePage.cardCategoriesRole.innerHTML = ''
    
            var max = 8
    
            var categoryElement = (name, id) => `<a href="/posts/${id}" style="text-decoration: none; color: black;">
                <p class="m-0">${name}</p>
            </a>`

            for(var i = 0; i < max; i++){
    
                HomePage.cardCategoriesRole.innerHTML += categoryElement(categories[i].nome, categories[i]._id)
            
            }
        } catch (error) {
            console.log(error)   
        }
    },

    initHomePage: function(){

        //create pagination accords number pages
        if(HomePage.numberPages > 1){
            HomePage.createPagination()
        }

        HomePage.randomCategories()

    }

}

HomePage.initHomePage()