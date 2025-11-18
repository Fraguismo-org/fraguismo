const applyNumberFormat = (inputElement, options = {}) => {
    const settings = {
        thousands: options.thousands || '.',
        decimal: options.decimal || ',',
        allowDecimal: options.allowDecimal || false,
        maxDecimals: options.maxDecimals || 2,
        maxLength: options.maxLength || null,
        alwaysShowDecimal: options.alwaysShowDecimal || false // Nova opção para sempre mostrar decimais
    }

    // Função para formatar valor como moeda (entrada da direita para esquerda)
    const formatAsCurrency = (value) => {
        // Remove tudo que não for número
        let numbers = value.replace(/\D/g, '');
        
        // Se não houver números, retorna valor padrão
        if (numbers === '') {
            return '0' + settings.decimal + '00';
        }
        
        // Adiciona zeros à esquerda se necessário
        while (numbers.length < settings.maxDecimals + 1) {
            numbers = '0' + numbers;
        }
        
        // Aplica limite de tamanho se configurado (conta apenas a parte inteira)
        if (settings.maxLength) {
            const integerPartLength = numbers.length - settings.maxDecimals;
            if (integerPartLength > settings.maxLength) {
                numbers = numbers.substring(numbers.length - (settings.maxLength + settings.maxDecimals));
            }
        }
        
        // Separa parte inteira e decimal
        const decimalPart = numbers.slice(-settings.maxDecimals);
        let integerPart = numbers.slice(0, -settings.maxDecimals) || '0';
        
        // Remove zeros à esquerda da parte inteira (exceto se for só zero)
        integerPart = integerPart.replace(/^0+/, '') || '0';
        
        // Adiciona separadores de milhares
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, settings.thousands);
        
        // Retorna valor formatado
        return integerPart + settings.decimal + decimalPart;
    };

    // Função para formatar valor normal (com decimal opcional)
    const formatNormal = (value) => {
        let cursorPosition = inputElement.selectionStart;
        let oldLength = value.length;

        value = value.replace(/[^\d,]/g, '');
        
        const parts = value.split(',');

        if (parts.length > 2) {
            value = parts[0] + ',' + parts.slice(1).join('');
        }

        if (parts.length === 2 && parts[1].length > settings.maxDecimals) {
            value = parts[0] + ',' + parts[1].substring(0, settings.maxDecimals);
        }

        parts[0] = parts[0].replace(/\./g, '');

        if (settings.maxLength && parts[0].length > settings.maxLength) {
            parts[0] = parts[0].substring(0, settings.maxLength);
        }

        if (parts[0]) {
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, settings.thousands);
            value = parts.join(',');
        }

        return { value, cursorPosition, oldLength };
    };

    inputElement.addEventListener('input', function (e) {
        if (settings.alwaysShowDecimal) {
            // Modo moeda: sempre mostra decimais
            const formattedValue = formatAsCurrency(e.target.value);
            e.target.value = formattedValue;
        } else if (settings.allowDecimal) {
            // Modo normal com decimal opcional
            const result = formatNormal(e.target.value);
            e.target.value = result.value;
            
            // Ajusta posição do cursor
            const newLength = result.value.length;
            const diff = newLength - result.oldLength;
            const newPosition = Math.max(0, result.cursorPosition + diff);
            e.target.setSelectionRange(newPosition, newPosition);
        } else {
            // Modo sem decimal
            let value = e.target.value;
            let cursorPosition = e.target.selectionStart;
            let oldLength = value.length;
            
            value = value.replace(/\D/g, '');

            if (settings.maxLength && value.length > settings.maxLength) {
                value = value.substring(0, settings.maxLength);
            }

            value = value.replace(/\B(?=(\d{3})+(?!\d))/g, settings.thousands);
            
            e.target.value = value;

            const newLength = value.length;
            const diff = newLength - oldLength;
            const newPosition = Math.max(0, cursorPosition + diff);
            e.target.setSelectionRange(newPosition, newPosition);
        }
    });

    inputElement.addEventListener('paste', function (e) {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        
        if (settings.alwaysShowDecimal) {
            // Para modo moeda, limpa e formata
            const cleanData = pastedData.replace(/\D/g, '');
            e.target.value = formatAsCurrency(cleanData);
        } else {
            const cleanData = settings.allowDecimal ?
                pastedData.replace(/[^\d,]/g, '') :
                pastedData.replace(/\D/g, '');

            e.target.value = cleanData;
            e.target.dispatchEvent(new Event('input'));
        }
    });

    inputElement.addEventListener('keydown', function(e) {
        // Para modo moeda, apenas permite números e teclas de navegação/edição
        if (settings.alwaysShowDecimal) {
            // Permite: backspace, delete, tab, escape, enter
            if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                // Permite: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true) ||
                // Permite: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            
            // Garante que é um número
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && 
                (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        } else {
            // Comportamento original para outros modos
            // Permite: backspace, delete, tab, escape, enter
            if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                // Permite: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true) ||
                // Permite: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            
            // Bloqueia se não for número ou vírgula (quando permitido)
            if (settings.allowDecimal && e.keyCode === 188) {
                // Permite vírgula apenas se ainda não houver uma
                if (e.target.value.indexOf(',') !== -1) {
                    e.preventDefault();
                }
                return;
            }
            
            // Garante que é um número
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && 
                (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        }
    });
    
    // Formata valor inicial se existir
    if (settings.alwaysShowDecimal && inputElement.value) {
        inputElement.value = formatAsCurrency(inputElement.value);
    }
}

// Função auxiliar para obter valor numérico
const getNumericValue = (inputElement, decimals = 2) => {
    const value = inputElement.value.replace(/\D/g, '');
    if (!value) return 0;
    
    // Converte centavos para valor decimal
    const numericValue = parseInt(value) / Math.pow(10, decimals);
    return numericValue;
}

// Função auxiliar para definir valor programaticamente
const setNumericValue = (inputElement, value, decimals = 2) => {
    // Converte valor para centavos e depois para string
    const cents = Math.round(value * Math.pow(10, decimals));
    inputElement.value = cents.toString();
    inputElement.dispatchEvent(new Event('input'));
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[data-type="currency"]').forEach(input => {
        applyNumberFormat(input, {
            allowDecimal: true,
            maxDecimals: 2,
            maxLength: 10,
            alwaysShowDecimal: true,
        });
    });
});