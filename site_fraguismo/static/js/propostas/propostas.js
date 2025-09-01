const propostaContractAddress = "0xdEcFb7Da2085b7FDb3D3FA746801407CfDd46A30";
const propostaABI = [
    { "inputs": [], "name": "abrirVotacao", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "registerPresence", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    {
        "inputs": [
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "address", "name": "wallet", "type": "address" },
            { "internalType": "string", "name": "proposeHash", "type": "string" },
            { "internalType": "uint256", "name": "price", "type": "uint256" }
        ], "name": "makePropose", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "proposeHash", "type": "string" },
            { "internalType": "bool", "name": "decision", "type": "bool" }
        ], "name": "doVote", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "proposeHash", "type": "string" }],
        "name": "endVote", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "proposeHash", "type": "string" },
            { "internalType": "address", "name": "to", "type": "address" }
        ], "name": "buyTokens", "outputs": [], "stateMutability": "payable", "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "proposeHash", "type": "string" }],
        "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    { "inputs": [], "name": "clearPresence", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "getBlocksUntilVotingEnds", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    {
        "inputs": [{ "internalType": "string", "name": "proposeHash", "type": "string" }],
        "name": "getProposalDetails", "outputs": [
            { "internalType": "address", "name": "proposer", "type": "address" },
            { "internalType": "address", "name": "wallet", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "uint256", "name": "price", "type": "uint256" },
            { "internalType": "uint256", "name": "totalYesWeight", "type": "uint256" },
            { "internalType": "uint256", "name": "totalNoWeight", "type": "uint256" },
            { "internalType": "bool", "name": "ended", "type": "bool" },
            { "internalType": "bool", "name": "approved", "type": "bool" },
            { "internalType": "uint256", "name": "tokensRemaining", "type": "uint256" },
            { "internalType": "uint256", "name": "bnbBalance", "type": "uint256" }
        ], "stateMutability": "view", "type": "function"
    },
    { "inputs": [], "name": "killContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "getOpenProposals", "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }], "stateMutability": "view", "type": "function" }
];

async function abrirVotacao() {
    try {
        const txHash = await writeWeb3Contract(propostaContractAddress, "abrirVotacao", propostaABI, []);
        alert("Votação aberta! Tx: " + txHash);
    } catch (error) {
        console.error("Erro em abrirVotacao:", error);
        alert("Erro ao abrir votação.");
    }
}

async function clearPresence() {
    try {
        const txHash = await writeWeb3Contract(propostaContractAddress, "clearPresence", propostaABI, []);
        alert("Registros de presença limpos! Tx: " + txHash);
    } catch (error) {
        console.error("Erro em clearPresence:", error);
        alert("Erro ao limpar registros.");
    }
}

async function killContract() {
    if (confirm("Tem certeza que deseja executar killContract?")) {
        try {
            const txHash = await writeWeb3Contract(propostaContractAddress, "killContract", propostaABI, []);
            alert("Contrato encerrado! Tx: " + txHash);
        } catch (error) {
            console.error("Erro em killContract:", error);
            alert("Erro ao encerrar contrato.");
        }
    }
}

async function getBlocksUntilVotingEnds() {
    try {
        const blocks = await readWeb3Contract(propostaContractAddress, "getBlocksUntilVotingEnds", propostaABI, []);
        document.getElementById("blocksResult").innerHTML = "Blocos restantes: " + blocks;
    } catch (error) {
        console.error("Erro em getBlocksUntilVotingEnds:", error);
        alert("Erro ao consultar blocos.");
    }
}

async function registerPresence() {
    try {
        const txHash = await writeWeb3Contract(propostaContractAddress, "registerPresence", propostaABI, []);
        alert("Presença registrada! Tx: " + txHash);
    } catch (error) {
        console.error("Erro em registerPresence:", error);
        alert("Erro ao registrar presença.");
    }
}

async function makePropose() {
    const proposeHash = document.getElementById("proposeHash").value.trim();
    const amount = document.getElementById("amount").value.trim();
    const wallet = document.getElementById("wallet").value.trim();
    const price = document.getElementById("price").value.trim();
    try {
        const txHash = await writeWeb3Contract(propostaContractAddress, "makePropose", propostaABI, [amount, wallet, proposeHash, price]);
        alert("Proposta criada! Tx: " + txHash);
    } catch (error) {
        console.error("Erro em makePropose:", error);
        alert("Erro ao criar proposta.");
    }
}

async function doVote() {
    const proposeHash = document.getElementById("voteHash").value.trim();
    const decision = (document.getElementById("voteDecision").value.trim() === "true");
    try {
        const txHash = await writeWeb3Contract(propostaContractAddress, "doVote", propostaABI, [proposeHash, decision]);
        alert("Voto realizado! Tx: " + txHash);
    } catch (error) {
        console.error("Erro em doVote:", error);
        alert("Erro ao votar.");
    }
}

async function endVote() {
    const proposeHash = document.getElementById("endVoteHash").value.trim();
    try {
        const txHash = await writeWeb3Contract(propostaContractAddress, "endVote", propostaABI, [proposeHash]);
        alert("Votação encerrada! Tx: " + txHash);
    } catch (error) {
        console.error("Erro em endVote:", error);
        alert("Erro ao encerrar votação.");
    }
}

async function buyTokens() {
    const proposeHash = document.getElementById("buyProposeHash").value.trim();
    const to = document.getElementById("buyTo").value.trim();
    const bnbValue = document.getElementById("bnbValue").value.trim();
    const valueInWei = ethers.utils.parseEther(bnbValue);
    try {
        const txHash = await writeWeb3Contract(propostaContractAddress, "buyTokens", propostaABI, [proposeHash, to], { value: valueInWei });
        alert("Tokens comprados! Tx: " + txHash);
    } catch (error) {
        console.error("Erro em buyTokens:", error);
        alert("Erro ao comprar tokens.");
    }
}

async function withdraw() {
    const proposeHash = document.getElementById("withdrawHash").value.trim();
    try {
        const txHash = await writeWeb3Contract(propostaContractAddress, "withdraw", propostaABI, [proposeHash]);
        alert("BNB sacado! Tx: " + txHash);
    } catch (error) {
        console.error("Erro em withdraw:", error);
        alert("Erro ao sacar BNB.");
    }
}

async function getProposalDetails() {
    const proposeHash = document.getElementById("queryProposeHash").value.trim();
    try {
        const details = await readWeb3Contract(propostaContractAddress, "getProposalDetails", propostaABI, [proposeHash]);
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

async function listOpenProposals() {
    try {
        const openProposals = await readWeb3Contract(propostaContractAddress, "getOpenProposals", propostaABI, []);
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

function preencher(hash) {
    // Exemplo: Preencher os campos com o valor do hash
    document.getElementById("voteHash").value = hash;
    document.getElementById("endVoteHash").value = hash;
    document.getElementById("buyProposeHash").value = hash;
    document.getElementById("queryProposeHash").value = hash;
    getProposalDetails();
    buyTo.value = web3Account.address;
}