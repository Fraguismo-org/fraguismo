document.addEventListener('DOMContentLoaded', function () {
    const fraguistaField = document.getElementById('bloco-fraguista');
    const chkbxFraguista = document.getElementById('fraguista');
    const divIndicou = document.getElementById('div_indicou');
    const divAonde = document.getElementById('div_aonde');    
    const chkCodigoConduta = document.getElementById('codigo_conduta');
    const chkTermosAdesao = document.getElementById('termos_adesao');
    const codigoCondutaError = document.getElementById('codigoCondutaError');

    const formRegistro = document.getElementById('form-registro');

    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const senha = document.getElementById('password');
    const senha2 = document.getElementById('password2');
    const passLength = document.getElementById('pass-length');
    const passNumeric = document.getElementById('pass-numeric');
    const passAlphnumeric = document.getElementById('pass-alphnumeric');
    const passEqual = document.getElementById('pass-equal');
    const firstName = document.getElementById('first_name');
    const lastName = document.getElementById('last_name');
    const city = document.getElementById('city');
    const phone = document.getElementById('fone');
    const instagram = document.getElementById('instagram');
    const birth = document.getElementById('birth');
    const jobTitle = document.getElementById('job_title');
    const comoConheceu = document.getElementById('como_conheceu');
    const quemIndicou = document.getElementById('quem_indicou');
    const aonde = document.getElementById('aonde');
    const btnRegistrar = document.getElementById('btn-registrar');

    const selectedValue = getQueryParam('ref');

    senha.addEventListener('input', () => {
        validaPassword();
    });

    senha2.addEventListener('input', () => {
        validaPassword();
    });

    username.addEventListener('change', () => {
        validaUsername();
    });

    email.addEventListener('change', () => {
        validaEmail();
    });

    firstName.addEventListener('change', () => {
        validaNome();
    });

    lastName.addEventListener('change', () => {
        validaSobrenome();
    });

    city.addEventListener('change', () => {
        validaLocalidade();
    });

    phone.addEventListener('change', () => {
        validaPhone();
    });

    instagram.addEventListener('change', () => {
        validaInstagram();
    });

    birth.addEventListener('change', () => {
        validaBirth();
    });

    jobTitle.addEventListener('change', () => {
        validaJobTitle();
    });

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        indicacao = urlParams.get(param);
        if (indicacao === '' || indicacao === null) {
            return '';
        }
        comoConheceu.value = 'indicacao';
        divIndicou.style.display = 'inline';
        quemIndicou.value = indicacao;
        chkbxFraguista.checked = true;
        fraguistaField.style.display = 'inline';
        return urlParams.get(param);
    }

    chkbxFraguista.addEventListener('change', () => {
        if (chkbxFraguista.checked) {
            fraguistaField.style.display = 'inline';
        } else {
            fraguistaField.style.display = 'none';
        }
    });

    comoConheceu.addEventListener('change', () => {
        if (comoConheceu.value === 'indicacao') {
            divIndicou.style.display = 'inline';
            divAonde.style.display = 'none';
        } else if (comoConheceu.value === 'outros') {
            divAonde.style.display = 'inline';
            divIndicou.style.display = 'none';
        } else if (selectedValue) {
            divIndicou.style.display = 'inline';
            divAonde.style.display = 'none';
            comoConheceu.value = 'indicacao';
            quemIndicou.value = selectedValue;
        }
        else {
            divAonde.style.display = 'none';
            divIndicou.style.display = 'none';
        }
    });

    btnRegistrar.addEventListener('click', (event) => {
        event.preventDefault();

        codigoCondutaError.style.display = 'none';

        if (chkbxFraguista.checked) {
            if (!chkCodigoConduta.checked) {
                codigoCondutaError.style.display = 'block';
                return;
            }
            if (validaForm()){
                formRegistro.submit();
            } else {
                return;
            }

        } 
        if (validaUsername() && validaEmail() && validaPassword()) {
            formRegistro.submit();
        }

    });

    chkTermosAdesao.addEventListener('change', () => {
        if (chkTermosAdesao.checked) {
            btnRegistrar.removeAttribute('disabled');
        }
        else {
            btnRegistrar.setAttribute('disabled','disabled');
        }
    });

    function validaForm() {
        return (
            validaUsername() &&
            validaEmail() &&
            validaPassword() &&
            validaNome() &&
            validaLocalidade() &&
            validaPhone() &&
            validaInstagram() &&
            validaBirth() &&
            validaJobTitle() &&
            validaComoConheceu()
        );
    }

    function validaUsername(){
        document.getElementById('validation-username').style.display = 'none';
        const regex = /^[a-zA-z0-9]{5,}$/;
        if (regex.test(username.value)) {
            return true;
        }

        document.getElementById('validation-username').style.display = 'inline';
        return false;
    }
    
    function validaEmail(){
        document.getElementById('validation-email').style.display = 'none';
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (regex.test(email.value)) {
            return true;
        }

        document.getElementById('validation-email').style.display = 'inline';
        return false;
    }

    function validaPassword(){
        let result = true;
        if (senha.value.length < 8) {
            passLength.style.color = 'red';
            result =  result && false;
        } else {
            passLength.style.color = 'green';
            result =  result && true;
        }
    
        if (/^\d+$/.test(senha.value)) {
            passNumeric.style.color = 'red';
            result =  result && false;
        } else {
            passNumeric.style.color = 'green';
            result =  result && true;
        }
    
        if (!/[A-Za-z]/.test(senha.value) || !/\d/.test(senha.value)) {
            passAlphnumeric.style.color = 'red';
            result = result && false;
        } else {
            passAlphnumeric.style.color = 'green';
            result =  result && true
        }
    
        if (senha.value !== senha2.value) {
            passEqual.style.color = 'red';
            result =  result && false;
        } else {
            passEqual.style.color = 'green';
            result =  result && true;
        }

        return result;
    }
    
    function validaNome(){
        document.getElementById("validation-nome").style.display = 'none';
        if (firstName.value !== '') {
            return true;
        };

        document.getElementById("validation-nome").style.display = 'inline';
        return false;
    }

    function validaSobrenome(){
        document.getElementById("validation-sobrenome").style.display = 'none';
        if (lastName.value !== '') {
            return true;
        };

        document.getElementById("validation-sobrenome").style.display = 'inline';
        return false;
    }
    
    function validaLocalidade() {
        document.getElementById("validation-city").style.display = 'none';
        if (city.value !== '') {
            return true;
        };

        document.getElementById("validation-city").style.display = 'inline';
        return false;
    }

    function validaPhone(){
        document.getElementById("validation-phone").style.display = 'none';
        const regex = /^(\+?\d{1,3})? ?(\(?\d{2,3}\)?)? ?\d{4,5}-?\d{4}$/;
        if (regex.test(phone.value)) {
            return true;
        }

        document.getElementById("validation-phone").style.display = 'inline';
        return false;
    }
    
    function validaInstagram(){
        document.getElementById("validation-instagram").style.display = 'none';
        const regex = /^[a-zA-Z0-9._]{1,30}$/;
        if (regex.test(instagram.value) || instagram.value === '') {
            return true;
        }

        document.getElementById("validation-instagram").style.display = 'inline';
        return false;
    }

    function validaBirth(){
        document.getElementById("validation-birth").style.display = 'none';
        const nascimento = new Date(birth.value);
        const dataAtual = new Date();
        const dataMinima = new Date();
        dataMinima.setFullYear(dataAtual.getFullYear() - 13);
        
        if (nascimento <= dataMinima) {
            return true;
        }

        document.getElementById("validation-birth").style.display = 'inline';
        return false;

    }

    function validaJobTitle(){
        document.getElementById("validation-jobtitle").style.display = 'none';
        if (jobTitle.value !== '') {
            return true;
        }

        document.getElementById("validation-jobtitle").style.display = 'inline';
        return false;
    }

    function validaComoConheceu(){
        document.getElementById("validation-outros").style.display = 'none';
        document.getElementById("validation-indicacao").style.display = 'none';

        if (comoConheceu.value === 'indicacao' && quemIndicou.value === '') {
            document.getElementById("validation-indicacao").style.display = 'inline';
            return false;
        } else if (comoConheceu.value === 'outros' && aonde.value === '') {
            document.getElementById("validation-outros").style.display = 'inline';
            return false;
        } else {
            return true;
        }
    }

});
