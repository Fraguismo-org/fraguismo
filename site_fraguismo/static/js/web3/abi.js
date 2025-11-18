export const poligonAbi = [
    {
        "inputs": [
            { "internalType": "address", "name": "_tokenAddress", "type": "address" },
            { "internalType": "bool", "name": "_isTestMode", "type": "bool" },
            { "internalType": "uint256", "name": "_blocks3Months", "type": "uint256" },
            { "internalType": "address", "name": "_nftAddress", "type": "address" },
            { "internalType": "uint256", "name": "_blocksPerHour", "type": "uint256" },
            { "internalType": "uint256", "name": "_blocksPerWeek", "type": "uint256" }
        ],
        "stateMutability": "nonpayable", "type": "constructor"
    },
    {
        "anonymous": false, "inputs": [
            { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "tokensTransferred", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "bnbTransferred", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "lastVotedBlock", "type": "uint256" }]
        , "name": "ContractReset", "type": "event"
    },
    {
        "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }]
        , "name": "OwnershipTransferred", "type": "event"
    },
    {
        "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "guardiao", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "novaPenalidade", "type": "uint256" }]
        , "name": "PenalidadeAplicada", "type": "event"
    },
    {
        "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "guardiao", "type": "address" }]
        , "name": "PenalidadeResetada", "type": "event"
    },
    {
        "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "proposer", "type": "address" },
        { "indexed": false, "internalType": "string", "name": "proposeHash", "type": "string" },
        { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }]
        , "name": "ProposalCreated", "type": "event"
    },
    {
        "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "proposeHash", "type": "string" },
        { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" },
        { "indexed": false, "internalType": "uint256", "name": "totalYesWeight", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "totalNoWeight", "type": "uint256" }]
        , "name": "ProposalEnded", "type": "event"
    },
    {
        "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "proposeHash", "type": "string" },
        { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
        { "indexed": false, "internalType": "uint256", "name": "bnbPaid", "type": "uint256" }]
        , "name": "TokensBought", "type": "event"
    },
    {
        "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "voter", "type": "address" },
        { "indexed": false, "internalType": "string", "name": "proposeHash", "type": "string" },
        { "indexed": false, "internalType": "bool", "name": "decision", "type": "bool" },
        { "indexed": false, "internalType": "uint256", "name": "weight", "type": "uint256" }]
        , "name": "Voted", "type": "event"
    },
    {
        "anonymous": false, "inputs": [{ "indexed": false, "internalType": "string", "name": "proposeHash", "type": "string" },
        { "indexed": true, "internalType": "address", "name": "proposer", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "amountBNB", "type": "uint256" }]
        , "name": "Withdrawn", "type": "event"
    },
    {
        "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "guardiao", "type": "address" }]
        , "name": "guardiaoAdicionado", "type": "event"
    },
    {
        "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "proposer", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "candidato", "type": "address" }]
        , "name": "guardiaoPropostaCriada", "type": "event"
    },
    {
        "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "candidato", "type": "address" },
        { "indexed": false, "internalType": "bool", "name": "aprovada", "type": "bool" }]
        , "name": "guardiaoPropostaEncerrada", "type": "event"
    },
    {
        "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "guardiao", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "penalidade", "type": "uint256" }]
        , "name": "guardiaoRemovido", "type": "event"
    },
    {
        "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "guardiao", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "penalidade", "type": "uint256" }]
        , "name": "guardiaoSuspenso", "type": "event"
    },
    {
        "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "voter", "type": "address" },
        { "indexed": true, "internalType": "address", "name": "candidato", "type": "address" },
        { "indexed": false, "internalType": "bool", "name": "decisao", "type": "bool" },
        { "indexed": false, "internalType": "uint256", "name": "peso", "type": "uint256" }]
        , "name": "guardiaoVotado", "type": "event"
    },
    {
        "inputs": [], "name": "DECIMALS", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    { "inputs": [], "name": "abrirVotacaoguardiao", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    {
        "inputs": [{ "internalType": "address", "name": "_guardiao", "type": "address" }]
        , "name": "adicionarguardiaoInicial", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }]
        , "name": "blockedUntil", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "blocks30Days", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "blocks3Months", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "blocksPerHour", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "blocksPerWeek", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "proposeHash", "type": "string" },
        { "internalType": "address", "name": "to", "type": "address" }]
        , "name": "buyTokens", "outputs": [], "stateMutability": "payable", "type": "function"
    },
    { "inputs": [], "name": "calcularPesos", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "clearPresence", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    {
        "inputs": [{ "internalType": "string", "name": "proposeHash", "type": "string" },
        { "internalType": "bool", "name": "decision", "type": "bool" }]
        , "name": "doVote", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }]
        , "name": "effectiveWeights", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "candidato", "type": "address" }]
        , "name": "encerrarPropostaguardiao", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "proposeHash", "type": "string" }]
        , "name": "endVote", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    { "inputs": [], "name": "fecharVotacao", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    {
        "inputs": [], "name": "getAllEffectiveWeights", "outputs": [{ "internalType": "address[]", "name": "votersArray", "type": "address[]" },
        { "internalType": "uint256[]", "name": "weightsArray", "type": "uint256[]" },
        { "internalType": "bool", "name": "calculado", "type": "bool" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "getBlocksUntilNextVoting", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "getBlocksUntilResetAvailable", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "getBlocksUntilVotingEnds", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "voter", "type": "address" }]
        , "name": "getEffectiveWeight", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "getOpenProposals", "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "proposeHash", "type": "string" }]
        , "name": "getProposalDetails", "outputs": [{ "internalType": "address", "name": "proposer", "type": "address" },
        { "internalType": "address", "name": "wallet", "type": "address" },
        { "internalType": "uint256", "name": "amount", "type": "uint256" },
        { "internalType": "uint256", "name": "price", "type": "uint256" },
        { "internalType": "uint256", "name": "totalYesWeight", "type": "uint256" },
        { "internalType": "uint256", "name": "totalNoWeight", "type": "uint256" },
        { "internalType": "bool", "name": "ended", "type": "bool" },
        { "internalType": "bool", "name": "approved", "type": "bool" },
        { "internalType": "uint256", "name": "tokensRemaining", "type": "uint256" },
        { "internalType": "uint256", "name": "bnbBalance", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "proposeHash", "type": "string" }]
        , "name": "getProposalYesVoters", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "proposeHash", "type": "string" }]
        , "name": "getProposalYesWeight", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "getQuorumInfo", "outputs": [{ "internalType": "uint256", "name": "quorumMinimo", "type": "uint256" },
        { "internalType": "uint256", "name": "totalguardioesAtivos", "type": "uint256" },
        { "internalType": "uint256", "name": "totalVotantesAtual", "type": "uint256" },
        { "internalType": "bool", "name": "quorumAtingido", "type": "bool" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "getQuorumMinimo", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "getTotalBNBInProposals", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "account", "type": "address" }]
        , "name": "getTotalTokens", "outputs": [{ "internalType": "uint256", "name": "totalTokens", "type": "uint256" },
        { "internalType": "uint256", "name": "walletTokens", "type": "uint256" },
        { "internalType": "uint256", "name": "nftTokens", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "getTotalguardioesAtivos", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "guardiao", "type": "address" }]
        , "name": "getguardiaoInfo", "outputs": [{ "internalType": "uint256", "name": "penalidade", "type": "uint256" },
        { "internalType": "bool", "name": "ativo", "type": "bool" },
        { "internalType": "bool", "name": "ehguardiao", "type": "bool" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "candidato", "type": "address" }]
        , "name": "getguardiaoProposalDetails", "outputs": [{ "internalType": "address", "name": "proposer", "type": "address" },
        { "internalType": "address", "name": "candidate", "type": "address" },
        { "internalType": "uint256", "name": "totalYesWeight", "type": "uint256" },
        { "internalType": "uint256", "name": "totalNoWeight", "type": "uint256" },
        { "internalType": "bool", "name": "ended", "type": "bool" },
        { "internalType": "bool", "name": "approved", "type": "bool" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "getguardioes", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "getguardioesAtivos", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "getguardioesCompleto", "outputs": [{ "internalType": "address[]", "name": "guardioesArray", "type": "address[]" },
        { "internalType": "uint256[]", "name": "penalidadesArray", "type": "uint256[]" },
        { "internalType": "bool[]", "name": "ativosArray", "type": "bool[]" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "getguardioesSuspensos", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }]
        , "name": "guardiaoAtivo", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "name": "guardiaoProposalList", "outputs": [{ "internalType": "address", "name": "", "type": "address" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }]
        , "name": "guardiaoProposals", "outputs": [{ "internalType": "address", "name": "proposer", "type": "address" },
        { "internalType": "address", "name": "candidate", "type": "address" },
        { "internalType": "bool", "name": "ended", "type": "bool" },
        { "internalType": "bool", "name": "approved", "type": "bool" },
        { "internalType": "uint256", "name": "totalYesWeight", "type": "uint256" },
        { "internalType": "uint256", "name": "totalNoWeight", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }]
        , "name": "indexNoArray", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "user", "type": "address" }]
        , "name": "isDirector", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "isTestMode", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "isVotingOpen", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "guardiao", "type": "address" }]
        , "name": "isguardiaoAtivo", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }]
        , "stateMutability": "view", "type": "function"
    },
    { "inputs": [], "name": "limparPesos", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    {
        "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" },
        { "internalType": "address", "name": "wallet", "type": "address" },
        { "internalType": "string", "name": "proposeHash", "type": "string" },
        { "internalType": "uint256", "name": "price", "type": "uint256" }]
        , "name": "makePropose", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [], "name": "nextVotingStartBlock", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "nftAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "nftAddressChanged", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }]
        , "name": "penalidades", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "presenceDuration", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "presenceRegistrationEndBlock", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "candidato", "type": "address" }]
        , "name": "proporNovoguardiao", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "name": "proposalList", "outputs": [{ "internalType": "string", "name": "", "type": "string" }]
        , "stateMutability": "view", "type": "function"
    },
    { "inputs": [], "name": "registerPresence", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }]
        , "name": "registeredTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    { "inputs": [], "name": "removerInativos", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    {
        "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }]
        , "name": "resetContract", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "_nftAddress", "type": "address" }]
        , "name": "setNFTAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    { "inputs": [], "name": "suspenderInativos", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    {
        "inputs": [], "name": "tokenAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "totalRegisteredTokens", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "totalVoters", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "totalguardioes", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }]
        , "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [], "name": "ultimoBlocoVotado", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "candidato", "type": "address" },
        { "internalType": "bool", "name": "decisao", "type": "bool" }]
        , "name": "votarNovoguardiao", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "name": "votersList", "outputs": [{ "internalType": "address", "name": "", "type": "address" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "votingEndBlock", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "votingStartBlock", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [], "name": "weightsCalculated", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }]
        , "stateMutability": "view", "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "proposeHash", "type": "string" }]
        , "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function"
    }]
