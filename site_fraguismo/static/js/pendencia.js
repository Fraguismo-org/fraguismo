document.addEventListener('DOMContentLoaded', () => {
    const btnSalvar = document.getElementById('salvar');
    const inputPendencia = document.getElementById('pendencia');
    const formAdd = document.getElementById('form-add');
    
    btnSalvar.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('vazio');
        document.getElementById('validation-pendencia').style.display = 'none';
        if (inputPendencia.value === '') {
            document.getElementById('validation-pendencia').style.display = 'inline';                
        }
        else {
            formAdd.submit();
        }
    });
});