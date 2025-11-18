import { writeEthersContract } from '../web3/initialize.js';
import { propostaContractAddress } from '../propostas/propostaAddress.js';
import { poligonAbi } from '../web3/abi.js';

document.addEventListener('DOMContentLoaded', function () {
    const btnWithdraw = document.getElementById('btnWithdraw');

    async function withdraw() {
        const proposeHash = document.getElementById("withdrawHash").value.trim();
        try {
            const txHash = await writeEthersContract(propostaContractAddress, "withdraw", poligonAbi, [proposeHash]);
            alert("BNB sacado! Tx: " + txHash);
        } catch (error) {
            console.error("Erro em withdraw:", error);
            alert("Erro ao sacar BNB.");
        }
    }

    btnWithdraw.addEventListener('click', withdraw);
});