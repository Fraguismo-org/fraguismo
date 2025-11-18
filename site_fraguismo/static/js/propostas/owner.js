import { propostaContractAddress } from "./propostaAddress.js";
import { readEthersContract, writeEthersContract } from "../web3/initialize.js";
import { poligonAbi } from "../web3/abi.js";

document.addEventListener('DOMContentLoaded', async () => {
    const btnAbrirVotacao = document.getElementById("abrirVotacao");
    const btnClearPresence = document.getElementById("clearPresence");
    const btnKillContract = document.getElementById("killContract");
    const btnGetBlocksUntilVotingEnds = document.getElementById("getBlocksUntilVotingEnds");

    async function abrirVotacao() {
        try {
            const txHash = await writeEthersContract(propostaContractAddress, "abrirVotacaoguardiao", poligonAbi, []);
            alert("Votação aberta! Tx: " + txHash);
        } catch (error) {
            console.error("Erro em abrirVotacao:", error);
            alert("Erro ao abrir votação.");
        }
    }

    async function clearPresence() {
        try {
            const txHash = await writeEthersContract(propostaContractAddress, "clearPresence", poligonAbi, []);
            alert("Registros de presença limpos! Tx: " + txHash);
        } catch (error) {
            console.error("Erro em clearPresence:", error);
            alert("Erro ao limpar registros.");
        }
    }

    // async function killContract() {
    //     if (confirm("Tem certeza que deseja executar killContract?")) {
    //         try {
    //             const txHash = await writeEthersContract(propostaContractAddress, "killContract", propostaABI, []);
    //             alert("Contrato encerrado! Tx: " + txHash);
    //         } catch (error) {
    //             console.error("Erro em killContract:", error);
    //             alert("Erro ao encerrar contrato.");
    //         }
    //     }
    // }

    async function getBlocksUntilVotingEnds() {
        try {
            const blocks = await readEthersContract(propostaContractAddress, "getBlocksUntilVotingEnds", poligonAbi, []);
            document.getElementById("blocksResult").innerHTML = "Blocos restantes: " + blocks;
        } catch (error) {
            console.error("Erro em getBlocksUntilVotingEnds:", error);
            alert("Erro ao consultar blocos.");
        }
    }

    btnAbrirVotacao.addEventListener('click', abrirVotacao);
    btnClearPresence.addEventListener('click', clearPresence);
    btnKillContract.addEventListener('click', killContract);
    btnGetBlocksUntilVotingEnds.addEventListener('click', getBlocksUntilVotingEnds);
});