import { walletConnection } from "../web3/wallet.js";
import { readEthersContract, writeEthersContract } from "../web3/initialize.js";
import { fragaTokenABI } from "./fraga_token_abi.js";
import { envioDaGracaABI } from "./envio_graca_abi.js";
import { fragaTokenAddress, envioDaGracaAddress } from "./graca_addresses.js";

document.addEventListener('DOMContentLoaded', async () => {
    const btnAprovarTokens = document.getElementById("aprovarTokens");
    const btnTrancarTokens = document.getElementById("trancarTokens");
    const btnDestrancarTokens = document.getElementById("destrancarTokens");
    const btnDistribuirUSDT = document.getElementById("distribuirUSDT");

    const aprovarTokens = async () => {
        try {
            const quantidade = document.getElementById("quantidadeApprove").value.trim();
            if (!quantidade || isNaN(quantidade) || parseFloat(quantidade) <= 0) {
                alert("Por favor, informe uma quantidade válida de tokens.");
                return;
            }

            // Converte a quantidade para a forma com 18 decimais (padrão ERC20)
            const quantidadeWei = walletConnection.ethers.parseUnits(quantidade, 18);

            // Verifica o saldo atual do usuário
            const saldo = await readEthersContract(fragaTokenAddress, "balanceOf", fragaTokenABI, [walletConnection.walletAddress]);
            if (Number(saldo) < Number(quantidadeWei)) {
                alert("Saldo insuficiente. Você tem apenas " + formatTokenAmount(saldo) + " FRAGA.");
                return;
            }

            // Verifica a permissão atual
            const permissaoAtual = await readEthersContract(fragaTokenAddress, "allowance", fragaTokenABI, [walletConnection.walletAddress, envioDaGracaAddress]);

            // Se já tem permissão suficiente, não precisa aprovar novamente
            if (Number(permissaoAtual) >= Number(quantidadeWei)) {
                alert("O contrato já possui permissão para utilizar esta quantidade de tokens.");
                return;
            }

            const txHash = await writeEthersContract(fragaTokenAddress, "approve", fragaTokenABI, [envioDaGracaAddress, quantidadeWei]);
            alert("Tokens FRAGA aprovados com sucesso! Tx: " + txHash);
        } catch (error) {
            console.error("Erro ao aprovar tokens:", error);
            alert("Erro ao aprovar tokens FRAGA.");
        }
    }

    const trancarTokens = async () => {
        try {
            const quantidade = document.getElementById("quantidadeTokens").value.trim();
            if (!quantidade || isNaN(quantidade) || parseFloat(quantidade) <= 0) {
                alert("Por favor, informe uma quantidade válida de tokens.");
                return;
            }

            const txHash = await writeEthersContract(envioDaGracaAddress, "trancarTokens", envioDaGracaABI, [quantidade]);
            alert("Tokens trancados com sucesso! Tx: " + txHash);
        } catch (error) {
            if (error.code === "ACTION_REJECTED") {
                alert("Ação rejeitada pelo usuário.");
                return;
            }
            console.error("Erro ao trancar tokens:", error);
            alert("Erro ao trancar tokens. Verifique se você já aprovou o contrato para usar seus tokens FRAGA.");
        }
    }

    const destrancarTokens = async () => {
        try {
            const txHash = await writeEthersContract(envioDaGracaAddress, "destrancarTokens", envioDaGracaABI, []);
            alert("Tokens destrancados com sucesso! Tx: " + txHash);
        } catch (error) {
            if (error.code === "ACTION_REJECTED") {
                alert("Ação rejeitada pelo usuário.");
                return;
            }
            console.error("Erro ao destrancar tokens:", error);
            alert("Erro ao destrancar tokens. Verifique se você possui tokens trancados e se o período de tranca já terminou.");
        }
    }

    const distribuirUSDT = async () => {
        try {
            const txHash = await writeEthersContract(envioDaGracaAddress, "distribuir", envioDaGracaABI, []);
            alert("USDT distribuído com sucesso! Tx: " + txHash);
        } catch (error) {
            if (error.code === "ACTION_REJECTED") {
                alert("Ação rejeitada pelo usuário.");
                return;
            }
            console.error("Erro ao distribuir USDT:", error);
            alert("Erro ao distribuir USDT. Verifique se o contrato possui USDT e se existem stakers ativos.");
        }
    }

    btnAprovarTokens.addEventListener('click', aprovarTokens);
    btnTrancarTokens.addEventListener('click', trancarTokens);
    btnDestrancarTokens.addEventListener('click', destrancarTokens);
    btnDistribuirUSDT.addEventListener('click', distribuirUSDT);
});