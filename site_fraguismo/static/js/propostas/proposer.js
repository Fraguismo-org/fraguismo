import { writeEthersContract } from '../web3/initialize.js';
import { propostaABI } from './propostaAbi.js';
import { propostaContractAddress } from './propostaAddress.js';

document.addEventListener('DOMContentLoaded', function () {
    const btnMakePropose = document.getElementById('btnMakePropose');

    async function makePropose() {
        const proposeHash = document.getElementById("proposeHash").value.trim();
        const amount = document.getElementById("amount").value.trim();
        const wallet = document.getElementById("wallet").value.trim();
        const price = document.getElementById("price").value.trim();

        if (proposeHash === '') {
            alert("Campo \"Hash da Proposta\" não pode ficar vazio.");
            return;
        }

        if (wallet === '') {
            alert("Campo \"Carteira para Recebimento\" não pode ficar vazia.");
            return;
        }


        try {
            const txHash = await writeEthersContract(propostaContractAddress, "makePropose", propostaABI, [amount, wallet, proposeHash, price]);
            alert("Proposta criada! Tx: " + txHash);
        } catch (error) {
            console.error("Erro em makePropose:", error);
            alert("Erro ao criar proposta.");
        }
    }
    btnMakePropose.addEventListener('click', makePropose);
});