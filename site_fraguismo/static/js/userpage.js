document.addEventListener('DOMContentLoaded', function () {
    const picProfile = document.getElementById('pic_profile');
    const isFraguista = document.getElementById('fraguista');
    const divProfile = document.getElementById('div_profile');
    const divUtils = document.getElementById('div_utils');

    const nome = document.getElementById('first_name');
    const sobreNome = document.getElementById('last_name');
    const localidade = document.getElementById('city');
    const phone = document.getElementById('fone');
    const instagram = document.getElementById('instagram');
    const birth = document.getElementById('birth');
    const jobTitle = document.getElementById('job_title');
    const bscWallet = document.getElementById('bsc_wallet');
    const btcWallet = document.getElementById('lightning_wallet');
    const chkCodigoConduta = document.getElementById('codigo_conduta');

    const btnSalvar = document.getElementById('btn-salvar');
    const formRegistro = document.getElementById('formRegistro');
    
    if (isFraguista.checked) {
        divProfile.style.display = 'inline';
    }

    isFraguista.addEventListener('change', () => {
        if (isFraguista.checked) {
            divProfile.style.display = 'inline';
            divUtils.style.display ='inline';
        } else {
            divProfile.style.display = 'none';
            divUtils.style.display = 'none';
        }
    });    
    
    picProfile.addEventListener('change', function(event) {
        var file = event.target.files[0];
        if(file) {
            var imageUrl = URL.createObjectURL(file);
            var div = document.getElementById('profile-pic');

            div.style.backgroundImage = `url(${imageUrl})`;
        }
    });

    btnSalvar.addEventListener('click', (e) =>{
        e.preventDefault();

        if (isFraguista.checked) {
            if (validaCampos()) {
                formRegistro.submit();
            }
        } else {
            if (validaEmail()) {
                formRegistro.submit();
            }            
        }
    });

    email.addEventListener('change', () => {
        validaEmail();
    });

    nome.addEventListener('change', () => {
        validaNome();
    });

    sobreNome.addEventListener('change', () => {
        validaSobrenome();
    });

    localidade.addEventListener('change', () => {
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

    btcWallet.addEventListener('change', () => {
        validaBTCWallet();
    });

    bscWallet.addEventListener('change', () => {
        validaBSCWallet();
    });

    function validaCampos() {
        return (
            validaEmail() &&
            validaNome() &&
            validaSobrenome() &&
            validaLocalidade() &&
            validaPhone() &&
            validaInstagram() &&
            validaBirth()&&
            validaJobTitle() &&
            validaBSCWallet() &&
            validaBTCWallet() &&
            validaCodigoConduta()
        );
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
        if (nome.value !== '') {
            return true;
        };

        document.getElementById("validation-nome").style.display = 'inline';
        return false;
    }

    function validaSobrenome(){
        document.getElementById("validation-sobrenome").style.display = 'none';
        if (sobreNome.value !== '') {
            return true;
        };

        document.getElementById("validation-sobrenome").style.display = 'inline';
        return false;
    }
    
    function validaLocalidade() {
        document.getElementById("validation-city").style.display = 'none';
        if (localidade.value !== '') {
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

    function validaBSCWallet(){
        document.getElementById("validation-bscwallet").style.display = 'none';
        const regex = /^0x[a-fA-F0-9]{40}$/;
        if (regex.test(bscWallet.value) || bscWallet.value === '') {
            return true;
        }

        document.getElementById("validation-bscwallet").style.display = 'inline';
        return false;
    }

    function validaBTCWallet(){
        document.getElementById("validation-btcwallet").style.display = 'none';
        const regex = /^[a-zA-Z0-9]{190,350}$/;
        if (regex.test(btcWallet.value) || btcWallet.value === ''){
            return true;
        }

        document.getElementById("validation-btcwallet").style.display = 'inline';
        return false;

    }

    function validaCodigoConduta() {
        document.getElementById("validation-codigo_conduta").style.display = 'none';
        if (! chkCodigoConduta.checked) {
            document.getElementById("validation-codigo_conduta").style.display = 'inline';
        }
        return chkCodigoConduta.checked
    }
});