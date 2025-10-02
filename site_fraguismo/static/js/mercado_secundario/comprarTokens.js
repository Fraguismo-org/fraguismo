import { propostaContractAddress } from "../propostas/propostaAddress.js";
import { propostaABI } from "../propostas/propostaAbi.js";
import { walletConnection } from "../web3/wallet.js";
<<<<<<< HEAD
import { writeEthersContract } from "../web3/initialize.js";
=======
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98

document.addEventListener('DOMContentLoaded', async () => {
    const btnBuyTokens = document.getElementById("buyTokens");

    async function buyTokens() {
        const proposeHash = document.getElementById("buyProposeHash").value.trim();
        const to = document.getElementById("buyTo").value.trim();
        const bnbValue = document.getElementById("bnbValue").value.trim();
        const valueInWei = walletConnection.ethers.parseEther(bnbValue);
        try {
<<<<<<< HEAD
            const txHash = await writeEthersContract(propostaContractAddress, "buyTokens", propostaABI, [proposeHash, to], valueInWei);
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
=======
            const txHash = await writeWeb3Contract(propostaContractAddress, "buyTokens", propostaABI, [proposeHash, to], { value: valueInWei });
            alert("Tokens comprados! Tx: " + txHash);
        } catch (error) {
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
            console.error("Erro em buyTokens:", error);
            alert("Erro ao comprar tokens.");
        }
    }

    btnBuyTokens.addEventListener('click', buyTokens);
});