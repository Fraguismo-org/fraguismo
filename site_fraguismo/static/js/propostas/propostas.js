import { propostaContractAddress } from "./propostaAddress.js";
import { propostaABI } from "./propostaAbi.js";
import { readEthersContract, writeEthersContract } from "../web3/initialize.js";

document.addEventListener("DOMContentLoaded", async () => {
    const btnListOpenProposals = document.getElementById("listOpenProposals");
    const btnGetProposalDetails = document.getElementById("getProposalDetails");
    const btnRegisterPresence = document.getElementById("registerPresence");    
    const btnEndVoting = document.getElementById("endVoting");    
    const btnDoVote = document.getElementById("doVote");

    const listOpenProposals = async () => {
        try {
            const openProposals = await readEthersContract(propostaContractAddress, "getOpenProposals", propostaABI, []);
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
            const details = await readEthersContract(propostaContractAddress, "getProposalDetails", propostaABI, [proposeHash]);
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
            const txHash = await writeEthersContract(propostaContractAddress, "registerPresence", propostaABI, []);
            alert("Presença registrada! Tx: " + txHash);
        } catch (error) {
            console.error("Erro em registerPresence:", error);
            alert("Erro ao registrar presença.");
        }
    }    

    async function endVote() {
        const proposeHash = document.getElementById("endVoteHash").value.trim();
        try {
            const txHash = await writeEthersContract(propostaContractAddress, "endVote", propostaABI, [proposeHash]);
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
            const txHash = await writeEthersContract(propostaContractAddress, "doVote", propostaABI, [proposeHash, decision]);
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


async function abrirVotacao() {
    try {
        const txHash = await writeEthersContract(propostaContractAddress, "abrirVotacao", propostaABI, []);
        alert("Votação aberta! Tx: " + txHash);
    } catch (error) {
        console.error("Erro em abrirVotacao:", error);
        alert("Erro ao abrir votação.");
    }
}

async function clearPresence() {
    try {
        const txHash = await writeEthersContract(propostaContractAddress, "clearPresence", propostaABI, []);
        alert("Registros de presença limpos! Tx: " + txHash);
    } catch (error) {
        console.error("Erro em clearPresence:", error);
        alert("Erro ao limpar registros.");
    }
}

async function killContract() {
    if (confirm("Tem certeza que deseja executar killContract?")) {
        try {
            const txHash = await writeEthersContract(propostaContractAddress, "killContract", propostaABI, []);
            alert("Contrato encerrado! Tx: " + txHash);
        } catch (error) {
            console.error("Erro em killContract:", error);
            alert("Erro ao encerrar contrato.");
        }
    }
}

async function getBlocksUntilVotingEnds() {
    try {
        const blocks = await readEthersContract(propostaContractAddress, "getBlocksUntilVotingEnds", propostaABI, []);
        document.getElementById("blocksResult").innerHTML = "Blocos restantes: " + blocks;
    } catch (error) {
        console.error("Erro em getBlocksUntilVotingEnds:", error);
        alert("Erro ao consultar blocos.");
    }
}

// async function registerPresence() {
//     try {
//         const txHash = await writeEthersContract(propostaContractAddress, "registerPresence", propostaABI, []);
//         alert("Presença registrada! Tx: " + txHash);
//     } catch (error) {
//         console.error("Erro em registerPresence:", error);
//         alert("Erro ao registrar presença.");
//     }
// }

// async function makePropose() {
//     const proposeHash = document.getElementById("proposeHash").value.trim();
//     const amount = document.getElementById("amount").value.trim();
//     const wallet = document.getElementById("wallet").value.trim();
//     const price = document.getElementById("price").value.trim();
//     try {
//         const txHash = await writeEthersContract(propostaContractAddress, "makePropose", propostaABI, [amount, wallet, proposeHash, price]);
//         alert("Proposta criada! Tx: " + txHash);
//     } catch (error) {
//         console.error("Erro em makePropose:", error);
//         alert("Erro ao criar proposta.");
//     }
// }

// async function doVote() {
//     const proposeHash = document.getElementById("voteHash").value.trim();
//     const decision = (document.getElementById("voteDecision").value.trim() === "true");
//     try {
//         const txHash = await writeEthersContract(propostaContractAddress, "doVote", propostaABI, [proposeHash, decision]);
//         alert("Voto realizado! Tx: " + txHash);
//     } catch (error) {
//         console.error("Erro em doVote:", error);
//         alert("Erro ao votar.");
//     }
// }

// async function endVote() {
//     const proposeHash = document.getElementById("endVoteHash").value.trim();
//     try {
//         const txHash = await writeEthersContract(propostaContractAddress, "endVote", propostaABI, [proposeHash]);
//         alert("Votação encerrada! Tx: " + txHash);
//     } catch (error) {
//         console.error("Erro em endVote:", error);
//         alert("Erro ao encerrar votação.");
//     }
// }

async function buyTokens() {
    const proposeHash = document.getElementById("buyProposeHash").value.trim();
    const to = document.getElementById("buyTo").value.trim();
    const bnbValue = document.getElementById("bnbValue").value.trim();
    const valueInWei = ethers.utils.parseEther(bnbValue);
    try {
        const txHash = await writeEthersContract(propostaContractAddress, "buyTokens", propostaABI, [proposeHash, to], { value: valueInWei });
        alert("Tokens comprados! Tx: " + txHash);
    } catch (error) {
        console.error("Erro em buyTokens:", error);
        alert("Erro ao comprar tokens.");
    }
}

// async function withdraw() {
//     const proposeHash = document.getElementById("withdrawHash").value.trim();
//     try {
//         const txHash = await writeEthersContract(propostaContractAddress, "withdraw", propostaABI, [proposeHash]);
//         alert("BNB sacado! Tx: " + txHash);
//     } catch (error) {
//         console.error("Erro em withdraw:", error);
//         alert("Erro ao sacar BNB.");
//     }
// }

// async function getProposalDetails() {
//     const proposeHash = document.getElementById("queryProposeHash").value.trim();
//     try {
//         const details = await readEthersContract(propostaContractAddress, "getProposalDetails", propostaABI, [proposeHash]);
//         console.log(details);
//         let result = "Proposer: " + details[0] + "<br>";
//         result += "Wallet: " + details[1] + "<br>";
//         result += "Amount: " + details[2] + "<br>";
//         result += "Price: " + details[3] + "<br>";
//         result += "Total Yes Weight: " + details[4] + "<br>";
//         result += "Total No Weight: " + details[5] + "<br>";
//         result += "Ended: " + details[6] + "<br>";
//         result += "Approved: " + details[7] + "<br>";
//         result += "Tokens Remaining: " + details[8] + "<br>";
//         result += "BNB Balance: " + details[9];
//         document.getElementById("proposalResult").innerHTML = result;
//     } catch (error) {
//         console.error("Erro em getProposalDetails:", error);
//         alert("Erro ao consultar detalhes da proposta.");
//     }
// }

// async function listOpenProposals() {

// }

function preencher(hash) {
    // Exemplo: Preencher os campos com o valor do hash
    document.getElementById("voteHash").value = hash;
    document.getElementById("endVoteHash").value = hash;
    document.getElementById("buyProposeHash").value = hash;
    document.getElementById("queryProposeHash").value = hash;
    getProposalDetails();
    buyTo.value = web3Account.address;
}