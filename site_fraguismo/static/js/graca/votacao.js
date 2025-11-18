import { poligonAbi } from '../web3/abi.js';
import { writeEthersContract } from '../web3/initialize.js';


document.addEventListener('DOMContentLoaded', async () => {
    const btnRegistrarPresenca = document.getElementById("registrarPresenca");
    const btnVotar = document.getElementById("votar");
    const btnFinalizarVotacao = document.getElementById("finalizarVotacao");

    const registrarPresenca = async () => {
        try {
            const txHash = await writeEthersContract(propostaContractAddress, "registerPresence", poligonAbi, []);
            alert("Presença registrada com sucesso! Tx: " + txHash);
        } catch (error) {
            console.error("Erro ao registrar presença:", error);
            alert("Erro ao registrar presença. Verifique se você é guardião e se o período de registro está aberto.");
        }
    }

    const votar = async () => {
        try {
            const decisao = document.getElementById("votoDecisao").value === "true";
            const txHash = await writeEthersContract(propostaContractAddress, "doVote", poligonAbi, [decisao]);
            alert("Voto registrado com sucesso! Tx: " + txHash);
        } catch (error) {
            console.error("Erro ao votar:", error);
            alert("Erro ao votar. Verifique se você registrou presença e se o período de votação está aberto.");
        }
    }

    const finalizarVotacao = async () => {
        try {
            const txHash = await writeEthersContract(propostaContractAddress, "endVote", poligonAbi, []);
            alert("Votação finalizada com sucesso! Tx: " + txHash);
        } catch (error) {
            console.error("Erro ao finalizar votação:", error);
            alert("Erro ao finalizar votação. Verifique se o período de votação já terminou.");
        }
    }

    btnRegistrarPresenca.addEventListener('click', registrarPresenca);
    btnVotar.addEventListener('click', votar);
    btnFinalizarVotacao.addEventListener('click', finalizarVotacao);
});