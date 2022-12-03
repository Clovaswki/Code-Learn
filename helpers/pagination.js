
//pagination system
module.exports = {

    pagination: (req, items, postsByPage, numberPages, limitItems, pageChoosed) => {
        numberPages = Math.ceil(items.length / limitItems)

        if (req.query.hasOwnProperty('page')) {
            for (var i = limitItems * pageChoosed; i < (limitItems * pageChoosed) + limitItems; i++) {
                if (items[i]) {
                    postsByPage.push(items[i])
                }
            }
        } else {
            for (var i = limitItems * 0; i < limitItems; i++) {
                if (items[i]) {
                    postsByPage.push(items[i])
                }
            }
        }

        return {
            postsByPage,
            numberPages
        }
    }

}