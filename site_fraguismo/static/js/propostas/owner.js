import { propostaABI } from "./propostaAbi.js";
import { propostaContractAddress } from "./propostaAddress.js";
<<<<<<< HEAD
import { readEthersContract, writeEthersContract } from "../web3/initialize.js";
=======
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98

document.addEventListener('DOMContentLoaded', async () => {
    const btnAbrirVotacao = document.getElementById("abrirVotacao");
    const btnClearPresence = document.getElementById("clearPresence");
    const btnKillContract = document.getElementById("killContract");
    const btnGetBlocksUntilVotingEnds = document.getElementById("getBlocksUntilVotingEnds");

    async function abrirVotacao() {
        try {
<<<<<<< HEAD
            const txHash = await writeEthersContract(propostaContractAddress, "abrirVotacao", propostaABI, []);
=======
            const txHash = await writeWeb3Contract(propostaContractAddress, "abrirVotacao", propostaABI, []);
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
            alert("Votação aberta! Tx: " + txHash);
        } catch (error) {
            console.error("Erro em abrirVotacao:", error);
            alert("Erro ao abrir votação.");
        }
    }

    async function clearPresence() {
        try {
<<<<<<< HEAD
            const txHash = await writeEthersContract(propostaContractAddress, "clearPresence", propostaABI, []);
=======
            const txHash = await writeWeb3Contract(propostaContractAddress, "clearPresence", propostaABI, []);
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
            alert("Registros de presença limpos! Tx: " + txHash);
        } catch (error) {
            console.error("Erro em clearPresence:", error);
            alert("Erro ao limpar registros.");
        }
    }

    async function killContract() {
        if (confirm("Tem certeza que deseja executar killContract?")) {
            try {
<<<<<<< HEAD
                const txHash = await writeEthersContract(propostaContractAddress, "killContract", propostaABI, []);
=======
                const txHash = await writeWeb3Contract(propostaContractAddress, "killContract", propostaABI, []);
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
                alert("Contrato encerrado! Tx: " + txHash);
            } catch (error) {
                console.error("Erro em killContract:", error);
                alert("Erro ao encerrar contrato.");
            }
        }
    }

    async function getBlocksUntilVotingEnds() {
        try {
<<<<<<< HEAD
            const blocks = await readEthersContract(propostaContractAddress, "getBlocksUntilVotingEnds", propostaABI, []);
=======
            const blocks = await readWeb3Contract(propostaContractAddress, "getBlocksUntilVotingEnds", propostaABI, []);
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
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