import { walletConnection } from "../web3/wallet";

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


// Função auxiliar para formatar quantidades de tokens
function formatTokenAmount(amount) {
    return (Number(amount) / 1e18).toFixed(2);
}