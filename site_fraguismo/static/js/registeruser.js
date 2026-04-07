document.addEventListener('DOMContentLoaded', function () {

    /* =========================
       LOCAL STORAGE (PERSISTÊNCIA)
    ========================== */

    const STORAGE_KEY = 'registro_form';

    function salvarCampo(id, valor) {
        const dados = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        dados[id] = valor;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
    }

    function restaurarFormulario() {
        const dados = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!dados) return;

        Object.keys(dados).forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;

            if (el.type === 'checkbox') {
                el.checked = dados[id];
            } else {
                el.value = dados[id];
            }
        });
    }

    function limparFormularioSalvo() {
        localStorage.removeItem(STORAGE_KEY);
    }

    /* =========================
       ELEMENTOS
    ========================== */

    const fraguistaField = document.getElementById('bloco-fraguista');
    const questionarioField = document.getElementById('bloco-questionario');
    const chkbxFraguista = document.getElementById('fraguista');
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
    const condutaWrapper = document.getElementById('conduta-wrapper');
    const questionarioFields = Array.from(document.querySelectorAll('[data-questionario="true"]'));

    /* =========================
       CAMPOS PERSISTENTES
    ========================== */

    const camposPersistentes = [
        username,
        email,
        firstName,
        lastName,
        city,
        phone,
        instagram,
        birth,
        jobTitle,
        comoConheceu,
        quemIndicou,
        aonde,
        chkbxFraguista,
        chkTermosAdesao,
        chkCodigoConduta,
        ...questionarioFields
    ];

    camposPersistentes.forEach(campo => {
        const evento = campo.type === 'checkbox' || campo.tagName === 'SELECT'
            ? 'change'
            : 'input';

        campo.addEventListener(evento, () => {
            const valor = campo.type === 'checkbox' ? campo.checked : campo.value;
            salvarCampo(campo.id, valor);
        });
    });

    /* =========================
       UI / REGRAS
    ========================== */

    function updateBotaoRegistrar() {
        const termos = chkTermosAdesao.checked;
        const fraguista = chkbxFraguista.checked;
        const conduta = chkCodigoConduta.checked;
        const podeRegistrar = fraguista ? (termos && conduta) : termos;

        btnRegistrar.toggleAttribute('disabled', !podeRegistrar);
    }

    function toggleObrigatoriedadeQuestionario() {
        const obrigatorio = chkbxFraguista.checked;
        questionarioFields.forEach(f => {
            f.required = obrigatorio;
            if (obrigatorio) {
                f.setAttribute('minlength', '20');
            } else {
                f.removeAttribute('minlength');
                f.setCustomValidity('');
            }
        });
    }

    function toggleConsentView() {
        if (chkbxFraguista.checked) {
            condutaWrapper.style.display = 'block';
        } else {
            condutaWrapper.style.display = 'none';
            chkCodigoConduta.checked = false;
            codigoCondutaError.style.display = 'none';
        }
    }

    chkbxFraguista.addEventListener('change', () => {
        toggleObrigatoriedadeQuestionario();
        toggleConsentView();
        const visivel = chkbxFraguista.checked ? 'block' : 'none';
        fraguistaField.style.display = visivel;
        questionarioField.style.display = visivel;
        updateBotaoRegistrar();
    });

    senha.addEventListener('input', validaPassword);
    senha2.addEventListener('input', validaPassword2);

    chkTermosAdesao.addEventListener('change', updateBotaoRegistrar);
    chkCodigoConduta.addEventListener('change', () => {
        codigoCondutaError.style.display = 'none';
        updateBotaoRegistrar();
    });

    /* =========================
       SUBMIT
    ========================== */

    formRegistro.addEventListener('submit', (event) => {

        codigoCondutaError.style.display = 'none';
        chkTermosAdesao.setCustomValidity('');

        if (!chkTermosAdesao.checked) {
            event.preventDefault();
            chkTermosAdesao.setCustomValidity('Aceite os Termos e Condições.');
            formRegistro.reportValidity();
            return;
        }

        if (chkbxFraguista.checked && !chkCodigoConduta.checked) {
            event.preventDefault();
            codigoCondutaError.style.display = 'block';
            chkCodigoConduta.focus();
            return;
        }

        if (!(validaForm() && (!chkbxFraguista.checked || validaQuestionario()))) {
            event.preventDefault();
            formRegistro.reportValidity();
            return;
        }        

        limparFormularioSalvo();
    });

    /* =========================
       VALIDAÇÕES
    ========================== */

    function validaForm() {
        let ok = validaUsername() && validaEmail() && validaPassword();
        if (chkbxFraguista.checked) {
            ok = ok &&
                validaNome() &&
                validaLocalidade() &&
                validaPhone() &&
                validaInstagram() &&
                validaBirth() &&
                validaJobTitle() &&
                validaComoConheceu();
        }
        return ok;
    }

    function validaUsername() {
        document.getElementById('validation-username').style.display = 'none';
        if (/^[a-zA-Z0-9]{5,}$/.test(username.value)) return true;
        document.getElementById('validation-username').style.display = 'inline';
        return false;
    }

    function validaEmail() {
        document.getElementById('validation-email').style.display = 'none';
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) return true;
        document.getElementById('validation-email').style.display = 'inline';
        return false;
    }

    function validaPassword() {
        let ok = true;

        passLength.style.color = senha.value.length >= 8 ? 'green' : 'red';
        passNumeric.style.color = /^\d+$/.test(senha.value) ? 'red' : 'green';
        passAlphnumeric.style.color =
            (/[A-Za-z]/.test(senha.value) && /\d/.test(senha.value)) ? 'green' : 'red';
        passEqual.style.color = senha.value === senha2.value ? 'green' : 'red';

        if (senha.value.length < 8) ok = false;
        if (/^\d+$/.test(senha.value)) ok = false;
        if (!(/[A-Za-z]/.test(senha.value) && /\d/.test(senha.value))) ok = false;
        if (!validaPasswords()) ok = false;

        return ok;
    }

    function validaPassword2() {
        passEqual.style.color = validaPasswords() ? 'green' : 'red';
    }

    function validaPasswords() {
        return senha.value === senha2.value;
    }

    function validaNome() {
        document.getElementById("validation-nome").style.display =
            firstName.value ? 'none' : 'inline';
        return !!firstName.value;
    }

    function validaLocalidade() {
        document.getElementById("validation-city").style.display =
            city.value ? 'none' : 'inline';
        return !!city.value;
    }

    function validaPhone() {
        document.getElementById("validation-phone").style.display = 'none';
        if (/^(\+?\d{1,3})? ?(\(?\d{2,3}\)?)? ?\d{4,5}-?\d{4}$/.test(phone.value)) return true;
        document.getElementById("validation-phone").style.display = 'inline';
        return false;
    }

    function validaInstagram() {
        document.getElementById("validation-instagram").style.display = 'none';
        if (/^[a-zA-Z0-9._]{1,30}$/.test(instagram.value) || instagram.value === '') return true;
        document.getElementById("validation-instagram").style.display = 'inline';
        return false;
    }

    function validaBirth() {
        document.getElementById("validation-birth").style.display = 'none';
        const min = new Date();
        min.setFullYear(min.getFullYear() - 13);
        if (new Date(birth.value) <= min) return true;
        document.getElementById("validation-birth").style.display = 'inline';
        return false;
    }

    function validaJobTitle() {
        document.getElementById("validation-jobtitle").style.display =
            jobTitle.value ? 'none' : 'inline';
        return !!jobTitle.value;
    }

    function validaComoConheceu() {
        document.getElementById("validation-outros").style.display = 'none';
        document.getElementById("validation-indicacao").style.display = 'none';

        if (comoConheceu.value === 'indicacao' && quemIndicou.value === '') {
            document.getElementById("validation-indicacao").style.display = 'inline';
            return false;
        }
        if (comoConheceu.value === 'outros' && aonde.value === '') {
            document.getElementById("validation-outros").style.display = 'inline';
            return false;
        }
        return true;
    }

    function validaQuestionario() {
        let ok = true;
        questionarioFields.forEach(f => {
            f.setCustomValidity('');
            if (chkbxFraguista.checked && f.value.trim().length < 20) {
                f.setCustomValidity('mínimo 20 caracteres.');
                ok = false;
            }
        });
        return ok;
    }

    questionarioFields.forEach(f => {
        f.addEventListener('input', () => {
            if (f.value.trim().length >= 20) f.setCustomValidity('');
        });
    });

    /* =========================
       INICIALIZAÇÃO
    ========================== */

    restaurarFormulario();
    toggleObrigatoriedadeQuestionario();
    toggleConsentView();
    const visivelInicial = chkbxFraguista.checked ? 'block' : 'none';
    fraguistaField.style.display = visivelInicial;
    questionarioField.style.display = visivelInicial;
    updateBotaoRegistrar();
});