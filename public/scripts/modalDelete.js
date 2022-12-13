const modalDelete = {
    modal: document.getElementsByClassName('modalDelete-posts')[0],
    btnsModal: [...document.getElementsByClassName('btnModalDelete')],
    btnClose: document.getElementById('btnClose-modalDelete'),

    deletePost: async function(btn){

        var data = btn.parentNode.getElementsByTagName('input')[0]

        var dataParse = JSON.parse(data.value)

        //under construction

    },

    toggleModal: function(e){
        
        modalDelete.modal.classList.toggle('showModalDelete')

        modalDelete.modal.classList.contains('showModalDelete') && 
        modalDelete.deletePost(e.target)

    },

    initModalDelete: function(){

        this.btnsModal.forEach( btn => {
            btn.addEventListener('click', this.toggleModal)
        })

        this.btnClose.addEventListener('click', this.toggleModal)

    }
}

location.pathname == "/admin/postagens" && modalDelete.initModalDelete()