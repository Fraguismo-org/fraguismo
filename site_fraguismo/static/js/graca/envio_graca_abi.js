export const envioDaGracaABI = [
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