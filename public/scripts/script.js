
//Media queries do navbar
var btnNavabr = document.getElementsByClassName('btnNavbar')[0]

function toggle(event){
    event.preventDefault()
    var navMedia = document.getElementsByClassName('navMedia')[0]
    navMedia.classList.toggle('show')
}

btnNavabr.addEventListener('touchstart', toggle)
btnNavabr.addEventListener('click', toggle)

//...
