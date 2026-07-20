import { Validation } from "./utils/validation.js";


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
    const chkCodigoConduta = document.getElementById('codigo_conduta');

    const novaSenha = document.getElementById('nova_senha');
    const confirmarSenha = document.getElementById('confirmar_senha');
    const senhaChecklist = document.getElementById('senha-checklist');
    const passLength = document.getElementById('pass-length');
    const passUpper = document.getElementById('pass-upper');
    const passLower = document.getElementById('pass-lower');
    const passNumber = document.getElementById('pass-number');
    const passSpecial = document.getElementById('pass-special');
    const passEqual = document.getElementById('pass-equal');

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
            if (validaCampos() && validaSenha()) {
                formRegistro.submit();
            }
        } else {
            if (validaEmail() && validaSenha()) {
                formRegistro.submit();
            }
        }
    });

    novaSenha.addEventListener('input', validaSenha);
    confirmarSenha.addEventListener('input', validaSenha);

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
            validaCodigoConduta()
        );
    }

    function validaEmail(){
        const emailValidation = Validation.validaEmail(email.value);        
        
        emailValidation 
            ? document.getElementById('validation-email').style.display = 'none' 
            : document.getElementById('validation-email').style.display = 'inline';
        
        return emailValidation;
    }
    
    function validaNome(){
        const nomeValidation = Validation.validaNome(nome.value);
        
        nomeValidation 
            ? document.getElementById("validation-nome").style.display = 'none' 
            : document.getElementById("validation-nome").style.display = 'inline';
        
        return nomeValidation;
    }

    function validaSobrenome(){
        const sobrenomeValidation = Validation.validaSobrenome(sobreNome.value);
        
        sobrenomeValidation 
            ? document.getElementById("validation-sobrenome").style.display = 'none' 
            : document.getElementById("validation-sobrenome").style.display = 'inline';
        
        return sobrenomeValidation;
    }
    
    function validaLocalidade() {
        const localidadeValidation = Validation.validaLocalidade(localidade.value);        
        
        localidadeValidation 
            ? document.getElementById("validation-city").style.display = 'none' 
            : document.getElementById("validation-city").style.display = 'inline';
        
        return localidadeValidation;
    }

    function validaPhone(){
        const phoneValidation = Validation.validaPhone(phone.value);        
        
        phoneValidation 
            ? document.getElementById("validation-phone").style.display = 'none' 
            : document.getElementById("validation-phone").style.display = 'inline';
        
        return phoneValidation;
    }
    
    function validaInstagram(){
        const instagramValidation = Validation.validaInstagram(instagram.value);        

        instagramValidation 
            ? document.getElementById("validation-instagram").style.display = 'none' 
            : document.getElementById("validation-instagram").style.display = 'inline';
        
        return instagramValidation;
    }

    function validaBirth(){
        const birthValidation = Validation.validaBirth(birth.value);        

        birthValidation 
            ? document.getElementById("validation-birth").style.display = 'none' 
             : document.getElementById("validation-birth").style.display = 'inline';
        
        return birthValidation;
    }

    function validaJobTitle(){
        const jobTitleValidation = Validation.validaJobTitle(jobTitle.value);
                
        jobTitleValidation 
            ? document.getElementById("validation-jobtitle").style.display = 'none' 
            : document.getElementById("validation-jobtitle").style.display = 'inline';
        
        return jobTitleValidation;
    }

    function validaCodigoConduta() {
        chkCodigoConduta.checked
            ? document.getElementById("validation-codigo_conduta").style.display = 'none'
            : document.getElementById("validation-codigo_conduta").style.display = 'inline';

        return chkCodigoConduta.checked
    }

    function validaSenha() {
        const valor = novaSenha.value;

        // A troca de senha é opcional: campos vazios = mantém a senha atual.
        if (valor === '' && confirmarSenha.value === '') {
            senhaChecklist.style.display = 'none';
            return true;
        }

        senhaChecklist.style.display = 'block';

        const temTamanho = valor.length > 8;
        const temMaiuscula = /[A-Z]/.test(valor);
        const temMinuscula = /[a-z]/.test(valor);
        const temNumero = /\d/.test(valor);
        const temEspecial = /[^A-Za-z0-9]/.test(valor);
        const saoIguais = valor !== '' && valor === confirmarSenha.value;

        passLength.style.color = temTamanho ? 'green' : 'red';
        passUpper.style.color = temMaiuscula ? 'green' : 'red';
        passLower.style.color = temMinuscula ? 'green' : 'red';
        passNumber.style.color = temNumero ? 'green' : 'red';
        passSpecial.style.color = temEspecial ? 'green' : 'red';
        passEqual.style.color = saoIguais ? 'green' : 'red';

        return temTamanho && temMaiuscula && temMinuscula && temNumero
            && temEspecial && saoIguais;
    }

});
