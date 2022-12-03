var posts = [...document.getElementsByClassName('postOfCategory')]

posts.forEach(post => {

    var cardInsertDate = post.getElementsByTagName('small')[0]
    var date = post.getElementsByTagName('input')[0].value

    cardInsertDate.innerHTML = 'Postado em ' + formatDate(date)

})