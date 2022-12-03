var categoryCards = document.getElementsByClassName('category')//all categories

var Categories = {
    allCategories: [...document.getElementsByClassName('category')],
    input: document.querySelector('#inputSearch'),
    noResults: document.getElementById('noResults'),
    allPosts: [],

    //search category by inputs
    filterCategories: (event) => {
        for (var category of Categories.allCategories) {
            if (!category.innerText.toLowerCase().includes(event.target.value.toLowerCase())) {
                // category.classList.add('hideCategory')
                category.style.display = 'none'

                var checkAllHide = Categories.allCategories.every(cat => cat.style.display == 'none')

                if (checkAllHide) {
                    return Categories.noResults.style.display = 'flex'
                }

                Categories.noResults.style.display = 'none'

            } else {
                // category.classList.remove('hideCategory')
                category.style.display = 'flex'
                Categories.noResults.style.display = 'none'
            }
        }
    },

    getAllPosts: async function(){
        
        try {
            
            var response = await requestAPI.get('/get-allposts')

            Categories.allPosts = [...response]

        } catch (error) {
            console.log(error)
        }

    },

    initCategories: async function () {

        Categories.input.addEventListener('input', Categories.filterCategories)

        //get all posts
        await Categories.getAllPosts()

        //format date of each category
        for (var category of categoryCards) {

            var colors = ['rgb(6, 139, 6)', 'rgb(195, 157, 99)', 'rgb(19, 123, 199)', 'rgb(109, 181, 167)', 'rgb(192, 194, 112)']

            //select random color for background of quant posts
            var quantPosts = category.getElementsByClassName('quantPosts')[0]
            quantPosts.style.background = colors[Math.floor(Math.random() * 5)]
            var id = category.getElementsByTagName('input')[1].value

            //check posts in this category
            var numberPosts = Categories.allPosts.filter( post => post.category.some( p => p._id == id))

            quantPosts.innerHTML = numberPosts.length+' posts'

            var date = category.getElementsByClassName('date')[0]
            var currentDateCategory = category.querySelector('#currentDate').value

            var format = formatDate(currentDateCategory)

            date.innerHTML += format

        }

    }
}

Categories.initCategories()