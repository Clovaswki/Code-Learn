const userClient = {

    cardUsers: [...document.getElementsByClassName('userClient')],

    formatDate: function(){

        userClient.cardUsers.forEach( user => {

            var date = user.getElementsByTagName('strong')[3]

            var format = formatDate(date.innerText)

            date.innerHTML = format

        })

    },

    initUserClient: () => userClient.formatDate()

}

location.pathname == '/admin/clientes' && userClient.initUserClient()