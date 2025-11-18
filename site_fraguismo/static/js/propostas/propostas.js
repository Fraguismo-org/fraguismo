import { propostaContractAddress } from "./propostaAddress.js";
import { readEthersContract, writeEthersContract } from "../web3/initialize.js";
import { poligonAbi } from "../web3/abi.js";

document.addEventListener("DOMContentLoaded", async () => {
    const btnListOpenProposals = document.getElementById("listOpenProposals");
    const btnGetProposalDetails = document.getElementById("getProposalDetails");
    const btnRegisterPresence = document.getElementById("registerPresence");    
    const btnEndVoting = document.getElementById("endVoting");    
    const btnDoVote = document.getElementById("doVote");

    const listOpenProposals = async () => {
        try {
            const openProposals = await readEthersContract(propostaContractAddress, "getOpenProposals", poligonAbi, [] );
            if (openProposals === null || openProposals.length === 0) {
                document.getElementById("openProposalsResult").innerHTML = "Nenhuma proposta ativa.";
                return;
            }
            let result = "Propostas Ativas:<br>";
            for (let i = 0; i < openProposals.length; i++) {
                result += `<a href="#" onclick="preencher('${openProposals[i]}')">${openProposals[i]}</a><br>`;
            }
            document.getElementById("openProposalsResult").innerHTML = result;
        } catch (error) {
            console.error("Erro em getOpenProposals:", error);
            alert("Erro ao listar propostas ativas.");
        }
    }

    async function getProposalDetails() {
        const proposeHash = document.getElementById("queryProposeHash").value.trim();
        try {
            if (proposeHash === '') {
                alert("Campo \"Hash da Proposta\" não pode ficar vazio.");
                return;
            }
            const details = await readEthersContract(propostaContractAddress, "getProposalDetails", poligonAbi, [proposeHash]);
            if (details === null ) {
                document.getElementById("proposalResult").innerHTML = "Proposta não encontrada.";
                return;
            }
            console.log(details);
            let result = "Proposer: " + details[0] + "<br>";
            result += "Wallet: " + details[1] + "<br>";
            result += "Amount: " + details[2] + "<br>";
            result += "Price: " + details[3] + "<br>";
            result += "Total Yes Weight: " + details[4] + "<br>";
            result += "Total No Weight: " + details[5] + "<br>";
            result += "Ended: " + details[6] + "<br>";
            result += "Approved: " + details[7] + "<br>";
            result += "Tokens Remaining: " + details[8] + "<br>";
            result += "BNB Balance: " + details[9];
            document.getElementById("proposalResult").innerHTML = result;
        } catch (error) {
            console.error("Erro em getProposalDetails:", error);
            alert("Erro ao consultar detalhes da proposta.");
        }
    }

    async function registerPresence() {
        try {
            const txHash = await writeEthersContract(propostaContractAddress, "registerPresence", poligonAbi, []);
            alert("Presença registrada! Tx: " + txHash);
        } catch (error) {
            console.error("Erro em registerPresence:", error);
            alert("Erro ao registrar presença.");
        }
    }    

    async function endVote() {
        const proposeHash = document.getElementById("endVoteHash").value.trim();
        try {
            const txHash = await writeEthersContract(propostaContractAddress, "endVote", poligonAbi, [proposeHash]);
            if (txHash === null) {
                alert("Erro ao encerrar votação.");
                return;
            }
            alert("Votação encerrada! Tx: " + txHash);
        } catch (error) {
            if (error.code === "ACTION_REJECTED") {
                alert("Transação rejeitada pelo usuário.");
                return;
            }
            console.error("Erro em endVote:", error);
            alert("Erro ao encerrar votação.");
        }
    }    

    async function doVote() {
        const proposeHash = document.getElementById("voteHash").value.trim();
        const decision = (document.getElementById("voteDecision").value.trim() === "true");
        try {
            const txHash = await writeEthersContract(propostaContractAddress, "doVote", poligonAbi, [proposeHash, decision]);
            if (txHash === null) {
                alert("Erro ao votar.");
                return;
            }
            alert("Voto realizado! Tx: " + txHash);
        } catch (error) {
            if (error.code === "ACTION_REJECTED") {
                alert("Transação rejeitada pelo usuário.");
                return;
            }
            console.error("Erro em doVote:", error);
            alert("Erro ao votar.");
        }
    }

    btnListOpenProposals.addEventListener('click', listOpenProposals);
    btnGetProposalDetails.addEventListener('click', getProposalDetails);
    btnRegisterPresence.addEventListener('click', registerPresence);
    btnEndVoting.addEventListener('click', endVote);    
    btnDoVote.addEventListener('click', doVote);
});
