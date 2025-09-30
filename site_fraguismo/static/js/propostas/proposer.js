import { writeEthersContract } from '../web3/initialize.js';
import { propostaABI } from './propostaAbi.js';
import { propostaContractAddress } from './propostaAddress.js';

document.addEventListener('DOMContentLoaded', function () {
    const btnMakePropose = document.getElementById('btnMakePropose');
    const btnWithdraw = document.getElementById('btnWithdraw');

    async function makePropose() {
        const proposeHash = document.getElementById("proposeHash").value.trim();
        const amount = document.getElementById("amount").value.trim();
        const wallet = document.getElementById("wallet").value.trim();
        const price = document.getElementById("price").value.trim();
        try {
            const txHash = await writeEthersContract(propostaContractAddress, "makePropose", propostaABI, [amount, wallet, proposeHash, price]);
            alert("Proposta criada! Tx: " + txHash);
        } catch (error) {
            console.error("Erro em makePropose:", error);
            alert("Erro ao criar proposta.");
        }
    }

    async function withdraw() {
        const proposeHash = document.getElementById("withdrawHash").value.trim();
        try {
            const txHash = await writeEthersContract(propostaContractAddress, "withdraw", propostaABI, [proposeHash]);
            alert("BNB sacado! Tx: " + txHash);
        } catch (error) {
            console.error("Erro em withdraw:", error);
            alert("Erro ao sacar BNB.");
        }
    }

    btnMakePropose.addEventListener('click', makePropose);
    btnWithdraw.addEventListener('click', withdraw);
});