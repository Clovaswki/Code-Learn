const userClient = {

    cardUsers: [...document.getElementsByClassName('userClient')],
    inputSearch: document.getElementById('searchClientsAdm'),

    searchClient: function(event){

        let value = event.target.value

        userClient.cardUsers.forEach( user => {

            if(user.innerText.toLowerCase().includes(value.toLowerCase())){

                user.style.display = 'flex'

            }else{

                user.style.display = 'none'

            }

        })

    },

    addIndexForEachUser: function(){

        userClient.cardUsers.forEach( (user, index) => {

            var indexElement = user.getElementsByClassName('indexUser')[0]

            indexElement.innerHTML = index+1

        })

    },

    formatDate: function(){

        userClient.cardUsers.forEach( user => {

            var date = user.getElementsByClassName('dateText')[0]

            var format = formatDate(date.innerText)

            date.innerHTML = format

        })

    },

    initUserClient: function(){
       
        userClient.formatDate()

        //add index for each user
        userClient.addIndexForEachUser()
    
        this.inputSearch.addEventListener('input', this.searchClient)

    } 

}

location.pathname == '/admin/clientes' && userClient.initUserClient()