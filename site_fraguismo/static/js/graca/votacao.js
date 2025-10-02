<<<<<<< HEAD
import { writeEthersContract } from '../web3/initialize.js';
import { envioDaGracaABI } from './envio_graca_abi.js';
import { envioDaGracaAddress } from './graca_addresses.js';


=======
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
document.addEventListener('DOMContentLoaded', async () => {
    const btnRegistrarPresenca = document.getElementById("registrarPresenca");
    const btnVotar = document.getElementById("votar");
    const btnFinalizarVotacao = document.getElementById("finalizarVotacao");

    const registrarPresenca = async () => {
        try {
<<<<<<< HEAD
            const txHash = await writeEthersContract(envioDaGracaAddress, "registrarPresenca", envioDaGracaABI, []);
=======
            const txHash = await writeWeb3Contract(envioDaGracaAddress, "registrarPresenca", envioDaGracaABI, []);
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
            alert("Presença registrada com sucesso! Tx: " + txHash);
        } catch (error) {
            console.error("Erro ao registrar presença:", error);
            alert("Erro ao registrar presença. Verifique se você é diretor e se o período de registro está aberto.");
        }
    }

    const votar = async () => {
        try {
            const decisao = document.getElementById("votoDecisao").value === "true";
<<<<<<< HEAD
            const txHash = await writeEthersContract(envioDaGracaAddress, "votar", envioDaGracaABI, [decisao]);
=======
            const txHash = await writeWeb3Contract(envioDaGracaAddress, "votar", envioDaGracaABI, [decisao]);
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
            alert("Voto registrado com sucesso! Tx: " + txHash);
        } catch (error) {
            console.error("Erro ao votar:", error);
            alert("Erro ao votar. Verifique se você registrou presença e se o período de votação está aberto.");
        }
    }

    const finalizarVotacao = async () => {
        try {
<<<<<<< HEAD
            const txHash = await writeEthersContract(envioDaGracaAddress, "finalizarVotacao", envioDaGracaABI, []);
=======
            const txHash = await writeWeb3Contract(envioDaGracaAddress, "finalizarVotacao", envioDaGracaABI, []);
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
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