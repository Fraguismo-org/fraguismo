const checarSaldo = async () => {
    try {
        const saldo = await lerContrato(
            checkBalanceAddr, // Endereço do token
            "getWalletBNBBalance",  // Função a ser chamada
            checkBalanceABI,     // ABI do token ERC-20
            ["0x03DB1Ebc0f3746fda5c6DBE5e62F03D888710447"] // Argumentos: dono (owner) e gastador (spender, o Router)
        );
        return saldo; // Retorna o valor da aprovação
    } catch (error) {
        console.error("Erro ao verificar allowance: ", error);
        return 0;
    }
};



const checkAllowance = async (tokenAddress, owner, spender) => {
    try {
        const allowance = await lerContrato(
            tokenAddress, // Endereço do token
            "allowance",  // Função a ser chamada
            tokenABI,     // ABI do token ERC-20
            [owner, spender] // Argumentos: dono (owner) e gastador (spender, o Router)
        );
        return allowance; // Retorna o valor da aprovação
    } catch (error) {
        console.error("Erro ao verificar allowance: ", error);
        return 0;
    }
};

function abreviarEndereco(endereco) {
    if (!endereco || endereco === "0x0000000000000000000000000000000000000000") return "-";
    return `${endereco.slice(0, 8)}...${endereco.slice(-6)}`;
}

function abrirAba(nome) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));
    document.getElementById(nome).classList.add('ativa');
}

