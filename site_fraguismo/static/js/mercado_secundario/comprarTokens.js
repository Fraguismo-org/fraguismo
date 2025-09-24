import { propostaContractAddress } from "../propostas/propostaAddress.js";
import { propostaABI } from "../propostas/propostaAbi.js";
import { walletConnection } from "../web3/wallet.js";

document.addEventListener('DOMContentLoaded', async () => {
    const btnBuyTokens = document.getElementById("buyTokens");

    async function buyTokens() {
        const proposeHash = document.getElementById("buyProposeHash").value.trim();
        const to = document.getElementById("buyTo").value.trim();
        const bnbValue = document.getElementById("bnbValue").value.trim();
        const valueInWei = walletConnection.ethers.parseEther(bnbValue);
        try {
            const txHash = await writeWeb3Contract(propostaContractAddress, "buyTokens", propostaABI, [proposeHash, to], { value: valueInWei });
            alert("Tokens comprados! Tx: " + txHash);
        } catch (error) {
            console.error("Erro em buyTokens:", error);
            alert("Erro ao comprar tokens.");
        }
    }

    btnBuyTokens.addEventListener('click', buyTokens);
});