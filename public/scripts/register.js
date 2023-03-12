
const Register = {

    cardImg: document.querySelector(".cardImg-register"),
    formFile: document.getElementById("formFile"),

    //read picture of form and render in img tag
    readPicture: (event) => {

        const target = event.target.files[0]

        const img = Register.cardImg.getElementsByTagName("img")[0]

        //set visible card img
        Register.cardImg.style.display = "flex"

        const reader = new FileReader()

        reader.readAsDataURL(target)

        reader.onload = () => {

            img.src = reader.result

        }

    },

    init: () => {

        //set display none - card img
        Register.cardImg.style.display = "none"

        //event listener of file form change
        Register.formFile.addEventListener("change", event => Register.readPicture(event))

    }

}

Register.init()