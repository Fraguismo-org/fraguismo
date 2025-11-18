import { propostaContractAddress } from "../propostas/propostaAddress.js";
import { walletConnection } from "../web3/wallet.js";
import { writeEthersContract } from "../web3/initialize.js";
import { poligonAbi } from "../web3/abi.js";

document.addEventListener('DOMContentLoaded', async () => {
    const btnBuyTokens = document.getElementById("buyTokens");

    async function buyTokens() {
        const proposeHash = document.getElementById("buyProposeHash").value.trim();
        const to = document.getElementById("buyTo").value.trim();
        const bnbValue = document.getElementById("bnbValue").value.trim();
        const valueInWei = walletConnection.ethers.parseEther(bnbValue);
        try {
            const txHash = await writeEthersContract(propostaContractAddress, "buyTokens", poligonAbi, [proposeHash, to], valueInWei);
            alert("Tokens comprados! Tx: " + txHash);
        } catch (error) {
            if (error.code === 'ACTION_REJECTED') {
                alert("Transação rejeitada pelo usuário.");
                return;
            }
            if (error.code === -32603 || error.code === 'INSUFFICIENT_FUNDS') {
                alert("Saldo insuficiente para completar a transação.");
                return;
            }
            console.error("Erro em buyTokens:", error);
            alert("Erro ao comprar tokens.");
        }
    }

    btnBuyTokens.addEventListener('click', buyTokens);
});