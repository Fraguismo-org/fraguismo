// Configuração Web3 e Contratos
let web3;
let userAccount;
let contracts = {};

/**
 * Função para ler informações do contrato via API
 */
const lerContrato = async (address, functionName, abi, args) => {
    try {
        const resp = await fetch("https://graphenesmartchain.com:3014/readContract", {
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

// Endereços dos contratos
const CONTRACT_ADDRESSES = {
    propostas: '0x3bbcEA18778471ECBf614be44FA1e4Dea89f5C69', // Contrato unificado (Propostas + Diretoria)
    mercado: '0x3633531C8b8D8ec551D3ee29125D05C3edb48FE3',
    graca: '0x7E598c2EB44c58A7F69fcC3957c4f27B6cb459D5',
    blockNumber: '0x59c28c1DEb67a31369E3C0f3511e976E133f7431' // ATUALIZE COM O ENDEREÇO DO CONTRATO DEPLOYADO
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
    {"inputs":[],"name":"getQuorumInfo","outputs":[{"internalType":"uint256","name":"quorumMinimo","type":"uint256"},{"internalType":"uint256","name":"totalDiretoresAtivos","type":"uint256"},{"internalType":"uint256","name":"totalVotantesAtual","type":"uint256"},{"internalType":"bool","name":"quorumAtingido","type":"bool"}],"stateMutability":"view","type":"function"},
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
}

function showResult(elementId, data, isError = false) {
    const element = document.getElementById(elementId);
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

    async abrirVotacaoDiretor() {
        try {
            await escreverPropostas('abrirVotacaoDiretor');
            showResult('result-propostas-abrir-diretor', 'Votação aberta com sucesso pelo diretor!');
        } catch (error) {
            showResult('result-propostas-abrir-diretor', error.message, true);
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
    // FUNÇÕES DE DIRETORES (UNIFICADAS)
    // ============================================

    async getDiretores() {
        try {
            const result = await lerPropostas('getDiretores');
            showResult('result-propostas-getDiretores', { diretores: result });
        } catch (error) {
            showResult('result-propostas-getDiretores', error.message, true);
        }
    },

    async isDiretor() {
        try {
            const address = document.getElementById('propostas-isDiretor-address').value;
            const result = await lerPropostas('isDirector', [address]);
            showResult('result-propostas-isDiretor', { isDiretor: result });
        } catch (error) {
            showResult('result-propostas-isDiretor', error.message, true);
        }
    },

    async totalDiretores() {
        try {
            const result = await lerPropostas('totalDiretores');
            showResult('result-propostas-totalDiretores', { total: result });
        } catch (error) {
            showResult('result-propostas-totalDiretores', error.message, true);
        }
    },

    async adicionarDiretorInicial() {
        try {
            const address = document.getElementById('propostas-addDiretor-address').value;
            await escreverPropostas('adicionarDiretorInicial', [address]);
            showResult('result-propostas-addDiretor', 'Diretor adicionado com sucesso!');
        } catch (error) {
            showResult('result-propostas-addDiretor', error.message, true);
        }
    },

    async proporNovoDiretor() {
        try {
            const candidato = document.getElementById('propostas-propor-candidato').value;
            await escreverPropostas('proporNovoDiretor', [candidato]);
            showResult('result-propostas-propor', 'Proposta criada com sucesso!');
        } catch (error) {
            showResult('result-propostas-propor', error.message, true);
        }
    },

    async votarNovoDiretor() {
        try {
            const candidato = document.getElementById('propostas-votar-diretor-candidato').value;
            const decisao = document.getElementById('propostas-votar-diretor-decisao').value === 'true';
            await escreverPropostas('votarNovoDiretor', [candidato, decisao]);
            showResult('result-propostas-votar-diretor', 'Voto registrado com sucesso!');
        } catch (error) {
            showResult('result-propostas-votar-diretor', error.message, true);
        }
    },

    async encerrarPropostaDiretor() {
        try {
            const candidato = document.getElementById('propostas-encerrar-diretor-candidato').value;
            await escreverPropostas('encerrarPropostaDiretor', [candidato]);
            showResult('result-propostas-encerrar-diretor', 'Proposta encerrada com sucesso!');
        } catch (error) {
            showResult('result-propostas-encerrar-diretor', error.message, true);
        }
    },

    async getDiretorProposalDetails() {
        try {
            const candidato = document.getElementById('propostas-diretor-details-candidato').value;
            const result = await lerPropostas('getDiretorProposalDetails', [candidato]);
            showResult('result-propostas-diretor-details', {
                propositor: result[0],
                candidato: result[1],
                votosSimPeso: result[2],
                votosNaoPeso: result[3],
                encerrada: result[4],
                aprovada: result[5]
            });
        } catch (error) {
            showResult('result-propostas-diretor-details', error.message, true);
        }
    },

    async getDiretorInfo() {
        try {
            const address = document.getElementById('propostas-diretor-info-address').value;
            const result = await lerPropostas('getDiretorInfo', [address]);
            showResult('result-propostas-diretor-info', {
                penalidade: result[0],
                ativo: result[1],
                ehDiretor: result[2]
            });
        } catch (error) {
            showResult('result-propostas-diretor-info', error.message, true);
        }
    },

    async getDiretoresAtivos() {
        try {
            const result = await lerPropostas('getDiretoresAtivos');
            showResult('result-propostas-diretores-ativos', { diretoresAtivos: result });
        } catch (error) {
            showResult('result-propostas-diretores-ativos', error.message, true);
        }
    },

    async getDiretoresSuspensos() {
        try {
            const result = await lerPropostas('getDiretoresSuspensos');
            showResult('result-propostas-diretores-suspensos', { diretoresSuspensos: result });
        } catch (error) {
            showResult('result-propostas-diretores-suspensos', error.message, true);
        }
    },

    async getQuorumInfo() {
        try {
            const result = await lerPropostas('getQuorumInfo');
            showResult('result-propostas-quorum-info', {
                quorumMinimo: result[0],
                totalDiretoresAtivos: result[1],
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
            showResult('result-propostas-suspender', 'Diretores inativos suspensos com sucesso!');
        } catch (error) {
            showResult('result-propostas-suspender', error.message, true);
        }
    },

    async removerInativos() {
        try {
            await escreverPropostas('removerInativos');
            showResult('result-propostas-remover', 'Diretores inativos removidos com sucesso!');
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
    }
};

// ============================================
// FUNÇÕES DO CONTRATO MERCADO
// ============================================
const mercado = {
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
            const statusNames = ['Pendente', 'EmNegociacao', 'Completa', 'Disputada', 'Revertida'];
            showResult('result-mercado-ordem', {
                vendedor: result[0],
                quantidade: result[1],
                valorBRL: result[2],
                comprador: result[3],
                garantia: result[4],
                blocoInicial: result[5],
                status: statusNames[result[6]]
            });
        } catch (error) {
            showResult('result-mercado-ordem', error.message, true);
        }
    },

    async getTodasOrdens() {
        try {
            const result = await lerMercado('getTodasOrdens');
            const statusNames = ['Pendente', 'EmNegociacao', 'Completa', 'Disputada', 'Revertida'];
            const ordens = [];
            
            for (let i = 0; i < result[0].length; i++) {
                ordens.push({
                    id: i,
                    vendedor: result[0][i],
                    quantidade: result[1][i],
                    valorBRL: result[2][i],
                    comprador: result[3][i],
                    garantia: result[4][i],
                    bloco: result[5][i],
                    status: statusNames[result[6][i]]
                });
            }
            
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
            const quantidade = document.getElementById('mercado-criar-quantidade').value;
            const valor = document.getElementById('mercado-criar-valor').value;
            
            await escreverMercado('criarOrdem', [quantidade, valor]);
            showResult('result-mercado-criar', 'Ordem criada com sucesso!');
        } catch (error) {
            showResult('result-mercado-criar', error.message, true);
        }
    },

    async iniciarNegociacao() {
        try {
            const id = document.getElementById('mercado-negociar-id').value;
            const garantia = document.getElementById('mercado-negociar-garantia').value;
            
            await escreverMercadoPayable('iniciarNegociacao', [id], garantia);
            showResult('result-mercado-negociar', 'Negociação iniciada com sucesso!');
        } catch (error) {
            showResult('result-mercado-negociar', error.message, true);
        }
    },

    async marcarComoCompleta() {
        try {
            const id = document.getElementById('mercado-completa-id').value;
            await escreverMercado('marcarComoCompleta', [id]);
            showResult('result-mercado-completa', 'Ordem marcada como completa!');
        } catch (error) {
            showResult('result-mercado-completa', error.message, true);
        }
    },

    async abrirDisputa() {
        try {
            const id = document.getElementById('mercado-disputa-id').value;
            await escreverMercado('abrirDisputa', [id]);
            showResult('result-mercado-disputa', 'Disputa aberta com sucesso!');
        } catch (error) {
            showResult('result-mercado-disputa', error.message, true);
        }
    },

    async arbitroConfirmaPagamento() {
        try {
            const id = document.getElementById('mercado-arbitro-confirma-id').value;
            await escreverMercado('arbitroConfirmaPagamento', [id]);
            showResult('result-mercado-arbitro-confirma', 'Pagamento confirmado!');
        } catch (error) {
            showResult('result-mercado-arbitro-confirma', error.message, true);
        }
    },

    async arbitroReverteTransacao() {
        try {
            const id = document.getElementById('mercado-arbitro-reverte-id').value;
            await escreverMercado('arbitroReverteTransacao', [id]);
            showResult('result-mercado-arbitro-reverte', 'Transação revertida!');
        } catch (error) {
            showResult('result-mercado-arbitro-reverte', error.message, true);
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

    async isDiretor() {
        try {
            const address = document.getElementById('graca-diretor-address').value;
            const result = await lerGraca('isDiretor', [address]);
            showResult('result-graca-diretor', { isDiretor: result });
        } catch (error) {
            showResult('result-graca-diretor', error.message, true);
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
function updateQuorumCounter(votantesAtual, totalDiretoresAtivos, quorumMinimo, quorumAtingido) {
    const quorumCounter = document.getElementById('quorumCounter');
    const quorumText = document.getElementById('quorumText');
    const quorumBar = document.getElementById('quorumBar');
    const quorumStatus = document.getElementById('quorumStatus');
    
    // Mostra o contador apenas se houver diretores ativos
    if (totalDiretoresAtivos > 0) {
        quorumCounter.style.display = 'block';
        
        // Atualiza o texto (ex: 6/10)
        quorumText.textContent = `${votantesAtual}/${totalDiretoresAtivos}`;
        
        // Calcula a porcentagem baseada no quorum mínimo (100% = quorum atingido)
        // Se o quorum mínimo for 0, usa o total de diretores como base
        let percentage = 0;
        if (quorumMinimo > 0) {
            percentage = Math.min(100, (votantesAtual / quorumMinimo) * 100);
        } else if (totalDiretoresAtivos > 0) {
            percentage = Math.min(100, (votantesAtual / totalDiretoresAtivos) * 100);
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
        
        // 4. Consulta informações de quorum
        const quorumInfo = await lerPropostas('getQuorumInfo');
        updateQuorumCounter(
            parseInt(quorumInfo.totalVotantesAtual),
            parseInt(quorumInfo.totalDiretoresAtivos),
            parseInt(quorumInfo.quorumMinimo),
            quorumInfo.quorumAtingido
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

