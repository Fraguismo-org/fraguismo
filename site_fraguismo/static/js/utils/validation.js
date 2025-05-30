export class Validation {
    static validaEmail(email){        
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    static validaPassword(senha){        
        if (senha.length < 8) {            
            return false;        
        }
        
        if (/^\d+$/.test(senha)) {
           return false;
        }
    
        if (!/[A-Za-z]/.test(senha.value) || !/\d/.test(senha.value)) {
            return false;
        }
        
        return true;
    }
    
    static validaNome(nome){        
        return nome !== "";
    }

    static validaSobrenome(sobreNome){        
        return sobreNome !== '';
        
    }
    
    static validaLocalidade(localidade) {        
        return localidade !== '';
    }

    static validaPhone(phone){        
        const regex = /^(\d{7,15})/;
        return regex.test(phone);
    }
    
    static validaInstagram(instagram){        
        const regex = /^[a-zA-Z0-9._]{1,30}$/;
        return regex.test(instagram.value) || instagram.value === '';
    }

    static validaBirth(birth){       
        const nascimento = new Date(birth);
        const dataAtual = new Date();
        const dataMinima = new Date();
        dataMinima.setFullYear(dataAtual.getFullYear() - 13);
        
        return nascimento <= dataMinima;
    }

    static validaJobTitle(jobTitle){
        return jobTitle.value !== '';
    }
}