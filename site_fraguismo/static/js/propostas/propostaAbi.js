export const propostaABI = [
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