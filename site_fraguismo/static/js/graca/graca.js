const envioDaGracaAddress = "0x0909C2083b82eF27050c081eE85743d58cBB84E0"; // Substitua pelo endereço real após o deploy
const fragaTokenAddress = "0x1E93eCdb8d5026eE38bE4CE7Ae7A49A1e28E1c40"; // Endereço do token FRAGA

// ABI mínimo para a função approve do token ERC20
const fragaTokenABI = [
    { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

const envioDaGracaABI = [
    // Funções de consulta
    { "inputs": [], "name": "getSaldoUSDT", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "getPorcentagens", "outputs": [{ "internalType": "uint256", "name": "graca", "type": "uint256" }, { "internalType": "uint256", "name": "gastos", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "getStakersAtivos", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "_staker", "type": "address" }], "name": "getStakeInfo", "outputs": [{ "internalType": "uint256", "name": "quantidade", "type": "uint256" }, { "internalType": "uint256", "name": "blocoFinal", "type": "uint256" }, { "internalType": "bool", "name": "ativo", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "getVotacaoInfo", "outputs": [{ "internalType": "bool", "name": "aberta", "type": "bool" }, { "internalType": "uint256", "name": "novaPorcentagem", "type": "uint256" }, { "internalType": "uint256", "name": "pesoVotosSim", "type": "uint256" }, { "internalType": "uint256", "name": "pesoVotosNao", "type": "uint256" }, { "internalType": "bool", "name": "finalizada", "type": "bool" }, { "internalType": "bool", "name": "aprovada", "type": "bool" }, { "internalType": "uint256", "name": "blocosRestantes", "type": "uint256" }], "stateMutability": "view", "type": "function" },

    // Funções de stake
    { "inputs": [{ "internalType": "uint256", "name": "_quantidade", "type": "uint256" }], "name": "trancarTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "destrancarTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" },

    // Funções de distribuição
    { "inputs": [], "name": "distribuir", "outputs": [], "stateMutability": "nonpayable", "type": "function" },

    // Funções de votação
    { "inputs": [], "name": "registrarPresenca", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "bool", "name": "_decisao", "type": "bool" }], "name": "votar", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "finalizarVotacao", "outputs": [], "stateMutability": "nonpayable", "type": "function" },

    // Funções admin
    { "inputs": [{ "internalType": "uint256", "name": "_novaPorcentagem", "type": "uint256" }], "name": "iniciarVotacao", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "_novaCarteira", "type": "address" }], "name": "setCarteiraGastos", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

// Funções de consulta
async function consultarSaldoUSDT() {
    try {
        const saldo = await readWeb3Contract(envioDaGracaAddress, "getSaldoUSDT", envioDaGracaABI, []);
        document.getElementById("saldoUSDTResult").innerHTML = "Saldo USDT: " + formatTokenAmount(saldo) + " USDT";
    } catch (error) {
        console.error("Erro ao consultar saldo USDT:", error);
        alert("Erro ao consultar saldo USDT.");
    }
}

async function consultarPorcentagens() {
    try {
        const porcentagens = await readWeb3Contract(envioDaGracaAddress, "getPorcentagens", envioDaGracaABI, []);
        document.getElementById("porcentagensResult").innerHTML =
            "Porcentagem da Graça: " + porcentagens[0] + "% (para stakers)<br>" +
            "Porcentagem de Gastos: " + porcentagens[1] + "% (para carteira_de_gastos)";
    } catch (error) {
        console.error("Erro ao consultar porcentagens:", error);
        alert("Erro ao consultar porcentagens.");
    }
}

async function consultarStakersAtivos() {
    try {
        const stakers = await readWeb3Contract(envioDaGracaAddress, "getStakersAtivos", envioDaGracaABI, []);
        let result = "Stakers Ativos:<br>";
        if (stakers.length === 0) {
            result += "Nenhum staker ativo no momento.";
        } else {
            for (let i = 0; i < stakers.length; i++) {
                result += `${i + 1}. ${stakers[i]}<br>`;
            }
        }
        document.getElementById("stakersAtivosResult").innerHTML = result;
    } catch (error) {
        console.error("Erro ao consultar stakers ativos:", error);
        alert("Erro ao consultar stakers ativos.");
    }
}

async function consultarStake() {
    try {
        const address = document.getElementById("consultaStakeAddress").value.trim() || web3Account.address;
        const stakeInfo = await readWeb3Contract(envioDaGracaAddress, "getStakeInfo", envioDaGracaABI, [address]);
        let resultado = "Endereço: " + address + "<br>";
        resultado += "Quantidade: " + formatTokenAmount(stakeInfo[0]) + " FRAGA<br>";
        resultado += "Bloco Final: " + stakeInfo[1] + "<br>";
        resultado += "Status: " + (stakeInfo[2] ? "Ativo" : "Inativo");

        document.getElementById("stakeInfoResult").innerHTML = resultado;
    } catch (error) {
        console.error("Erro ao consultar stake:", error);
        alert("Erro ao consultar stake.");
    }
}

async function consultarStatusVotacao() {
    try {
        const votacaoInfo = await readWeb3Contract(envioDaGracaAddress, "getVotacaoInfo", envioDaGracaABI, []);
        let resultado = "Votação Aberta: " + (votacaoInfo[0] ? "Sim" : "Não") + "<br>";
        resultado += "Nova Porcentagem Proposta: " + votacaoInfo[1] + "%<br>";
        resultado += "Peso Total Votos Sim: " + formatTokenAmount(votacaoInfo[2]) + "<br>";
        resultado += "Peso Total Votos Não: " + formatTokenAmount(votacaoInfo[3]) + "<br>";
        resultado += "Finalizada: " + (votacaoInfo[4] ? "Sim" : "Não") + "<br>";
        resultado += "Aprovada: " + (votacaoInfo[5] ? "Sim" : "Não") + "<br>";
        resultado += "Blocos Restantes: " + votacaoInfo[6];

        document.getElementById("votacaoStatusResult").innerHTML = resultado;
    } catch (error) {
        console.error("Erro ao consultar status da votação:", error);
        alert("Erro ao consultar status da votação.");
    }
}

// Funções de stake e distribuição
async function trancarTokens() {
    try {
        const quantidade = document.getElementById("quantidadeTokens").value.trim();
        if (!quantidade || isNaN(quantidade) || parseFloat(quantidade) <= 0) {
            alert("Por favor, informe uma quantidade válida de tokens.");
            return;
        }

        const txHash = await writeWeb3Contract(envioDaGracaAddress, "trancarTokens", envioDaGracaABI, [quantidade]);
        alert("Tokens trancados com sucesso! Tx: " + txHash);
    } catch (error) {
        console.error("Erro ao trancar tokens:", error);
        alert("Erro ao trancar tokens. Verifique se você já aprovou o contrato para usar seus tokens FRAGA.");
    }
}

async function destrancarTokens() {
    try {
        const txHash = await writeWeb3Contract(envioDaGracaAddress, "destrancarTokens", envioDaGracaABI, []);
        alert("Tokens destrancados com sucesso! Tx: " + txHash);
    } catch (error) {
        console.error("Erro ao destrancar tokens:", error);
        alert("Erro ao destrancar tokens. Verifique se você possui tokens trancados e se o período de tranca já terminou.");
    }
}

async function distribuirUSDT() {
    try {
        const txHash = await writeWeb3Contract(envioDaGracaAddress, "distribuir", envioDaGracaABI, []);
        alert("USDT distribuído com sucesso! Tx: " + txHash);
    } catch (error) {
        console.error("Erro ao distribuir USDT:", error);
        alert("Erro ao distribuir USDT. Verifique se o contrato possui USDT e se existem stakers ativos.");
    }
}

// Funções de votação
async function registrarPresenca() {
    try {
        const txHash = await writeWeb3Contract(envioDaGracaAddress, "registrarPresenca", envioDaGracaABI, []);
        alert("Presença registrada com sucesso! Tx: " + txHash);
    } catch (error) {
        console.error("Erro ao registrar presença:", error);
        alert("Erro ao registrar presença. Verifique se você é diretor e se o período de registro está aberto.");
    }
}

async function votar() {
    try {
        const decisao = document.getElementById("votoDecisao").value === "true";
        const txHash = await writeWeb3Contract(envioDaGracaAddress, "votar", envioDaGracaABI, [decisao]);
        alert("Voto registrado com sucesso! Tx: " + txHash);
    } catch (error) {
        console.error("Erro ao votar:", error);
        alert("Erro ao votar. Verifique se você registrou presença e se o período de votação está aberto.");
    }
}

async function finalizarVotacao() {
    try {
        const txHash = await writeWeb3Contract(envioDaGracaAddress, "finalizarVotacao", envioDaGracaABI, []);
        alert("Votação finalizada com sucesso! Tx: " + txHash);
    } catch (error) {
        console.error("Erro ao finalizar votação:", error);
        alert("Erro ao finalizar votação. Verifique se o período de votação já terminou.");
    }
}

// Funções admin
async function iniciarVotacao() {
    try {
        const novaPorcentagem = document.getElementById("novaPorcentagem").value.trim();
        if (!novaPorcentagem || isNaN(novaPorcentagem) || parseFloat(novaPorcentagem) < 1 || parseFloat(novaPorcentagem) > 99) {
            alert("Por favor, informe uma porcentagem válida entre 1 e 99.");
            return;
        }

        const txHash = await writeWeb3Contract(envioDaGracaAddress, "iniciarVotacao", envioDaGracaABI, [novaPorcentagem]);
        alert("Votação iniciada com sucesso! Tx: " + txHash);
    } catch (error) {
        console.error("Erro ao iniciar votação:", error);
        alert("Erro ao iniciar votação. Verifique se você é o owner do contrato.");
    }
}

async function alterarCarteiraGastos() {
    try {
        const novaCarteira = document.getElementById("novaCarteiraGastos").value.trim();
        if (!novaCarteira || !ethers.utils.isAddress(novaCarteira)) {
            alert("Por favor, informe um endereço de carteira válido.");
            return;
        }

        const txHash = await writeWeb3Contract(envioDaGracaAddress, "setCarteiraGastos", envioDaGracaABI, [novaCarteira]);
        alert("Carteira de gastos alterada com sucesso! Tx: " + txHash);
    } catch (error) {
        console.error("Erro ao alterar carteira de gastos:", error);
        alert("Erro ao alterar carteira de gastos. Verifique se você é o owner do contrato.");
    }
}

// Função auxiliar para formatar quantidades de tokens
function formatTokenAmount(amount) {
    return (Number(amount) / 1e18).toFixed(2);
}

// Função para aprovar tokens FRAGA para o contrato EnvioDaGraca
async function aprovarTokens() {
    try {
        const quantidade = document.getElementById("quantidadeApprove").value.trim();
        if (!quantidade || isNaN(quantidade) || parseFloat(quantidade) <= 0) {
            alert("Por favor, informe uma quantidade válida de tokens.");
            return;
        }

        // Converte a quantidade para a forma com 18 decimais (padrão ERC20)
        const quantidadeWei = ethers.utils.parseUnits(quantidade, 18);

        // Verifica o saldo atual do usuário
        const saldo = await readWeb3Contract(fragaTokenAddress, "balanceOf", fragaTokenABI, [web3Account.address]);
        if (Number(saldo) < Number(quantidadeWei)) {
            alert("Saldo insuficiente. Você tem apenas " + formatTokenAmount(saldo) + " FRAGA.");
            return;
        }

        // Verifica a permissão atual
        const permissaoAtual = await readWeb3Contract(fragaTokenAddress, "allowance", fragaTokenABI, [web3Account.address, envioDaGracaAddress]);

        // Se já tem permissão suficiente, não precisa aprovar novamente
        if (Number(permissaoAtual) >= Number(quantidadeWei)) {
            alert("O contrato já possui permissão para utilizar esta quantidade de tokens.");
            return;
        }

        const txHash = await writeWeb3Contract(fragaTokenAddress, "approve", fragaTokenABI, [envioDaGracaAddress, quantidadeWei]);
        alert("Tokens FRAGA aprovados com sucesso! Tx: " + txHash);
    } catch (error) {
        console.error("Erro ao aprovar tokens:", error);
        alert("Erro ao aprovar tokens FRAGA.");
    }
}