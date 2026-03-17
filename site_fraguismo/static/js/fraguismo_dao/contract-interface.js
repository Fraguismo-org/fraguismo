// Configuração Web3 e Contratos
let web3;
let userAccount;
let contracts = {};
let version = "1.2.9";
/**
 * Função para ler informações do contrato via API
 */
const lerContrato = async (address, functionName, abi, args) => {
    try {
        const resp = await fetch("https://movefit.fun:3014/readContract", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address, abi, functionName, args })
        });

        if (!resp.ok) {
            throw new Error(`HTTP ${resp.status} – ${resp.statusText}`);
        }

        const { result, error } = await resp.json();
        if (error) {
            throw new Error(error);
        }

        return result;
    } catch (err) {
        console.error("Erro ao ler contrato:", err);
        return null;
    }
};

/**
 * Encontra o ABI de uma função específica em um ABI array
 */
function findABIForFunction(abiArray, functionName) {
    return abiArray.find(item => item.name === functionName && item.type === 'function');
}

/**
 * Função auxiliar para ler do contrato de propostas
 */
async function lerPropostas(functionName, args = []) {
    const abi = findABIForFunction(PROPOSTAS_ABI, functionName);
    if (!abi) {
        throw new Error(`Função ${functionName} não encontrada no ABI`);
    }
    return await lerContrato(CONTRACT_ADDRESSES.propostas, functionName, [abi], args);
}

/**
 * Função auxiliar para ler do contrato de mercado
 */
async function lerMercado(functionName, args = []) {
    const abi = findABIForFunction(MERCADO_ABI, functionName);
    if (!abi) {
        throw new Error(`Função ${functionName} não encontrada no ABI`);
    }
    return await lerContrato(CONTRACT_ADDRESSES.mercado, functionName, [abi], args);
}

/**
 * Função auxiliar para ler do contrato de graça
 */
async function lerGraca(functionName, args = []) {
    const abi = findABIForFunction(GRACA_ABI, functionName);
    if (!abi) {
        throw new Error(`Função ${functionName} não encontrada no ABI`);
    }
    return await lerContrato(CONTRACT_ADDRESSES.graca, functionName, [abi], args);
}

/**
 * Função auxiliar para ler o bloco atual do contrato BlockNumber
 */
async function lerBlockNumber() {
    const abi = findABIForFunction(BLOCK_NUMBER_ABI, 'getCurrentBlock');
    if (!abi) {
        throw new Error('Função getCurrentBlock não encontrada no ABI');
    }
    const result = await lerContrato(CONTRACT_ADDRESSES.blockNumber, 'getCurrentBlock', [abi], []);
    return result ? parseInt(result) : null;
}

/**
 * Função auxiliar para escrever no contrato de propostas (não-payable)
 */
async function escreverPropostas(functionName, args = []) {
    const abi = findABIForFunction(PROPOSTAS_ABI, functionName);
    if (!abi) {
        throw new Error(`Função ${functionName} não encontrada no ABI`);
    }
    return await writeWeb3Contract(CONTRACT_ADDRESSES.propostas, functionName, [abi], args);
}

/**
 * Função auxiliar para escrever no contrato de propostas (payable)
 */
async function escreverPropostasPayable(functionName, args = [], value = null) {
    const abi = findABIForFunction(PROPOSTAS_ABI, functionName);
    if (!abi) {
        throw new Error(`Função ${functionName} não encontrada no ABI`);
    }
    return await writeWeb3Contract2(CONTRACT_ADDRESSES.propostas, functionName, [abi], args, value);
}

/**
 * Função auxiliar para escrever no contrato de mercado (não-payable)
 */
async function escreverMercado(functionName, args = []) {
    const abi = findABIForFunction(MERCADO_ABI, functionName);
    if (!abi) {
        throw new Error(`Função ${functionName} não encontrada no ABI`);
    }
    return await writeWeb3Contract(CONTRACT_ADDRESSES.mercado, functionName, [abi], args);
}

/**
 * Função auxiliar para escrever no contrato de mercado (payable)
 */
async function escreverMercadoPayable(functionName, args = [], value = null) {
    const abi = findABIForFunction(MERCADO_ABI, functionName);
    if (!abi) {
        throw new Error(`Função ${functionName} não encontrada no ABI`);
    }
    return await writeWeb3Contract2(CONTRACT_ADDRESSES.mercado, functionName, [abi], args, value);
}

/**
 * Função auxiliar para escrever no contrato de graça (não-payable)
 */
async function escreverGraca(functionName, args = []) {
    const abi = findABIForFunction(GRACA_ABI, functionName);
    if (!abi) {
        throw new Error(`Função ${functionName} não encontrada no ABI`);
    }
    return await writeWeb3Contract(CONTRACT_ADDRESSES.graca, functionName, [abi], args);
}

/**
 * Função auxiliar para ler do token do mercado
 */
async function lerTokenMercado(functionName, args = []) {
    const abi = findABIForFunction(MERCADO_TOKEN_ABI, functionName);
    if (!abi) {
        throw new Error(`Função ${functionName} não encontrada no ABI do token`);
    }
    return await lerContrato(CONTRACT_ADDRESSES.mercadoToken, functionName, [abi], args);
}

/**
 * Função auxiliar para escrever no token do mercado
 */
async function escreverTokenMercado(functionName, args = []) {
    const abi = findABIForFunction(MERCADO_TOKEN_ABI, functionName);
    if (!abi) {
        throw new Error(`Função ${functionName} não encontrada no ABI do token`);
    }
    return await writeWeb3Contract(CONTRACT_ADDRESSES.mercadoToken, functionName, [abi], args);
}

/**
 * Função auxiliar para ler do contrato PropriedadesNFT
 */
async function lerPropriedadesNFT(functionName, args = []) {
    if (!CONTRACT_ADDRESSES.propriedadesNFT || CONTRACT_ADDRESSES.propriedadesNFT === '0x0000000000000000000000000000000000000000') {
        throw new Error('Endereço do contrato PropriedadesNFT não configurado. Atualize CONTRACT_ADDRESSES.propriedadesNFT.');
    }
    const abi = findABIForFunction(PROPIEDADES_NFT_ABI, functionName);
    if (!abi) {
        throw new Error(`Função ${functionName} não encontrada no ABI do PropriedadesNFT`);
    }
    return await lerContrato(CONTRACT_ADDRESSES.propriedadesNFT, functionName, [abi], args);
}

/**
 * Função auxiliar para escrever no contrato PropriedadesNFT
 */
async function escreverPropriedadesNFT(functionName, args = []) {
    if (!CONTRACT_ADDRESSES.propriedadesNFT || CONTRACT_ADDRESSES.propriedadesNFT === '0x0000000000000000000000000000000000000000') {
        throw new Error('Endereço do contrato PropriedadesNFT não configurado. Atualize CONTRACT_ADDRESSES.propriedadesNFT.');
    }
    const abi = findABIForFunction(PROPIEDADES_NFT_ABI, functionName);
    if (!abi) {
        throw new Error(`Função ${functionName} não encontrada no ABI do PropriedadesNFT`);
    }
    return await writeWeb3Contract(CONTRACT_ADDRESSES.propriedadesNFT, functionName, [abi], args);
}

// Endereços dos contratos
const CONTRACT_ADDRESSES = {
    propostas: '0x6577D33D22AA441376626A71381012ea2c9532Aa', // Contrato Guardiões (Propostas + Guardiões)
    guardioes: '0x6577D33D22AA441376626A71381012ea2c9532Aa', // Mesmo contrato que propostas (guardioes.sol)
    propriedadesNFT: '0x3c103e63d49eD6f8d7142Cac68da12C7AC492ED3', // PropriedadesNFT.sol — ATUALIZE após deploy
    mercado: '0xcf8967BdbD0FF0C913CbfbC362884ACAe9FA6907',
    mercadoToken: '0x64A59F08dC77b764F9305d0F5624Ac2a32169F2c',
    graca: '0x7E598c2EB44c58A7F69fcC3957c4f27B6cb459D5',
    blockNumber: '0x59c28c1DEb67a31369E3C0f3511e976E133f7431'
};

// ABIs dos contratos
// Nota: O ABI completo do contrato unificado deve ser gerado após o deploy
// Este é um ABI básico - você precisará atualizar com o ABI completo do contrato deployado
const PROPOSTAS_ABI = [
    {"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"bool","name":"_isTestMode","type":"bool"},{"internalType":"uint256","name":"_seconds3Months","type":"uint256"},{"internalType":"address","name":"_nftAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"proposeHash","type":"string"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"},{"indexed":false,"internalType":"uint256","name":"totalYesWeight","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalNoWeight","type":"uint256"}],"name":"ProposalEnded","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"proposer","type":"address"},{"indexed":false,"internalType":"string","name":"proposeHash","type":"string"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"ProposalCreated","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"proposeHash","type":"string"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"bnbPaid","type":"uint256"}],"name":"TokensBought","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"string","name":"proposeHash","type":"string"},{"indexed":false,"internalType":"bool","name":"decision","type":"bool"},{"indexed":false,"internalType":"uint256","name":"weight","type":"uint256"}],"name":"Voted","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"proposeHash","type":"string"},{"indexed":true,"internalType":"address","name":"proposer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountBNB","type":"uint256"}],"name":"Withdrawn","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokensTransferred","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"bnbTransferred","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"lastVotedTimestamp","type":"uint256"}],"name":"ContractReset","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"guardiao","type":"address"}],"name":"guardiaoAdicionado","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"proposer","type":"address"},{"indexed":true,"internalType":"address","name":"candidato","type":"address"}],"name":"guardiaoPropostaCriada","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":true,"internalType":"address","name":"candidato","type":"address"},{"indexed":false,"internalType":"bool","name":"decisao","type":"bool"},{"indexed":false,"internalType":"uint256","name":"peso","type":"uint256"}],"name":"guardiaoVotado","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"candidato","type":"address"},{"indexed":false,"internalType":"bool","name":"aprovada","type":"bool"}],"name":"guardiaoPropostaEncerrada","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"guardiao","type":"address"},{"indexed":false,"internalType":"uint256","name":"novaPenalidade","type":"uint256"}],"name":"PenalidadeAplicada","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"guardiao","type":"address"}],"name":"PenalidadeResetada","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"guardiao","type":"address"},{"indexed":false,"internalType":"uint256","name":"penalidade","type":"uint256"}],"name":"guardiaoSuspenso","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"guardiao","type":"address"},{"indexed":false,"internalType":"uint256","name":"penalidade","type":"uint256"}],"name":"guardiaoRemovido","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
    {"inputs":[],"name":"abrirVotacaoguardiao","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"calcularPesos","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"limparPesos","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"weightsCalculated","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"voter","type":"address"}],"name":"getEffectiveWeight","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getAllEffectiveWeights","outputs":[{"internalType":"address[]","name":"votersArray","type":"address[]"},{"internalType":"uint256[]","name":"weightsArray","type":"uint256[]"},{"internalType":"bool","name":"calculado","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getguardioesCompleto","outputs":[{"internalType":"address[]","name":"guardioesArray","type":"address[]"},{"internalType":"uint256[]","name":"penalidadesArray","type":"uint256[]"},{"internalType":"bool[]","name":"ativosArray","type":"bool[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"SECONDS_30_DAYS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"SECONDS_PER_HOUR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"SECONDS_PER_WEEK","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"blockedUntil","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"string","name":"proposeHash","type":"string"},{"internalType":"address","name":"to","type":"address"}],"name":"buyTokens","outputs":[],"stateMutability":"payable","type":"function"},
    {"inputs":[],"name":"clearPresence","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"_guardiao","type":"address"}],"name":"adicionarguardiaoInicial","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"getguardioes","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"isDirector","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"totalguardioes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"candidato","type":"address"}],"name":"proporNovoguardiao","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"candidato","type":"address"},{"internalType":"bool","name":"decisao","type":"bool"}],"name":"votarNovoguardiao","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"candidato","type":"address"}],"name":"encerrarPropostaguardiao","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"candidato","type":"address"}],"name":"getguardiaoProposalDetails","outputs":[{"internalType":"address","name":"proposer","type":"address"},{"internalType":"address","name":"candidate","type":"address"},{"internalType":"uint256","name":"totalYesWeight","type":"uint256"},{"internalType":"uint256","name":"totalNoWeight","type":"uint256"},{"internalType":"bool","name":"ended","type":"bool"},{"internalType":"bool","name":"approved","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"guardiaoProposals","outputs":[{"internalType":"address","name":"proposer","type":"address"},{"internalType":"address","name":"candidate","type":"address"},{"internalType":"bool","name":"ended","type":"bool"},{"internalType":"bool","name":"approved","type":"bool"},{"internalType":"uint256","name":"totalYesWeight","type":"uint256"},{"internalType":"uint256","name":"totalNoWeight","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"guardiaoProposalList","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"suspenderInativos","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"removerInativos","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"guardiao","type":"address"}],"name":"getguardiaoInfo","outputs":[{"internalType":"uint256","name":"penalidade","type":"uint256"},{"internalType":"bool","name":"ativo","type":"bool"},{"internalType":"bool","name":"ehguardiao","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getguardioesAtivos","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getguardioesSuspensos","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getQuorumInfo","outputs":[{"internalType":"uint256","name":"quorumMinimo","type":"uint256"},{"internalType":"uint256","name":"totalguardioesAtivos","type":"uint256"},{"internalType":"uint256","name":"totalVotantesAtual","type":"uint256"},{"internalType":"bool","name":"quorumAtingido","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getQuorumMinimo","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getTotalguardioesAtivos","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"guardiao","type":"address"}],"name":"isguardiaoAtivo","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"penalidades","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"guardiaoAtivo","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getTotalTokens","outputs":[{"internalType":"uint256","name":"totalTokens","type":"uint256"},{"internalType":"uint256","name":"walletTokens","type":"uint256"},{"internalType":"uint256","name":"nftTokens","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"_nftAddress","type":"address"}],"name":"setNFTAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"nftAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"nftAddressChanged","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"recipient","type":"address"}],"name":"resetContract","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"getSecondsUntilResetAvailable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getTotalBNBInProposals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"ultimoTimestampVotado","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"seconds3Months","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"string","name":"proposeHash","type":"string"},{"internalType":"bool","name":"decision","type":"bool"}],"name":"doVote","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"proposeHash","type":"string"}],"name":"endVote","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"fecharVotacao","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"getSecondsUntilNextVoting","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getSecondsUntilVotingEnds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getOpenProposals","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"string","name":"proposeHash","type":"string"}],"name":"getProposalDetails","outputs":[{"internalType":"address","name":"proposer","type":"address"},{"internalType":"address","name":"wallet","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"uint256","name":"totalYesWeight","type":"uint256"},{"internalType":"uint256","name":"totalNoWeight","type":"uint256"},{"internalType":"bool","name":"ended","type":"bool"},{"internalType":"bool","name":"approved","type":"bool"},{"internalType":"uint256","name":"tokensRemaining","type":"uint256"},{"internalType":"uint256","name":"bnbBalance","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"string","name":"proposeHash","type":"string"}],"name":"getProposalYesVoters","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"string","name":"proposeHash","type":"string"}],"name":"getProposalYesWeight","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"isVotingOpen","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"killContract","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"},{"internalType":"string","name":"proposeHash","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"}],"name":"makePropose","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"nextVotingStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"presenceDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"presenceRegistrationEndTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposalList","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"registerPresence","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"registeredTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"totalRegisteredTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"totalVoters","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"votersList","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"votingEndTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"votingStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"string","name":"proposeHash","type":"string"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}
];

const MERCADO_ABI = [
    {"inputs":[{"internalType":"contract IERC20","name":"_token","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"address","name":"comprador","type":"address"},{"indexed":false,"internalType":"uint256","name":"garantia","type":"uint256"}],"name":"NegociacaoIniciada","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"address","name":"vendedor","type":"address"},{"indexed":false,"internalType":"uint256","name":"quantidade","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"valorBRL","type":"uint256"}],"name":"NovaOrdem","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"OrdemCompleta","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"OrdemConfirmadaPeloArbitro","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"OrdemDisputada","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"OrdemRevertida","type":"event"},
    {"inputs":[],"name":"arbitro","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"arbitroConfirmaPagamento","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"arbitroReverteTransacao","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"abrirDisputa","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"quantidade","type":"uint256"},{"internalType":"uint256","name":"valorEmBRL","type":"uint256"}],"name":"criarOrdem","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"vendedor","type":"address"}],"name":"getOrdensDoVendedor","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getTodasOrdens","outputs":[{"internalType":"address[]","name":"vendedores","type":"address[]"},{"internalType":"uint256[]","name":"quantidades","type":"uint256[]"},{"internalType":"uint256[]","name":"valores","type":"uint256[]"},{"internalType":"address[]","name":"compradores","type":"address[]"},{"internalType":"uint256[]","name":"garantias","type":"uint256[]"},{"internalType":"uint256[]","name":"blocos","type":"uint256[]"},{"internalType":"enum VendaComGarantia.Status[]","name":"statusList","type":"uint8[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"iniciarNegociacao","outputs":[],"stateMutability":"payable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"marcarComoCompleta","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"ordemCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"ordens","outputs":[{"internalType":"address","name":"vendedor","type":"address"},{"internalType":"uint256","name":"quantidade","type":"uint256"},{"internalType":"uint256","name":"valorEmBRL","type":"uint256"},{"internalType":"address","name":"comprador","type":"address"},{"internalType":"uint256","name":"garantia","type":"uint256"},{"internalType":"uint256","name":"blocoInicial","type":"uint256"},{"internalType":"enum VendaComGarantia.Status","name":"status","type":"uint8"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ordensPorVendedor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"taxaMultiplicadora","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"}
];

const MERCADO_TOKEN_ABI = [
    {"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}
];

// ABI do contrato BlockNumber
const BLOCK_NUMBER_ABI = [
    {
        "inputs": [],
        "name": "getCurrentBlock",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// ABI do contrato PropriedadesNFT (propriedadesNFT.sol) — compatível com votação e guardiões
const PROPIEDADES_NFT_ABI = [
    {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getTotalTokensByOwner","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"transferNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"simularPesos","outputs":[{"internalType":"address[]","name":"guardioesArray","type":"address[]"},{"internalType":"uint256[]","name":"tokensReaisArray","type":"uint256[]"},{"internalType":"uint256[]","name":"tokensVirtuaisArray","type":"uint256[]"},{"internalType":"uint256[]","name":"tokensTotaisArray","type":"uint256[]"},{"internalType":"uint256[]","name":"pesosSimuladosArray","type":"uint256[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"calcularPesos","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"limparPesos","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"proposalHash","type":"string"},{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"address","name":"destinatario","type":"address"}],"name":"criarPropostaCriacaoNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"proposalHash","type":"string"},{"internalType":"bool","name":"decisao","type":"bool"}],"name":"votarCriacaoNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"proposalHash","type":"string"}],"name":"encerrarPropostaCriacaoNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"criarPropostaDestruicaoNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bool","name":"decisao","type":"bool"}],"name":"votarDestruicaoNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"encerrarPropostaDestruicaoNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"proposalHash","type":"string"}],"name":"mintNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"mintNFTTeste","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getNFT","outputs":[{"internalType":"address","name":"minter","type":"address"},{"internalType":"address","name":"currentOwnerAddr","type":"address"},{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getAllTokenIds","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"ownerAddr","type":"address"}],"name":"getNFTsByOwner","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"string","name":"proposalHash","type":"string"}],"name":"getCriacaoProposalDetails","outputs":[{"internalType":"address","name":"proposer","type":"address"},{"internalType":"string","name":"metadata","type":"string"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"},{"internalType":"address","name":"destinatario","type":"address"},{"internalType":"bool","name":"ended","type":"bool"},{"internalType":"bool","name":"approved","type":"bool"},{"internalType":"bool","name":"minted","type":"bool"},{"internalType":"uint256","name":"totalYesWeight","type":"uint256"},{"internalType":"uint256","name":"totalNoWeight","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getDestruicaoProposalDetails","outputs":[{"internalType":"address","name":"proposer","type":"address"},{"internalType":"bool","name":"ended","type":"bool"},{"internalType":"bool","name":"approved","type":"bool"},{"internalType":"uint256","name":"totalYesWeight","type":"uint256"},{"internalType":"uint256","name":"totalNoWeight","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getPropostasCriacaoAbertas","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getPropostasDestruicaoAbertas","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getAllNFTsInfo","outputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"address[]","name":"minters","type":"address[]"},{"internalType":"address[]","name":"owners","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"uint256[]","name":"ultimasAtividades","type":"uint256[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"guardioesAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"modoTeste","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"virtualTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"nextTokenId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"weightsCalculated","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"CARTEIRA_MAE","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"TEMPO_INATIVIDADE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"TEMPO_INATIVIDADE_TESTE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getTempoInatividade","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"lastActivity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"registrarAtividade","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"recuperarNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getAtividadeNFT","outputs":[{"internalType":"address","name":"proprietario","type":"address"},{"internalType":"uint256","name":"ultimaAtividade","type":"uint256"},{"internalType":"uint256","name":"tempoInativo","type":"uint256"},{"internalType":"bool","name":"recuperavel","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getNFTsRecuperaveis","outputs":[{"internalType":"uint256[]","name":"idsRecuperaveis","type":"uint256[]"},{"internalType":"address[]","name":"proprietarios","type":"address[]"},{"internalType":"uint256[]","name":"temposInativos","type":"uint256[]"}],"stateMutability":"view","type":"function"}
];

const GRACA_ABI = [
    {"inputs":[{"internalType":"address","name":"_carteira_de_gastos","type":"address"},{"internalType":"address","name":"_tokenFragaAddress","type":"address"},{"internalType":"address","name":"_tokenUSDTAddress","type":"address"},{"internalType":"address","name":"_diretoriaAddress","type":"address"},{"internalType":"uint256","name":"_periodoTranca","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"votante","type":"address"},{"indexed":false,"internalType":"uint256","name":"pesoTokens","type":"uint256"}],"name":"RegistroPresenca","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"quantidade","type":"uint256"}],"name":"TokensDestrancados","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"quantidade","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"blocoFinal","type":"uint256"}],"name":"TokensTrancados","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"totalDistribuido","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"paraGastos","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"paraStakers","type":"uint256"}],"name":"USDTDistribuido","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"aprovada","type":"bool"},{"indexed":false,"internalType":"uint256","name":"novaPorcentagem","type":"uint256"}],"name":"VotacaoFinalizada","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"blocoInicio","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"blocoFimPresenca","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"blocoFimVotacao","type":"uint256"}],"name":"VotacaoIniciada","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"votante","type":"address"},{"indexed":false,"internalType":"bool","name":"decisao","type":"bool"},{"indexed":false,"internalType":"uint256","name":"peso","type":"uint256"}],"name":"Voto","type":"event"},
    {"inputs":[],"name":"carteira_de_gastos","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"destrancarTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"diretoriaAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"distribuir","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"finalizarVotacao","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"getPorcentagens","outputs":[{"internalType":"uint256","name":"graca","type":"uint256"},{"internalType":"uint256","name":"gastos","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getSaldoUSDT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"_staker","type":"address"}],"name":"getStakeInfo","outputs":[{"internalType":"uint256","name":"quantidade","type":"uint256"},{"internalType":"uint256","name":"blocoFinal","type":"uint256"},{"internalType":"bool","name":"ativo","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getStakersAtivos","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getVotacaoInfo","outputs":[{"internalType":"bool","name":"aberta","type":"bool"},{"internalType":"uint256","name":"novaPorcentagem","type":"uint256"},{"internalType":"uint256","name":"pesoVotosSim","type":"uint256"},{"internalType":"uint256","name":"pesoVotosNao","type":"uint256"},{"internalType":"bool","name":"finalizada","type":"bool"},{"internalType":"bool","name":"aprovada","type":"bool"},{"internalType":"uint256","name":"blocosRestantes","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_novaPorcentagem","type":"uint256"}],"name":"iniciarVotacao","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"_endereco","type":"address"}],"name":"isDiretor","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"periodoTranca","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"porcentagemGraca","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"presencaEndBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"propostaAtual","outputs":[{"internalType":"uint256","name":"novaPorcentagem","type":"uint256"},{"internalType":"uint256","name":"pesoVotosSim","type":"uint256"},{"internalType":"uint256","name":"pesoVotosNao","type":"uint256"},{"internalType":"bool","name":"finalizada","type":"bool"},{"internalType":"bool","name":"aprovada","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"registrarPresenca","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"registrosTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"_novaCarteira","type":"address"}],"name":"setCarteiraGastos","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"stakes","outputs":[{"internalType":"uint256","name":"quantidade","type":"uint256"},{"internalType":"uint256","name":"blocoFinal","type":"uint256"},{"internalType":"bool","name":"ativo","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"stakersAtivos","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"tokenFragaAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"tokenUSDTAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"totalRegistrosTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"totalTokensTrancados","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"totalVotantes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_quantidade","type":"uint256"}],"name":"trancarTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"bool","name":"_decisao","type":"bool"}],"name":"votar","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"votacaoAberta","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"votacaoEndBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"votacaoStartBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"votantesList","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}
];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    checkMetaMask();
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
});

// Verifica se MetaMask está instalado
function checkMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        // Verifica se já está conectado
        ethereum.request({ method: 'eth_accounts' }).then(accounts => {
            if (accounts.length > 0) {
                userAccount = accounts[0];
                updateWalletUI();
                initContracts();
            }
        });
    } else {
        alert('MetaMask não encontrado! Por favor, instale a extensão MetaMask.');
    }
}

// Conecta a carteira
async function connectWallet() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        updateWalletUI();
        initContracts();
        showAlert('Carteira conectada com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao conectar:', error);
        showAlert('Erro ao conectar a carteira: ' + error.message, 'error');
    }
}

// Atualiza UI da carteira
function updateWalletUI() {
    document.getElementById('connectWallet').style.display = 'none';
    document.getElementById('walletAddress').style.display = 'block';
    document.getElementById('walletAddress').textContent = 
        `${userAccount.substring(0, 6)}...${userAccount.substring(38)}`;
}

// Inicializa contratos
function initContracts() {
    contracts.propostas = new web3.eth.Contract(PROPOSTAS_ABI, CONTRACT_ADDRESSES.propostas);
    contracts.mercado = new web3.eth.Contract(MERCADO_ABI, CONTRACT_ADDRESSES.mercado);
    contracts.graca = new web3.eth.Contract(GRACA_ABI, CONTRACT_ADDRESSES.graca);
    const nftAddr = CONTRACT_ADDRESSES.propriedadesNFT;
    if (nftAddr && nftAddr !== '0x0000000000000000000000000000000000000000') {
        contracts.propriedadesNFT = new web3.eth.Contract(PROPIEDADES_NFT_ABI, nftAddr);
    }
    // Inicia os contadores após inicializar os contratos
    setTimeout(() => {
        if (contracts.propostas && web3) {
            startVotingCounters();
        }
    }, 1000);
}

// Funções de UI
function openModal(modalId) {
    if (!userAccount) {
        showAlert('Por favor, conecte sua carteira primeiro!', 'error');
        return;
    }
    document.getElementById(modalId).style.display = 'block';
    if (modalId === 'mercadoModal' && typeof mercado !== 'undefined' && mercado.initPainel) {
        mercado.initPainel();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function switchTab(contract, tab) {
    const tabs = document.querySelectorAll(`#${contract}Modal .tab`);
    const contents = document.querySelectorAll(`#${contract}Modal .tab-content`);
    
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`${contract}-${tab}`).classList.add('active');

    if (contract === 'mercado' && typeof mercado !== 'undefined') {
        if (tab === 'read' && mercado.refreshPainel) {
            mercado.refreshPainel(false);
        }
        if (tab === 'write' && mercado.refreshTokenInfo) {
            mercado.refreshTokenInfo();
        }
    }
}

function switchGuardiaoTab(subtab) {
    // Remove a classe active de todas as subtabs (botões)
    const subtabs = document.querySelectorAll('#propostas-guardioes .tabs .tab');
    subtabs.forEach(t => t.classList.remove('active'));
    
    // Remove a classe active de todos os conteúdos das subtabs
    const contents = document.querySelectorAll('#propostas-guardioes .guardiao-subtab');
    contents.forEach(c => c.classList.remove('active'));
    
    // Adiciona a classe active ao botão clicado
    event.target.classList.add('active');
    
    // Adiciona a classe active ao conteúdo correspondente
    document.getElementById(`guardioes-${subtab}`).classList.add('active');
}

function switchNftTab(subtab) {
    const container = document.getElementById('propostas-nft');
    if (!container) return;
    const tabs = container.querySelectorAll('.tabs .tab');
    const contents = container.querySelectorAll('.nft-subtab');
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => { c.style.display = 'none'; });
    const tabMap = { consultas: 0, criacao: 1, destruicao: 2, prova: 3, acoes: 4 };
    const idx = tabMap[subtab];
    if (idx !== undefined && tabs[idx]) tabs[idx].classList.add('active');
    const content = document.getElementById(`nft-${subtab}`);
    if (content) content.style.display = 'block';
}

function showResult(elementId, data, isError = false) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Elemento de resultado não encontrado: ${elementId}`);
        return;
    }
    element.classList.add('show');
    element.innerHTML = `
        <h5>${isError ? '❌ Erro' : '✅ Resultado'}</h5>
        <pre>${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}</pre>
    `;
}

function showAlert(message, type) {
    // Criar alert temporário
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '10000';
    alert.style.minWidth = '300px';
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// ============================================
// FUNÇÕES DO CONTRATO PROPOSTAS (UNIFICADO)
// ============================================
const propostas = {
    async getOwner() {
        try {
            const owner = await lerPropostas('owner');
            showResult('result-propostas-owner', { owner: owner });
        } catch (error) {
            showResult('result-propostas-owner', error.message, true);
        }
    },

    async getVotingStatus() {
        try {
            const isOpen = await lerPropostas('isVotingOpen');
            const startTime = await lerPropostas('votingStartTime');
            const endTime = await lerPropostas('votingEndTime');
            const nextTime = await lerPropostas('nextVotingStartTime');
            
            showResult('result-propostas-status', {
                votacaoAberta: isOpen,
                timestampInicio: startTime,
                timestampFim: endTime,
                proximaVotacao: nextTime,
                dataInicio: new Date(parseInt(startTime) * 1000).toLocaleString(),
                dataFim: new Date(parseInt(endTime) * 1000).toLocaleString(),
                dataProxima: new Date(parseInt(nextTime) * 1000).toLocaleString()
            });
        } catch (error) {
            showResult('result-propostas-status', error.message, true);
        }
    },

    async getSecondsUntilVotingEnds() {
        try {
            const result = await lerPropostas('getSecondsUntilVotingEnds');
            const seconds = parseInt(result);
            showResult('result-propostas-blocksEnd', { 
                segundosRestantes: seconds,
                tempoRestante: formatSeconds(seconds)
            });
        } catch (error) {
            showResult('result-propostas-blocksEnd', error.message, true);
        }
    },

    async getSecondsUntilNextVoting() {
        try {
            const result = await lerPropostas('getSecondsUntilNextVoting');
            const seconds = parseInt(result);
            showResult('result-propostas-blocksNext', { 
                segundosRestantes: seconds,
                tempoRestante: formatSeconds(seconds)
            });
        } catch (error) {
            showResult('result-propostas-blocksNext', error.message, true);
        }
    },

    async getOpenProposals() {
        try {
            const result = await lerPropostas('getOpenProposals');
            showResult('result-propostas-open', { propostasAbertas: result });
        } catch (error) {
            showResult('result-propostas-open', error.message, true);
        }
    },

    async getProposalDetails() {
        try {
            const hash = document.getElementById('propostas-details-hash').value;
            const result = await lerPropostas('getProposalDetails', [hash]);
            showResult('result-propostas-details', {
                propositor: result[0],
                carteira: result[1],
                quantidade: result[2],
                preco: result[3],
                votosSimPeso: result[4],
                votosNaoPeso: result[5],
                encerrada: result[6],
                aprovada: result[7],
                tokensRestantes: result[8],
                saldoBNB: result[9]
            });
        } catch (error) {
            showResult('result-propostas-details', error.message, true);
        }
    },

    async getProposalYesVoters() {
        try {
            const hash = document.getElementById('propostas-yesVoters-hash').value;
            const result = await lerPropostas('getProposalYesVoters', [hash]);
            showResult('result-propostas-yesVoters', { votantesSim: result });
        } catch (error) {
            showResult('result-propostas-yesVoters', error.message, true);
        }
    },

    async makePropose() {
        try {
            const amount = document.getElementById('propostas-make-amount').value;
            const wallet = document.getElementById('propostas-make-wallet').value;
            const hash = document.getElementById('propostas-make-hash').value;
            const price = document.getElementById('propostas-make-price').value;
            
            await escreverPropostas('makePropose', [amount, wallet, hash, price]);
            showResult('result-propostas-make', 'Proposta criada com sucesso!');
        } catch (error) {
            showResult('result-propostas-make', error.message, true);
        }
    },

    async abrirVotacaoguardiao() {
        try {
            await escreverPropostas('abrirVotacaoguardiao');
            showResult('result-propostas-abrir-guardiao', 'Votação aberta com sucesso pelo guardião!');
        } catch (error) {
            showResult('result-propostas-abrir-guardiao', error.message, true);
        }
    },

    async registerPresence() {
        try {
            await escreverPropostas('registerPresence');
            showResult('result-propostas-presence', 'Presença registrada com sucesso!');
        } catch (error) {
            showResult('result-propostas-presence', error.message, true);
        }
    },

    async doVote() {
        try {
            const hash = document.getElementById('propostas-vote-hash').value;
            const decision = document.getElementById('propostas-vote-decision').value === 'true';
            await escreverPropostas('doVote', [hash, decision]);
            showResult('result-propostas-vote', 'Voto registrado com sucesso!');
        } catch (error) {
            showResult('result-propostas-vote', error.message, true);
        }
    },

    async endVote() {
        try {
            const hash = document.getElementById('propostas-end-hash').value;
            await escreverPropostas('endVote', [hash]);
            showResult('result-propostas-end', 'Votação encerrada com sucesso!');
        } catch (error) {
            showResult('result-propostas-end', error.message, true);
        }
    },

    async buyTokens() {
        try {
            const hash = document.getElementById('propostas-buy-hash').value;
            const to = document.getElementById('propostas-buy-to').value;
            const value = document.getElementById('propostas-buy-value').value;
            
            await escreverPropostasPayable('buyTokens', [hash, to], value);
            showResult('result-propostas-buy', 'Tokens comprados com sucesso!');
        } catch (error) {
            showResult('result-propostas-buy', error.message, true);
        }
    },

    async withdraw() {
        try {
            const hash = document.getElementById('propostas-withdraw-hash').value;
            await escreverPropostas('withdraw', [hash]);
            showResult('result-propostas-withdraw', 'Saque realizado com sucesso!');
        } catch (error) {
            showResult('result-propostas-withdraw', error.message, true);
        }
    },

    async fecharVotacao() {
        try {
            await escreverPropostas('fecharVotacao');
            showResult('result-propostas-fechar', 'Votação fechada com sucesso!');
        } catch (error) {
            showResult('result-propostas-fechar', error.message, true);
        }
    },

    async clearPresence() {
        try {
            await escreverPropostas('clearPresence');
            showResult('result-propostas-clearPresence', 'Presença limpa com sucesso!');
        } catch (error) {
            showResult('result-propostas-clearPresence', error.message, true);
        }
    },

    // ============================================
    // FUNÇÕES DE GUARDIÕES (UNIFICADAS)
    // ============================================

    async getguardioes() {
        try {
            const result = await lerPropostas('getguardioes');
            showResult('result-propostas-getguardioes', { guardioes: result });
        } catch (error) {
            showResult('result-propostas-getguardioes', error.message, true);
        }
    },

    async isguardiao() {
        try {
            const address = document.getElementById('propostas-isguardiao-address').value;
            const result = await lerPropostas('isDirector', [address]);
            showResult('result-propostas-isguardiao', { isguardiao: result });
        } catch (error) {
            showResult('result-propostas-isguardiao', error.message, true);
        }
    },

    async totalguardioes() {
        try {
            const result = await lerPropostas('totalguardioes');
            showResult('result-propostas-totalguardioes', { total: result });
        } catch (error) {
            showResult('result-propostas-totalguardioes', error.message, true);
        }
    },

    async adicionarguardiaoInicial() {
        try {
            const address = document.getElementById('propostas-addguardiao-address').value;
            await escreverPropostas('adicionarguardiaoInicial', [address]);
            showResult('result-propostas-addguardiao', 'Guardião adicionado com sucesso!');
        } catch (error) {
            showResult('result-propostas-addguardiao', error.message, true);
        }
    },

    async proporNovoguardiao() {
        try {
            const candidato = document.getElementById('propostas-propor-candidato').value;
            await escreverPropostas('proporNovoguardiao', [candidato]);
            showResult('result-propostas-propor', 'Proposta criada com sucesso!');
        } catch (error) {
            showResult('result-propostas-propor', error.message, true);
        }
    },

    async votarNovoguardiao() {
        try {
            const candidato = document.getElementById('propostas-votar-guardiao-candidato').value;
            const decisao = document.getElementById('propostas-votar-guardiao-decisao').value === 'true';
            await escreverPropostas('votarNovoguardiao', [candidato, decisao]);
            showResult('result-propostas-votar-guardiao', 'Voto registrado com sucesso!');
        } catch (error) {
            showResult('result-propostas-votar-guardiao', error.message, true);
        }
    },

    async encerrarPropostaguardiao() {
        try {
            const candidato = document.getElementById('propostas-encerrar-guardiao-candidato').value;
            await escreverPropostas('encerrarPropostaguardiao', [candidato]);
            showResult('result-propostas-encerrar-guardiao', 'Proposta encerrada com sucesso!');
        } catch (error) {
            showResult('result-propostas-encerrar-guardiao', error.message, true);
        }
    },

    async getguardiaoProposalDetails() {
        try {
            const candidato = document.getElementById('propostas-guardiao-details-candidato').value;
            const result = await lerPropostas('getguardiaoProposalDetails', [candidato]);
            showResult('result-propostas-guardiao-details', {
                propositor: result[0],
                candidato: result[1],
                votosSimPeso: result[2],
                votosNaoPeso: result[3],
                encerrada: result[4],
                aprovada: result[5]
            });
        } catch (error) {
            showResult('result-propostas-guardiao-details', error.message, true);
        }
    },

    async getguardiaoInfo() {
        try {
            const address = document.getElementById('propostas-guardiao-info-address').value;
            const result = await lerPropostas('getguardiaoInfo', [address]);
            showResult('result-propostas-guardiao-info', {
                penalidade: result[0],
                ativo: result[1],
                ehguardiao: result[2]
            });
        } catch (error) {
            showResult('result-propostas-guardiao-info', error.message, true);
        }
    },

    async getguardioesAtivos() {
        try {
            const result = await lerPropostas('getguardioesAtivos');
            showResult('result-propostas-guardioes-ativos', { guardioesAtivos: result });
        } catch (error) {
            showResult('result-propostas-guardioes-ativos', error.message, true);
        }
    },

    async getguardioesSuspensos() {
        try {
            const result = await lerPropostas('getguardioesSuspensos');
            showResult('result-propostas-guardioes-suspensos', { guardioesSuspensos: result });
        } catch (error) {
            showResult('result-propostas-guardioes-suspensos', error.message, true);
        }
    },

    async getQuorumInfo() {
        try {
            const result = await lerPropostas('getQuorumInfo');
            showResult('result-propostas-quorum-info', {
                quorumMinimo: result[0],
                totalguardioesAtivos: result[1],
                totalVotantesAtual: result[2],
                quorumAtingido: result[3]
            });
        } catch (error) {
            showResult('result-propostas-quorum-info', error.message, true);
        }
    },

    async suspenderInativos() {
        try {
            await escreverPropostas('suspenderInativos');
            showResult('result-propostas-suspender', 'Guardiões inativos suspensos com sucesso!');
        } catch (error) {
            showResult('result-propostas-suspender', error.message, true);
        }
    },

    async removerInativos() {
        try {
            await escreverPropostas('removerInativos');
            showResult('result-propostas-remover', 'Guardiões inativos removidos com sucesso!');
        } catch (error) {
            showResult('result-propostas-remover', error.message, true);
        }
    },

    async transferOwnership() {
        try {
            const newOwner = document.getElementById('propostas-transfer-owner').value;
            if (!newOwner) {
                showResult('result-propostas-transfer-owner', 'Por favor, informe o endereço do novo owner.', true);
                return;
            }
            await escreverPropostas('transferOwnership', [newOwner]);
            showResult('result-propostas-transfer-owner', 'Ownership transferido com sucesso!');
        } catch (error) {
            showResult('result-propostas-transfer-owner', error.message, true);
        }
    },

    async calcularPesos() {
        try {
            await escreverPropostas('calcularPesos');
            showResult('result-propostas-calcularPesos', 'Pesos calculados com sucesso!');
        } catch (error) {
            showResult('result-propostas-calcularPesos', error.message, true);
        }
    }
};

// ============================================
// FUNÇÕES DO CONTRATO PROPRIEDADES NFT
// ============================================
const propriedadesNFT = {
    async getNFT() {
        try {
            const tokenId = document.getElementById('nft-get-tokenId').value;
            const result = await lerPropriedadesNFT('getNFT', [tokenId]);
            showResult('result-nft-get', {
                minter: result[0],
                currentOwner: result[1],
                metadata: result[2],
                tokenAmount: result[3],
                exists: result[4]
            });
        } catch (error) {
            showResult('result-nft-get', error.message, true);
        }
    },
    async getAllTokenIds() {
        try {
            const result = await lerPropriedadesNFT('getAllTokenIds');
            showResult('result-nft-all-ids', { tokenIds: result });
        } catch (error) {
            showResult('result-nft-all-ids', error.message, true);
        }
    },
    async getNFTsByOwner() {
        try {
            const owner = document.getElementById('nft-owner-address').value;
            const result = await lerPropriedadesNFT('getNFTsByOwner', [owner]);
            showResult('result-nft-by-owner', { tokenIds: result });
        } catch (error) {
            showResult('result-nft-by-owner', error.message, true);
        }
    },
    async getCriacaoProposalDetails() {
        try {
            const hash = document.getElementById('nft-criacao-hash').value;
            const result = await lerPropriedadesNFT('getCriacaoProposalDetails', [hash]);
            showResult('result-nft-criacao-details', {
                proposer: result[0],
                metadata: result[1],
                tokenAmount: result[2],
                destinatario: result[3],
                ended: result[4],
                approved: result[5],
                minted: result[6],
                totalYesWeight: result[7],
                totalNoWeight: result[8]
            });
        } catch (error) {
            showResult('result-nft-criacao-details', error.message, true);
        }
    },
    async getDestruicaoProposalDetails() {
        try {
            const tokenId = document.getElementById('nft-destruicao-tokenId').value;
            const result = await lerPropriedadesNFT('getDestruicaoProposalDetails', [tokenId]);
            showResult('result-nft-destruicao-details', {
                proposer: result[0],
                ended: result[1],
                approved: result[2],
                totalYesWeight: result[3],
                totalNoWeight: result[4]
            });
        } catch (error) {
            showResult('result-nft-destruicao-details', error.message, true);
        }
    },
    async getPropostasCriacaoAbertas() {
        try {
            const result = await lerPropriedadesNFT('getPropostasCriacaoAbertas');
            showResult('result-nft-criacao-abertas', { propostasAbertas: result });
        } catch (error) {
            showResult('result-nft-criacao-abertas', error.message, true);
        }
    },
    async getPropostasDestruicaoAbertas() {
        try {
            const result = await lerPropriedadesNFT('getPropostasDestruicaoAbertas');
            showResult('result-nft-destruicao-abertas', { propostasAbertas: result });
        } catch (error) {
            showResult('result-nft-destruicao-abertas', error.message, true);
        }
    },
    async getAllNFTsInfo() {
        try {
            const result = await lerPropriedadesNFT('getAllNFTsInfo');
            showResult('result-nft-all-info', {
                ids: result[0],
                minters: result[1],
                owners: result[2],
                amounts: result[3],
                ultimasAtividades: result[4]
            });
        } catch (error) {
            showResult('result-nft-all-info', error.message, true);
        }
    },
    async getTempoInatividade() {
        try {
            const result = await lerPropriedadesNFT('getTempoInatividade');
            const segundos = parseInt(result);
            const dias = Math.floor(segundos / 86400);
            showResult('result-nft-tempo-inatividade', {
                segundos,
                dias,
                descricao: dias >= 1 ? `${dias} dias` : `${Math.floor(segundos / 60)} minutos (modo teste)`
            });
        } catch (error) {
            showResult('result-nft-tempo-inatividade', error.message, true);
        }
    },
    async getAtividadeNFT() {
        try {
            const tokenId = document.getElementById('nft-atividade-tokenId').value;
            const result = await lerPropriedadesNFT('getAtividadeNFT', [tokenId]);
            showResult('result-nft-atividade', {
                proprietario: result[0],
                ultimaAtividade: result[1],
                ultimaAtividadeData: result[1] ? new Date(parseInt(result[1]) * 1000).toLocaleString() : '-',
                tempoInativoSegundos: result[2],
                tempoInativoDias: Math.floor(parseInt(result[2]) / 86400),
                recuperavel: result[3]
            });
        } catch (error) {
            showResult('result-nft-atividade', error.message, true);
        }
    },
    async getNFTsRecuperaveis() {
        try {
            const result = await lerPropriedadesNFT('getNFTsRecuperaveis');
            const ids = result[0];
            const proprietarios = result[1];
            const tempos = result[2];
            const list = ids.map((id, i) => ({
                tokenId: id,
                proprietario: proprietarios[i],
                tempoInativoSegundos: tempos[i],
                tempoInativoDias: Math.floor(parseInt(tempos[i]) / 86400)
            }));
            showResult('result-nft-recuperaveis', { total: ids.length, nftsRecuperaveis: list });
        } catch (error) {
            showResult('result-nft-recuperaveis', error.message, true);
        }
    },
    async registrarAtividade() {
        try {
            await escreverPropriedadesNFT('registrarAtividade', []);
            showResult('result-nft-registrar-atividade', 'Prova de vida registrada para todos os seus NFTs!');
        } catch (error) {
            showResult('result-nft-registrar-atividade', error.message, true);
        }
    },
    async recuperarNFT() {
        try {
            const tokenId = document.getElementById('nft-recuperar-tokenId').value;
            await escreverPropriedadesNFT('recuperarNFT', [tokenId]);
            showResult('result-nft-recuperar', 'NFT recuperado: transferido para a carteira mãe.');
        } catch (error) {
            showResult('result-nft-recuperar', error.message, true);
        }
    },
    async simularPesos() {
        try {
            const result = await lerPropriedadesNFT('simularPesos');
            showResult('result-nft-simular-pesos', {
                guardioes: result[0],
                tokensReais: result[1],
                tokensVirtuais: result[2],
                tokensTotais: result[3],
                pesosSimulados: result[4]
            });
        } catch (error) {
            showResult('result-nft-simular-pesos', error.message, true);
        }
    },
    async criarPropostaCriacaoNFT() {
        try {
            const proposalHash = document.getElementById('nft-criar-proposal-hash').value;
            const metadata = document.getElementById('nft-criar-metadata').value;
            const tokenAmount = document.getElementById('nft-criar-tokenAmount').value;
            const destinatario = document.getElementById('nft-criar-destinatario').value || '0x0000000000000000000000000000000000000000';
            await escreverPropriedadesNFT('criarPropostaCriacaoNFT', [proposalHash, metadata, tokenAmount, destinatario]);
            showResult('result-nft-criar-proposta', 'Proposta de criação criada com sucesso!');
        } catch (error) {
            showResult('result-nft-criar-proposta', error.message, true);
        }
    },
    async votarCriacaoNFT() {
        try {
            const hash = document.getElementById('nft-votar-criacao-hash').value;
            const decisao = document.getElementById('nft-votar-criacao-decisao').value === 'true';
            await escreverPropriedadesNFT('votarCriacaoNFT', [hash, decisao]);
            showResult('result-nft-votar-criacao', 'Voto registrado com sucesso!');
        } catch (error) {
            showResult('result-nft-votar-criacao', error.message, true);
        }
    },
    async encerrarPropostaCriacaoNFT() {
        try {
            const hash = document.getElementById('nft-encerrar-criacao-hash').value;
            await escreverPropriedadesNFT('encerrarPropostaCriacaoNFT', [hash]);
            showResult('result-nft-encerrar-criacao', 'Proposta de criação encerrada!');
        } catch (error) {
            showResult('result-nft-encerrar-criacao', error.message, true);
        }
    },
    async mintNFT() {
        try {
            const hash = document.getElementById('nft-mint-hash').value;
            await escreverPropriedadesNFT('mintNFT', [hash]);
            showResult('result-nft-mint', 'NFT mintado com sucesso!');
        } catch (error) {
            showResult('result-nft-mint', error.message, true);
        }
    },
    async criarPropostaDestruicaoNFT() {
        try {
            const tokenId = document.getElementById('nft-criar-destruicao-tokenId').value;
            await escreverPropriedadesNFT('criarPropostaDestruicaoNFT', [tokenId]);
            showResult('result-nft-criar-destruicao', 'Proposta de destruição criada com sucesso!');
        } catch (error) {
            showResult('result-nft-criar-destruicao', error.message, true);
        }
    },
    async votarDestruicaoNFT() {
        try {
            const tokenId = document.getElementById('nft-votar-destruicao-tokenId').value;
            const decisao = document.getElementById('nft-votar-destruicao-decisao').value === 'true';
            await escreverPropriedadesNFT('votarDestruicaoNFT', [tokenId, decisao]);
            showResult('result-nft-votar-destruicao', 'Voto registrado com sucesso!');
        } catch (error) {
            showResult('result-nft-votar-destruicao', error.message, true);
        }
    },
    async encerrarPropostaDestruicaoNFT() {
        try {
            const tokenId = document.getElementById('nft-encerrar-destruicao-tokenId').value;
            await escreverPropriedadesNFT('encerrarPropostaDestruicaoNFT', [tokenId]);
            showResult('result-nft-encerrar-destruicao', 'Proposta de destruição encerrada!');
        } catch (error) {
            showResult('result-nft-encerrar-destruicao', error.message, true);
        }
    },
    async transferNFT() {
        try {
            const tokenId = document.getElementById('nft-transfer-tokenId').value;
            const to = document.getElementById('nft-transfer-to').value;
            await escreverPropriedadesNFT('transferNFT', [tokenId, to]);
            showResult('result-nft-transfer', 'NFT transferido com sucesso!');
        } catch (error) {
            showResult('result-nft-transfer', error.message, true);
        }
    },
    async calcularPesos() {
        try {
            await escreverPropriedadesNFT('calcularPesos');
            showResult('result-nft-calcular-pesos', 'Pesos calculados no contrato NFT com sucesso!');
        } catch (error) {
            showResult('result-nft-calcular-pesos', error.message, true);
        }
    },
    async limparPesos() {
        try {
            await escreverPropriedadesNFT('limparPesos');
            showResult('result-nft-limpar-pesos', 'Pesos limpos no contrato NFT com sucesso!');
        } catch (error) {
            showResult('result-nft-limpar-pesos', error.message, true);
        }
    }
};

// ============================================
// FUNÇÕES DO CONTRATO MERCADO
// ============================================
const MERCADO_STATUS_LABELS = ['Pendente', 'Em negociação', 'Completa', 'Disputada', 'Revertida'];
const MERCADO_STATUS_OPEN = new Set([0, 1, 3]);
const MERCADO_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const mercadoState = {
    tokenAddress: CONTRACT_ADDRESSES.mercadoToken,
    tokenSymbol: 'TOKEN',
    tokenDecimals: 18,
    arbitro: null,
    currentBlock: null,
    ordens: []
};

function marketIsZeroAddress(address) {
    return !address || address.toLowerCase() === MERCADO_ZERO_ADDRESS;
}

function marketAddressEquals(a, b) {
    return !!a && !!b && a.toLowerCase() === b.toLowerCase();
}

function marketShortAddress(address) {
    if (!address || marketIsZeroAddress(address)) {
        return '-';
    }
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

function marketToBigInt(value) {
    if (typeof value === 'bigint') {
        return value;
    }
    if (value === null || value === undefined) {
        return 0n;
    }
    if (typeof value === 'object' && typeof value.toString === 'function') {
        value = value.toString();
    }
    const normalized = String(value).trim();
    if (!normalized) {
        return 0n;
    }
    return BigInt(normalized);
}

function marketFormatUnits(value, decimals = 18, fractionDigits = 4) {
    const raw = marketToBigInt(value);
    const divisor = 10n ** BigInt(decimals);
    const whole = raw / divisor;
    const fraction = raw % divisor;
    if (fraction === 0n) {
        return whole.toString();
    }

    let fractionText = fraction.toString().padStart(decimals, '0');
    fractionText = fractionText.slice(0, fractionDigits).replace(/0+$/, '');
    return fractionText ? `${whole.toString()}.${fractionText}` : whole.toString();
}

function marketParseDecimalToUnits(input, decimals = 18) {
    const normalized = String(input || '').trim().replace(',', '.');
    if (!/^\d+(\.\d+)?$/.test(normalized)) {
        throw new Error('Informe um número válido (ex: 1000.5).');
    }

    const [wholePart, fractionPart = ''] = normalized.split('.');
    if (fractionPart.length > decimals) {
        throw new Error(`Máximo de ${decimals} casas decimais para este token.`);
    }

    const units = `${wholePart}${fractionPart.padEnd(decimals, '0')}`.replace(/^0+(?=\d)/, '');
    return units || '0';
}

function marketParseIntegerToBigInt(input, fieldLabel = 'valor') {
    const normalized = String(input || '').trim();
    if (!/^\d+$/.test(normalized)) {
        throw new Error(`Informe ${fieldLabel} como número inteiro positivo.`);
    }
    return BigInt(normalized);
}

function marketFormatBRL(value) {
    const numberValue = Number(String(value));
    if (Number.isFinite(numberValue)) {
        return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return `R$ ${value}`;
}

function marketStatusLabel(status) {
    return MERCADO_STATUS_LABELS[status] || `Status ${status}`;
}

function marketNormalizeStatus(statusValue) {
    const normalized = Number(statusValue);
    return Number.isInteger(normalized) ? normalized : 0;
}

function marketExtractOrderFields(result) {
    return {
        vendedores: result.vendedores || result[0] || [],
        quantidades: result.quantidades || result[1] || [],
        valores: result.valores || result[2] || [],
        compradores: result.compradores || result[3] || [],
        garantias: result.garantias || result[4] || [],
        blocos: result.blocos || result[5] || [],
        statusList: result.statusList || result[6] || []
    };
}

const mercado = {
    async initPainel() {
        try {
            await this.syncMercadoMeta();
            await Promise.all([
                this.refreshTokenInfo(),
                this.refreshPainel(false)
            ]);
        } catch (error) {
            showResult('result-mercado-dashboard', error.message, true);
        }
    },

    async syncMercadoMeta() {
        try {
            const tokenOnChain = await lerMercado('token');
            if (tokenOnChain && tokenOnChain.startsWith('0x')) {
                CONTRACT_ADDRESSES.mercadoToken = tokenOnChain;
                mercadoState.tokenAddress = tokenOnChain;
            }
        } catch (error) {
            console.warn('Não foi possível consultar token() do mercado:', error);
        }

        try {
            const arbitro = await lerMercado('arbitro');
            mercadoState.arbitro = arbitro;
        } catch (error) {
            console.warn('Não foi possível consultar árbitro:', error);
        }

        try {
            const symbol = await lerTokenMercado('symbol');
            if (symbol) {
                mercadoState.tokenSymbol = symbol;
            }
        } catch (error) {
            console.warn('Não foi possível consultar símbolo do token:', error);
        }

        try {
            const decimals = await lerTokenMercado('decimals');
            const parsed = Number(decimals);
            if (Number.isInteger(parsed) && parsed >= 0) {
                mercadoState.tokenDecimals = parsed;
            }
        } catch (error) {
            console.warn('Não foi possível consultar decimals do token:', error);
        }

        const contractEl = document.getElementById('mercado-contract-address');
        const tokenEl = document.getElementById('mercado-token-address');
        const arbitroEl = document.getElementById('mercado-arbitro-address');
        const userEl = document.getElementById('mercado-user-address');
        const symbolEl = document.getElementById('mercado-token-symbol');

        if (contractEl) contractEl.textContent = CONTRACT_ADDRESSES.mercado;
        if (tokenEl) tokenEl.textContent = mercadoState.tokenAddress;
        if (arbitroEl) arbitroEl.textContent = mercadoState.arbitro || '-';
        if (userEl) userEl.textContent = userAccount || '-';
        if (symbolEl) symbolEl.textContent = mercadoState.tokenSymbol;
    },

    async fetchOrdens() {
        const result = await lerMercado('getTodasOrdens');
        const campos = marketExtractOrderFields(result);
        const ordens = [];

        for (let i = 0; i < campos.vendedores.length; i++) {
            ordens.push({
                id: i,
                vendedor: campos.vendedores[i],
                quantidade: campos.quantidades[i],
                valorBRL: campos.valores[i],
                comprador: campos.compradores[i],
                garantia: campos.garantias[i],
                blocoInicial: campos.blocos[i],
                status: marketNormalizeStatus(campos.statusList[i])
            });
        }

        return ordens;
    },

    getFilteredOrdens() {
        const statusFilter = document.getElementById('mercado-filter-status')?.value || 'all';
        const vendedorFilter = (document.getElementById('mercado-filter-vendedor')?.value || '').trim().toLowerCase();
        const openOnly = !!document.getElementById('mercado-filter-open-only')?.checked;

        return mercadoState.ordens.filter((ordem) => {
            const statusOk = statusFilter === 'all' || String(ordem.status) === statusFilter;
            const vendedorOk = !vendedorFilter || (ordem.vendedor || '').toLowerCase() === vendedorFilter;
            const openOk = !openOnly || MERCADO_STATUS_OPEN.has(ordem.status);
            return statusOk && vendedorOk && openOk;
        });
    },

    renderResumo() {
        const counts = { total: 0, pendente: 0, negociacao: 0, disputada: 0, abertas: 0 };

        mercadoState.ordens.forEach((ordem) => {
            counts.total += 1;
            if (ordem.status === 0) counts.pendente += 1;
            if (ordem.status === 1) counts.negociacao += 1;
            if (ordem.status === 3) counts.disputada += 1;
            if (MERCADO_STATUS_OPEN.has(ordem.status)) counts.abertas += 1;
        });

        const totalEl = document.getElementById('mercado-summary-total');
        const pendenteEl = document.getElementById('mercado-summary-pendente');
        const negociacaoEl = document.getElementById('mercado-summary-negociacao');
        const disputadaEl = document.getElementById('mercado-summary-disputada');
        const abertasEl = document.getElementById('mercado-summary-abertas');

        if (totalEl) totalEl.textContent = counts.total;
        if (pendenteEl) pendenteEl.textContent = counts.pendente;
        if (negociacaoEl) negociacaoEl.textContent = counts.negociacao;
        if (disputadaEl) disputadaEl.textContent = counts.disputada;
        if (abertasEl) abertasEl.textContent = counts.abertas;
    },

    renderOrdensTabela() {
        const board = document.getElementById('mercado-orders-board');
        if (!board) {
            return;
        }

        const ordens = this.getFilteredOrdens();
        if (!ordens.length) {
            board.innerHTML = '<div class="mercado-empty">Nenhuma ordem encontrada com os filtros atuais.</div>';
            return;
        }

        const rows = ordens.map((ordem) => {
            const isVendedor = marketAddressEquals(ordem.vendedor, userAccount);
            const isArbitro = marketAddressEquals(mercadoState.arbitro, userAccount);
            const disputaDisponivel = ordem.status === 1
                && isVendedor
                && mercadoState.currentBlock !== null
                && (Number(mercadoState.currentBlock) - Number(ordem.blocoInicial) >= 300);
            const blocosRestantesDisputa = ordem.status === 1 && isVendedor
                ? Math.max(0, (Number(ordem.blocoInicial) + 300) - Number(mercadoState.currentBlock || 0))
                : 0;

            let actionButtons = `<button class="btn btn-small" onclick="mercado.preencherAcaoId(${ordem.id})">Usar ID</button>`;

            if (ordem.status === 0) {
                actionButtons += `
                    <input type="text" id="mercado-garantia-${ordem.id}" placeholder="Garantia POL">
                    <button class="btn btn-small" onclick="mercado.iniciarNegociacaoDaTabela(${ordem.id})">Iniciar</button>
                `;
            }

            if (ordem.status === 1 && isVendedor) {
                actionButtons += `
                    <button class="btn btn-small" onclick="mercado.marcarComoCompletaById(${ordem.id}, 'result-mercado-dashboard')">Completar</button>
                    <button class="btn btn-small" onclick="mercado.abrirDisputaById(${ordem.id}, 'result-mercado-dashboard')" ${disputaDisponivel ? '' : 'disabled'}>Disputar</button>
                `;
            }

            if (ordem.status === 3 && isArbitro) {
                actionButtons += `
                    <button class="btn btn-small" onclick="mercado.arbitroConfirmaPagamentoById(${ordem.id}, 'result-mercado-dashboard')">Confirmar</button>
                    <button class="btn btn-small" onclick="mercado.arbitroReverteTransacaoById(${ordem.id}, 'result-mercado-dashboard')">Reverter</button>
                `;
            }

            const disputaHint = (ordem.status === 1 && isVendedor && !disputaDisponivel)
                ? `<div class="mercado-note">Disputa em ${blocosRestantesDisputa} blocos.</div>`
                : '';

            return `
                <tr>
                    <td>#${ordem.id}</td>
                    <td><span class="mercado-status-badge mercado-status-${ordem.status}">${marketStatusLabel(ordem.status)}</span></td>
                    <td><span class="mercado-address-short">${marketShortAddress(ordem.vendedor)}</span></td>
                    <td><span class="mercado-address-short">${marketShortAddress(ordem.comprador)}</span></td>
                    <td>${marketFormatUnits(ordem.quantidade, mercadoState.tokenDecimals)} ${mercadoState.tokenSymbol}</td>
                    <td>${marketFormatBRL(ordem.valorBRL)}</td>
                    <td>${marketFormatUnits(ordem.garantia, 18)} POL</td>
                    <td>${ordem.blocoInicial}</td>
                    <td>
                        <div class="mercado-row-actions">${actionButtons}</div>
                        ${disputaHint}
                    </td>
                </tr>
            `;
        }).join('');

        board.innerHTML = `
            <div class="mercado-orders-scroll">
                <table class="mercado-orders-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Status</th>
                            <th>Vendedor</th>
                            <th>Comprador</th>
                            <th>Quantidade</th>
                            <th>Valor BRL</th>
                            <th>Garantia</th>
                            <th>Bloco Inicial</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    },

    preencherAcaoId(id) {
        const idEl = document.getElementById('mercado-action-id');
        if (idEl) {
            idEl.value = id;
        }
    },

    onFilterChanged() {
        this.renderOrdensTabela();
    },

    async refreshPainel(showMessage = false) {
        try {
            await this.syncMercadoMeta();
            const [ordens, currentBlock] = await Promise.all([
                this.fetchOrdens(),
                web3.eth.getBlockNumber()
            ]);

            mercadoState.ordens = ordens;
            mercadoState.currentBlock = Number(currentBlock);

            this.renderResumo();
            this.renderOrdensTabela();

            if (showMessage) {
                showResult('result-mercado-dashboard', {
                    atualizadoEm: new Date().toLocaleString('pt-BR'),
                    totalOrdens: ordens.length,
                    blocoAtual: mercadoState.currentBlock
                });
            }
        } catch (error) {
            showResult('result-mercado-dashboard', error.message, true);
        }
    },

    async refreshTokenInfo() {
        if (!userAccount) {
            return;
        }

        try {
            const [balance, allowance] = await Promise.all([
                lerTokenMercado('balanceOf', [userAccount]),
                lerTokenMercado('allowance', [userAccount, CONTRACT_ADDRESSES.mercado])
            ]);

            const balanceEl = document.getElementById('mercado-token-balance');
            const allowanceEl = document.getElementById('mercado-token-allowance');
            const symbolEl = document.getElementById('mercado-token-symbol');
            const tokenEl = document.getElementById('mercado-token-address');

            if (balanceEl) balanceEl.textContent = `${marketFormatUnits(balance, mercadoState.tokenDecimals)} ${mercadoState.tokenSymbol}`;
            if (allowanceEl) allowanceEl.textContent = `${marketFormatUnits(allowance, mercadoState.tokenDecimals)} ${mercadoState.tokenSymbol}`;
            if (symbolEl) symbolEl.textContent = mercadoState.tokenSymbol;
            if (tokenEl) tokenEl.textContent = mercadoState.tokenAddress;
        } catch (error) {
            showResult('result-mercado-aprovar', error.message, true);
        }
    },

    async aprovarTokens() {
        try {
            await this.syncMercadoMeta();
            const quantidadeHumana = document.getElementById('mercado-aprovar-quantidade').value;
            const quantidadeBase = BigInt(
                marketParseDecimalToUnits(quantidadeHumana, mercadoState.tokenDecimals)
            );

            await escreverTokenMercado('approve', [CONTRACT_ADDRESSES.mercado, quantidadeBase]);
            showResult('result-mercado-aprovar', {
                mensagem: 'Aprovação enviada com sucesso.',
                quantidadeDigitada: `${quantidadeHumana} ${mercadoState.tokenSymbol}`,
                unidadesEnviadas: quantidadeBase.toString(),
                casasDecimaisToken: mercadoState.tokenDecimals
            });

            await this.refreshTokenInfo();
        } catch (error) {
            showResult('result-mercado-aprovar', error.message, true);
        }
    },

    async getOrdemCount() {
        try {
            const result = await lerMercado('ordemCount');
            showResult('result-mercado-count', { totalOrdens: result });
        } catch (error) {
            showResult('result-mercado-count', error.message, true);
        }
    },

    async getOrdem() {
        try {
            const id = document.getElementById('mercado-ordem-id').value;
            const result = await lerMercado('ordens', [id]);
            const vendedor = result.vendedor || result[0];
            const quantidade = result.quantidade || result[1];
            const valorBRL = result.valorEmBRL || result[2];
            const comprador = result.comprador || result[3];
            const garantia = result.garantia || result[4];
            const blocoInicial = result.blocoInicial || result[5];
            const status = marketNormalizeStatus(result.status !== undefined ? result.status : result[6]);
            showResult('result-mercado-ordem', {
                vendedor,
                quantidade,
                valorBRL,
                comprador,
                garantia,
                blocoInicial,
                status: marketStatusLabel(status)
            });
        } catch (error) {
            showResult('result-mercado-ordem', error.message, true);
        }
    },

    async getTodasOrdens() {
        try {
            const ordens = await this.fetchOrdens();
            showResult('result-mercado-todas', { ordens });
        } catch (error) {
            showResult('result-mercado-todas', error.message, true);
        }
    },

    async getOrdensDoVendedor() {
        try {
            const address = document.getElementById('mercado-vendedor-address').value;
            const result = await lerMercado('getOrdensDoVendedor', [address]);
            showResult('result-mercado-vendedor', { idsOrdens: result });
        } catch (error) {
            showResult('result-mercado-vendedor', error.message, true);
        }
    },

    async getArbitro() {
        try {
            const result = await lerMercado('arbitro');
            showResult('result-mercado-arbitro', { arbitro: result });
        } catch (error) {
            showResult('result-mercado-arbitro', error.message, true);
        }
    },

    async criarOrdem() {
        try {
            await this.syncMercadoMeta();
            const quantidadeHumana = document.getElementById('mercado-criar-quantidade').value;
            const valor = document.getElementById('mercado-criar-valor').value;

            const valorBrl = marketParseIntegerToBigInt(valor, 'o valor em BRL');
            if (valorBrl <= 0n) {
                throw new Error('Informe um valor em BRL maior que zero.');
            }

            const quantidadeBase = BigInt(
                marketParseDecimalToUnits(quantidadeHumana, mercadoState.tokenDecimals)
            );
            await escreverMercado('criarOrdem', [quantidadeBase, valorBrl]);

            showResult('result-mercado-criar', {
                mensagem: 'Ordem criada com sucesso.',
                quantidade: `${quantidadeHumana} ${mercadoState.tokenSymbol}`,
                quantidadeUnidadesBase: quantidadeBase.toString(),
                casasDecimaisToken: mercadoState.tokenDecimals,
                valorBRL: valorBrl.toString()
            });
            await this.refreshPainel(false);
            await this.refreshTokenInfo();
        } catch (error) {
            showResult('result-mercado-criar', error.message, true);
        }
    },

    async iniciarNegociacaoById(id, garantiaPol, resultElementId = 'result-mercado-actions') {
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId < 0) {
            throw new Error('ID da ordem inválido.');
        }
        if (!garantiaPol || Number(garantiaPol) <= 0) {
            throw new Error('Informe a garantia em POL.');
        }

        await escreverMercadoPayable('iniciarNegociacao', [parsedId], garantiaPol);
        showResult(resultElementId, `Negociação iniciada na ordem #${parsedId}.`);
        await this.refreshPainel(false);
    },

    async iniciarNegociacaoDaTabela(id) {
        try {
            const garantia = document.getElementById(`mercado-garantia-${id}`)?.value;
            await this.iniciarNegociacaoById(id, garantia, 'result-mercado-dashboard');
        } catch (error) {
            showResult('result-mercado-dashboard', error.message, true);
        }
    },

    async iniciarNegociacao() {
        try {
            const id = document.getElementById('mercado-action-id').value;
            const garantia = document.getElementById('mercado-action-garantia').value;
            await this.iniciarNegociacaoById(id, garantia);
        } catch (error) {
            showResult('result-mercado-actions', error.message, true);
        }
    },

    async marcarComoCompletaById(id, resultElementId = 'result-mercado-actions') {
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId < 0) {
            throw new Error('ID da ordem inválido.');
        }
        await escreverMercado('marcarComoCompleta', [parsedId]);
        showResult(resultElementId, `Ordem #${parsedId} marcada como completa.`);
        await this.refreshPainel(false);
    },

    async marcarComoCompleta() {
        try {
            const id = document.getElementById('mercado-action-id').value;
            await this.marcarComoCompletaById(id);
        } catch (error) {
            showResult('result-mercado-actions', error.message, true);
        }
    },

    async abrirDisputaById(id, resultElementId = 'result-mercado-actions') {
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId < 0) {
            throw new Error('ID da ordem inválido.');
        }
        await escreverMercado('abrirDisputa', [parsedId]);
        showResult(resultElementId, `Disputa aberta para a ordem #${parsedId}.`);
        await this.refreshPainel(false);
    },

    async abrirDisputa() {
        try {
            const id = document.getElementById('mercado-action-id').value;
            await this.abrirDisputaById(id);
        } catch (error) {
            showResult('result-mercado-actions', error.message, true);
        }
    },

    async arbitroConfirmaPagamentoById(id, resultElementId = 'result-mercado-actions') {
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId < 0) {
            throw new Error('ID da ordem inválido.');
        }
        await escreverMercado('arbitroConfirmaPagamento', [parsedId]);
        showResult(resultElementId, `Árbitro confirmou pagamento da ordem #${parsedId}.`);
        await this.refreshPainel(false);
    },

    async arbitroConfirmaPagamento() {
        try {
            const id = document.getElementById('mercado-action-id').value;
            await this.arbitroConfirmaPagamentoById(id);
        } catch (error) {
            showResult('result-mercado-actions', error.message, true);
        }
    },

    async arbitroReverteTransacaoById(id, resultElementId = 'result-mercado-actions') {
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId < 0) {
            throw new Error('ID da ordem inválido.');
        }
        await escreverMercado('arbitroReverteTransacao', [parsedId]);
        showResult(resultElementId, `Árbitro reverteu a ordem #${parsedId}.`);
        await this.refreshPainel(false);
    },

    async arbitroReverteTransacao() {
        try {
            const id = document.getElementById('mercado-action-id').value;
            await this.arbitroReverteTransacaoById(id);
        } catch (error) {
            showResult('result-mercado-actions', error.message, true);
        }
    }
};

// ============================================
// FUNÇÕES DO CONTRATO GRAÇA
// ============================================
const graca = {
    async getPorcentagens() {
        try {
            const result = await lerGraca('getPorcentagens');
            showResult('result-graca-porcentagens', {
                porcentagemGraca: result[0] + '%',
                porcentagemGastos: result[1] + '%'
            });
        } catch (error) {
            showResult('result-graca-porcentagens', error.message, true);
        }
    },

    async getSaldoUSDT() {
        try {
            const result = await lerGraca('getSaldoUSDT');
            showResult('result-graca-saldo', { saldoUSDT: result });
        } catch (error) {
            showResult('result-graca-saldo', error.message, true);
        }
    },

    async getTotalTokensTrancados() {
        try {
            const result = await lerGraca('totalTokensTrancados');
            showResult('result-graca-total', { totalTrancado: result });
        } catch (error) {
            showResult('result-graca-total', error.message, true);
        }
    },

    async getStakeInfo() {
        try {
            const address = document.getElementById('graca-stake-address').value;
            const result = await lerGraca('getStakeInfo', [address]);
            showResult('result-graca-stake', {
                quantidade: result[0],
                blocoFinal: result[1],
                ativo: result[2]
            });
        } catch (error) {
            showResult('result-graca-stake', error.message, true);
        }
    },

    async getStakersAtivos() {
        try {
            const result = await lerGraca('getStakersAtivos');
            showResult('result-graca-stakers', { stakersAtivos: result });
        } catch (error) {
            showResult('result-graca-stakers', error.message, true);
        }
    },

    async getVotacaoInfo() {
        try {
            const result = await lerGraca('getVotacaoInfo');
            showResult('result-graca-votacao', {
                votacaoAberta: result[0],
                novaPorcentagem: result[1],
                pesoVotosSim: result[2],
                pesoVotosNao: result[3],
                finalizada: result[4],
                aprovada: result[5],
                blocosRestantes: result[6]
            });
        } catch (error) {
            showResult('result-graca-votacao', error.message, true);
        }
    },

    async isguardiao() {
        try {
            const address = document.getElementById('graca-guardiao-address').value;
            const result = await lerGraca('isDiretor', [address]);
            showResult('result-graca-guardiao', { isguardiao: result });
        } catch (error) {
            showResult('result-graca-guardiao', error.message, true);
        }
    },

    async trancarTokens() {
        try {
            const quantidade = document.getElementById('graca-trancar-quantidade').value;
            await escreverGraca('trancarTokens', [quantidade]);
            showResult('result-graca-trancar', 'Tokens trancados com sucesso!');
        } catch (error) {
            showResult('result-graca-trancar', error.message, true);
        }
    },

    async destrancarTokens() {
        try {
            await escreverGraca('destrancarTokens');
            showResult('result-graca-destrancar', 'Tokens destrancados com sucesso!');
        } catch (error) {
            showResult('result-graca-destrancar', error.message, true);
        }
    },

    async distribuir() {
        try {
            await escreverGraca('distribuir');
            showResult('result-graca-distribuir', 'Distribuição realizada com sucesso!');
        } catch (error) {
            showResult('result-graca-distribuir', error.message, true);
        }
    },

    async iniciarVotacao() {
        try {
            const porcentagem = document.getElementById('graca-iniciar-porcentagem').value;
            await escreverGraca('iniciarVotacao', [porcentagem]);
            showResult('result-graca-iniciar', 'Votação iniciada com sucesso!');
        } catch (error) {
            showResult('result-graca-iniciar', error.message, true);
        }
    },

    async registrarPresenca() {
        try {
            await escreverGraca('registrarPresenca');
            showResult('result-graca-presenca', 'Presença registrada com sucesso!');
        } catch (error) {
            showResult('result-graca-presenca', error.message, true);
        }
    },

    async votar() {
        try {
            const decisao = document.getElementById('graca-votar-decisao').value === 'true';
            await escreverGraca('votar', [decisao]);
            showResult('result-graca-votar', 'Voto registrado com sucesso!');
        } catch (error) {
            showResult('result-graca-votar', error.message, true);
        }
    },

    async finalizarVotacao() {
        try {
            await escreverGraca('finalizarVotacao');
            showResult('result-graca-finalizar', 'Votação finalizada com sucesso!');
        } catch (error) {
            showResult('result-graca-finalizar', error.message, true);
        }
    },

    async setCarteiraGastos() {
        try {
            const address = document.getElementById('graca-carteira-address').value;
            await escreverGraca('setCarteiraGastos', [address]);
            showResult('result-graca-carteira', 'Carteira alterada com sucesso!');
        } catch (error) {
            showResult('result-graca-carteira', error.message, true);
        }
    }
};

// Fecha modal ao clicar fora
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// ============================================
// CONTADORES REGRESSIVOS DE VOTAÇÃO
// ============================================

/**
 * Converte segundos em objeto de tempo (dias, horas, minutos, segundos)
 */
function secondsToTime(totalSeconds) {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return { days, hours, minutes, seconds, totalSeconds };
}

/**
 * Formata segundos em string legível
 */
function formatSeconds(seconds) {
    if (seconds <= 0) {
        return 'Encerrado';
    }
    
    const timeObj = secondsToTime(seconds);
    const parts = [];
    if (timeObj.days > 0) parts.push(`${timeObj.days}d`);
    if (timeObj.hours > 0) parts.push(`${timeObj.hours}h`);
    if (timeObj.minutes > 0) parts.push(`${timeObj.minutes}m`);
    parts.push(`${timeObj.seconds}s`);
    
    return parts.join(' ');
}

/**
 * Formata o tempo em string legível (mantido para compatibilidade)
 */
function formatTime(timeObj) {
    if (timeObj.totalSeconds <= 0) {
        return 'Encerrado';
    }
    
    const parts = [];
    if (timeObj.days > 0) parts.push(`${timeObj.days}d`);
    if (timeObj.hours > 0) parts.push(`${timeObj.hours}h`);
    if (timeObj.minutes > 0) parts.push(`${timeObj.minutes}m`);
    parts.push(`${timeObj.seconds}s`);
    
    return parts.join(' ');
}

// Armazena os segundos restantes para cada contador
let nextVotingSeconds = 0;
let presenceSeconds = 0;
let votingSeconds = 0;
let resetSeconds = 0;

/**
 * Atualiza um contador regressivo
 */
function updateCounter(elementId, seconds) {
    const timeObj = secondsToTime(seconds);
    const formatted = formatTime(timeObj);
    document.getElementById(elementId).textContent = formatted;
    
    // Armazena os segundos para atualização em tempo real
    if (elementId === 'nextVotingTime') {
        nextVotingSeconds = seconds;
    } else if (elementId === 'presenceTime') {
        presenceSeconds = seconds;
    } else if (elementId === 'votingTime') {
        votingSeconds = seconds;
    } else if (elementId === 'resetTime') {
        resetSeconds = seconds;
    }
}

/**
 * Atualiza o contador de reset do contrato
 */
function updateResetCounter(seconds) {
    const resetCounter = document.getElementById('resetCounter');
    const resetTime = document.getElementById('resetTime');
    const resetStatus = document.getElementById('resetStatus');
    
    resetCounter.style.display = 'block';
    
    // Atualiza o contador
    updateCounter('resetTime', seconds);
    
    // Atualiza o status
    if (seconds <= 0) {
        resetStatus.textContent = '✅ Reset disponível (3 meses sem votação)';
        resetStatus.style.color = '#28a745';
    } else {
        resetStatus.textContent = '⏳ Aguardando 3 meses de inatividade';
        resetStatus.style.color = '#ff9800';
    }
}

/**
 * Atualiza os contadores regressivos em tempo real (a cada segundo)
 */
let realtimeUpdateInterval = null;

function startRealtimeCounters() {
    if (realtimeUpdateInterval) {
        clearInterval(realtimeUpdateInterval);
    }
    
    realtimeUpdateInterval = setInterval(() => {
        // Atualiza contador de próxima votação
        if (nextVotingSeconds > 0) {
            nextVotingSeconds = Math.max(0, nextVotingSeconds - 1);
            updateCounter('nextVotingTime', Math.floor(nextVotingSeconds));
        }
        
        // Atualiza contador de presença (se visível)
        const presenceCounter = document.getElementById('presenceCounter');
        if (presenceCounter.style.display !== 'none' && presenceSeconds > 0) {
            presenceSeconds = Math.max(0, presenceSeconds - 1);
            updateCounter('presenceTime', Math.floor(presenceSeconds));
            if (presenceSeconds <= 0) {
                presenceCounter.style.display = 'none';
            }
        }
        
        // Atualiza contador de votação (se visível)
        const votingCounter = document.getElementById('votingCounter');
        if (votingCounter.style.display !== 'none' && votingSeconds > 0) {
            votingSeconds = Math.max(0, votingSeconds - 1);
            updateCounter('votingTime', Math.floor(votingSeconds));
            if (votingSeconds <= 0) {
                votingCounter.style.display = 'none';
            }
        }
        
        // Atualiza contador de reset
        if (resetSeconds >= 0) {
            resetSeconds = Math.max(0, resetSeconds - 1);
            updateCounter('resetTime', Math.floor(resetSeconds));
            const resetStatus = document.getElementById('resetStatus');
            if (resetSeconds <= 0) {
                resetStatus.textContent = '✅ Reset disponível (3 meses sem votação)';
                resetStatus.style.color = '#28a745';
            } else {
                resetStatus.textContent = '⏳ Aguardando 3 meses de inatividade';
                resetStatus.style.color = '#ff9800';
            }
        }
    }, 1000); // Atualiza a cada segundo
}

function stopRealtimeCounters() {
    if (realtimeUpdateInterval) {
        clearInterval(realtimeUpdateInterval);
        realtimeUpdateInterval = null;
    }
}

/**
 * Atualiza a barra de progresso do quorum
 */
function updateQuorumCounter(votantesAtual, totalguardioesAtivos, quorumMinimo, quorumAtingido) {
    const quorumCounter = document.getElementById('quorumCounter');
    const quorumText = document.getElementById('quorumText');
    const quorumBar = document.getElementById('quorumBar');
    const quorumStatus = document.getElementById('quorumStatus');
    
    // Mostra o contador apenas se houver guardiões ativos
    if (totalguardioesAtivos > 0) {
        quorumCounter.style.display = 'block';
        
        // Atualiza o texto (ex: 6/10)
        quorumText.textContent = `${votantesAtual}/${totalguardioesAtivos}`;
        
        // Calcula a porcentagem baseada no quorum mínimo (100% = quorum atingido)
        // Se o quorum mínimo for 0, usa o total de guardiões como base
        let percentage = 0;
        if (quorumMinimo > 0) {
            percentage = Math.min(100, (votantesAtual / quorumMinimo) * 100);
        } else if (totalguardioesAtivos > 0) {
            percentage = Math.min(100, (votantesAtual / totalguardioesAtivos) * 100);
        }
        
        // Atualiza a barra de progresso
        quorumBar.style.width = `${percentage}%`;
        
        // Define a cor da barra baseada no quorum
        if (quorumAtingido) {
            quorumBar.style.backgroundColor = '#28a745'; // Verde
            quorumStatus.textContent = `✅ Quorum atingido (mín: ${quorumMinimo})`;
            quorumStatus.style.color = '#28a745';
        } else {
            quorumBar.style.backgroundColor = '#dc3545'; // Vermelho
            quorumStatus.textContent = `❌ Quorum não atingido (mín: ${quorumMinimo})`;
            quorumStatus.style.color = '#dc3545';
        }
    } else {
        quorumCounter.style.display = 'none';
    }
}

/**
 * Consulta informações de votação sequencialmente
 */
let updateCycleInterval = null;
let isUpdating = false;

async function updateVotingCounters() {
    if (isUpdating) {
        return;
    }
    
    isUpdating = true;
    const footer = document.getElementById('votingCounters');
    
    try {
        // 1. Consulta segundos até próxima votação
        const secondsUntilNext = await lerPropostas('getSecondsUntilNextVoting');
        updateCounter('nextVotingTime', parseInt(secondsUntilNext));
        footer.style.display = 'flex';
        
        // Aguarda um pouco antes da próxima consulta
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 2. Verifica se votação está aberta e consulta informações de presença
        const isVotingOpen = await lerPropostas('isVotingOpen');
        const presenceEndTime = await lerPropostas('presenceRegistrationEndTime');
        const currentTimestamp = Math.floor(Date.now() / 1000);
        
        const presenceCounter = document.getElementById('presenceCounter');
        if (isVotingOpen && currentTimestamp <= parseInt(presenceEndTime)) {
            // Lista de presença está aberta
            const secondsUntilPresenceEnd = parseInt(presenceEndTime) - currentTimestamp;
            updateCounter('presenceTime', secondsUntilPresenceEnd);
            presenceCounter.style.display = 'block';
        } else {
            presenceCounter.style.display = 'none';
        }
        
        // Aguarda um pouco antes da próxima consulta
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 3. Verifica se período de votação está aberto
        const votingCounter = document.getElementById('votingCounter');
        if (isVotingOpen) {
            const secondsUntilVotingEnd = await lerPropostas('getSecondsUntilVotingEnds');
            if (parseInt(secondsUntilVotingEnd) > 0) {
                updateCounter('votingTime', parseInt(secondsUntilVotingEnd));
                votingCounter.style.display = 'block';
            } else {
                votingCounter.style.display = 'none';
            }
        } else {
            votingCounter.style.display = 'none';
        }
        
        // Aguarda um pouco antes da próxima consulta
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 4. Consulta informações de quorum (suporta resposta em array ou objeto)
        const quorumInfo = await lerPropostas('getQuorumInfo');
        const qMin = Array.isArray(quorumInfo) ? quorumInfo[0] : quorumInfo.quorumMinimo;
        const totalAtivos = Array.isArray(quorumInfo) ? quorumInfo[1] : (quorumInfo.totalguardioesAtivos ?? quorumInfo.totalDiretoresAtivos);
        const totalVotantes = Array.isArray(quorumInfo) ? quorumInfo[2] : quorumInfo.totalVotantesAtual;
        const quorumAtingido = Array.isArray(quorumInfo) ? quorumInfo[3] : quorumInfo.quorumAtingido;
        updateQuorumCounter(
            parseInt(totalVotantes),
            parseInt(totalAtivos),
            parseInt(qMin),
            !!quorumAtingido
        );
        
        // Aguarda um pouco antes da próxima consulta
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 5. Consulta informações de reset do contrato
        const secondsUntilReset = await lerPropostas('getSecondsUntilResetAvailable');
        updateResetCounter(parseInt(secondsUntilReset));
        
    } catch (error) {
        console.error('Erro ao atualizar contadores:', error);
        // Em caso de erro, mantém o footer visível mas mostra mensagem de erro
        footer.style.display = 'flex';
        document.getElementById('nextVotingTime').textContent = 'Erro ao consultar';
    } finally {
        isUpdating = false;
    }
}

/**
 * Inicia o ciclo de atualização dos contadores
 */
function startVotingCounters() {
    // Atualiza imediatamente
    updateVotingCounters();
    
    // Inicia atualização em tempo real
    startRealtimeCounters();
    
    // Configura intervalo para atualizar a cada 5 segundos
    if (updateCycleInterval) {
        clearInterval(updateCycleInterval);
    }
    
    updateCycleInterval = setInterval(() => {
        updateVotingCounters();
    }, 5000);
}

/**
 * Para o ciclo de atualização
 */
function stopVotingCounters() {
    if (updateCycleInterval) {
        clearInterval(updateCycleInterval);
        updateCycleInterval = null;
    }
    stopRealtimeCounters();
    document.getElementById('votingCounters').style.display = 'none';
}

// Também tenta iniciar quando a página carregar (fallback caso initContracts não seja chamado)
window.addEventListener('load', () => {
    setTimeout(() => {
        if (contracts.propostas && web3) {
            startVotingCounters();
        }
    }, 3000);
});

