/**
 *Submitted for verification at polygonscan.com on 2025-12-18
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Interface para o token de votação/venda.
 * Agora inclui a função transfer para permitir que o contrato envie tokens.
 */
interface IToken {
    function balanceOf(address account) external view returns (uint256);
    function mint(address to, uint256 amount) external; // Não será utilizada na compra
    function transfer(address to, uint256 amount) external returns (bool);
}

/**
 * @title Interface para o contrato NFT de votação
 * Permite consultar o total de tokens que um endereço possui em NFTs
 */
interface IVotingNFT {
    function getTotalTokensByOwner(address account) external view returns (uint256);
}

contract PropostaSemanal {
    
    address public owner;          // Dono do contrato
    address public tokenAddress;   // Endereço do token usado para votação e venda
    address public nftAddress;     // Endereço do contrato NFT de votação (opcional)
    bool public nftAddressChanged; // Indica se o endereço do NFT já foi alterado (apenas uma vez permitido)
    bool public isTestMode;        // Define se o contrato está em modo de teste

    // Gerenciamento de guardioes
    address[] private guardioes;
    uint256 public totalguardioes;
    
    // Sistema de Penalidades e Suspensão
    mapping(address => uint256) public penalidades; // Penalidades acumuladas por guardiao
    mapping(address => bool) public guardiaoAtivo; // guardioes ativos (não suspensos)
    mapping(address => uint256) public indexNoArray; // Índice do guardiao no array (para remoção eficiente)

     // Novo mapeamento: peso efetivo de cada votante (pré-calculado)
    mapping(address => uint256) public effectiveWeights;

    // Flag de controle se pesos já foram calculados
    bool public weightsCalculated;
    // Durações de tempo em segundos
    uint256 public constant SECONDS_PER_HOUR = 3600; 
    uint256 public constant SECONDS_PER_WEEK = 604800; // 7 dias em segundos
    
    // Janela de votação
    bool public isVotingOpen;        // Indica se a janela de votação está aberta
    uint256 public votingStartTime; // Timestamp inicial da janela
    uint256 public votingEndTime;   // Timestamp final da janela
    uint256 public nextVotingStartTime; // Timestamp no qual a próxima votação reabre

    // Período de registro de presença (ex.: primeiros 10 minutos)
    uint256 public presenceRegistrationEndTime;
    uint256 public presenceDuration; // duração em segundos (10 minutos = 600 segundos)

    // Bloqueio de usuários por 30 dias (em segundos)
    uint256 public constant SECONDS_30_DAYS = 2592000; // 30 dias em segundos
    mapping(address => uint256) public blockedUntil;

    // Segurança: controle do último timestamp com votação finalizada
    uint256 public ultimoTimestampVotado; // Timestamp da última proposta finalizada (aprovada ou rejeitada)
    uint256 public seconds3Months; // 3 meses em segundos (definido no constructor)

    // Fator de conversão para tokens (ex: 1 token = 1e18 unidades)
    uint256 public constant DECIMALS = 1e18;

    // REGISTRO DE PRESENÇA
    mapping(address => uint256) public registeredTokens;
    address[] public votersList;
    uint256 public totalRegisteredTokens;
    uint256 public totalVoters;

    // Estrutura de uma Proposta (permite múltiplas simultâneas)
    struct Proposal {
        address proposer;            // Quem criou a proposta
        address wallet;              // Carteira para recebimento (se aprovada)
        uint256 amount;              // Quantidade de tokens solicitados (com os 18 decimais)
        uint256 price;               // Preço definido na proposta: número inteiro de tokens por 1 BNB
        string proposeHash;          // Hash SHA256 do documento da proposta
        uint256 totalYesWeight;      // Soma dos pesos dos votos "sim"
        uint256 totalNoWeight;       // Soma dos pesos dos votos "não"
        bool ended;                  // Se a votação já foi encerrada
        bool approved;               // Se a proposta foi aprovada
        uint256 tokensRemaining;     // Quantidade de tokens ainda para vender (com decimais)
        uint256 bnbBalance;          // BNB arrecadado para essa proposta
        mapping(address => bool) voted; // Controle para não votar 2x nesta proposta
        address[] yesVoters;         // Lista dos guardioes que votaram "sim"
    }

    // Mapeia o hash da proposta para sua estrutura
    mapping(string => Proposal) private proposals;
    // Array para armazenar os hashes das propostas criadas
    string[] public proposalList;

    // Estrutura de proposta para novos guardioes
    struct guardiaoProposal {
        address proposer;
        address candidate;
        bool ended;
        bool approved;
        uint256 totalYesWeight;
        uint256 totalNoWeight;
        mapping(address => bool) voted;
    }

    // Mapeia candidato para proposta de guardiao
    mapping(address => guardiaoProposal) public guardiaoProposals;
    // Array para armazenar os candidatos propostos
    address[] public guardiaoProposalList;

    // Eventos
    event ProposalCreated(
        address indexed proposer,
        string proposeHash,
        uint256 amount,
        uint256 price
    );
    event Voted(
        address indexed voter,
        string proposeHash,
        bool decision,
        uint256 weight
    );
    event ProposalEnded(
        string proposeHash,
        bool approved,
        uint256 totalYesWeight,
        uint256 totalNoWeight
    );
    event TokensBought(
        string proposeHash,
        address indexed buyer,
        uint256 amount,
        uint256 bnbPaid
    );
    event Withdrawn(
        string proposeHash,
        address indexed proposer,
        uint256 amountBNB
    );
    event ContractReset(
        address indexed recipient,
        uint256 tokensTransferred,
        uint256 bnbTransferred,
        uint256 lastVotedTimestamp
    );
    event guardiaoAdicionado(address indexed guardiao);
    event guardiaoPropostaCriada(address indexed proposer, address indexed candidato);
    event guardiaoVotado(address indexed voter, address indexed candidato, bool decisao, uint256 peso);
    event guardiaoPropostaEncerrada(address indexed candidato, bool aprovada);
    event PenalidadeAplicada(address indexed guardiao, uint256 novaPenalidade);
    event PenalidadeResetada(address indexed guardiao);
    event guardiaoSuspenso(address indexed guardiao, uint256 penalidade);
    event guardiaoRemovido(address indexed guardiao, uint256 penalidade);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(address _tokenAddress, bool _isTestMode, uint256 _seconds3Months, address _nftAddress) {
        owner = msg.sender;
        tokenAddress = _tokenAddress; //0xc86a23ca296B69e0b6E8930616Cc4FE8d4Ac32De
        nftAddress = _nftAddress; //0x1ADdA5A84869691314d677e7B2B6b8D6218Ff9B0
        nftAddressChanged = false; // Permite uma alteração após o deploy
        isTestMode = _isTestMode;
        seconds3Months = _seconds3Months; //7776000 (90 dias em segundos)
        ultimoTimestampVotado = block.timestamp; // Inicializa com o timestamp atual
        totalguardioes = 0;
    }
    
    /**
     * @dev Retorna o quorum mínimo necessário para votação.
     * Quorum = (total de guardioes ativos / 2) + 1
     */
    function getQuorumMinimo() public view returns (uint256) {
        uint256 guardioesAtivos = getTotalguardioesAtivos();
        if (guardioesAtivos == 0) return 0;
        return (guardioesAtivos / 2) + 1;
    }
    
    /**
     * @dev Retorna o total de guardioes ativos (não suspensos).
     */
    function getTotalguardioesAtivos() public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < guardioes.length; i++) {
            if (guardiaoAtivo[guardioes[i]]) {
                count++;
            }
        }
        return count;
    }
    
    /**
     * @dev Verifica se um guardiao está ativo (não suspenso).
     */
    function isguardiaoAtivo(address guardiao) public view returns (bool) {
        return isDirector(guardiao) && guardiaoAtivo[guardiao];
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Somente o owner pode chamar esta funcao");
        _;
    }

    modifier onlyguardiao() {
        require(isDirector(msg.sender), "Apenas guardioes");
        _;
    }

    /**
     * @dev Permite ao owner alterar o endereço do contrato NFT de votação.
     * Esta alteração só pode ser feita UMA VEZ após o deploy.
     * @param _nftAddress Novo endereço do contrato NFT (use address(0) para desabilitar NFTs)
     */
    function setNFTAddress(address _nftAddress) external onlyOwner {
        require(!nftAddressChanged, "Endereco do NFT ja foi alterado. Permitido apenas uma vez");
        nftAddress = _nftAddress;
        nftAddressChanged = true;
    }



    

    /**
     * @dev Permite que qualquer guardiao ativo abra a votação após o tempo semanal ter sido atingido.
     */
    function abrirVotacaoguardiao() external {
    require(isguardiaoAtivo(msg.sender), "Apenas guardioes ativos podem abrir a votacao");
    require(!isVotingOpen, "Votacao ja esta aberta");
    require(block.timestamp >= nextVotingStartTime, "Tempo semanal ainda nao foi atingido");

    // Impede abertura durante encerramento pendente
    require(block.timestamp >= votingEndTime, "Aguardando encerramento da votacao anterior");

    // Limpa registros de presença e votos anteriores
    _limparRegistrosPresenca();


    // Marca início da votação
    isVotingOpen = true;
    votingStartTime = block.timestamp;

            if (isTestMode) {
                // MODO DE TESTE:
                // 2 minutos de presença, 10 minutos de votação, próxima votação em 15 minutos
                presenceDuration = 120; // 2 minutos em segundos
                votingEndTime = block.timestamp + 600; // 10 minutos em segundos
                nextVotingStartTime = block.timestamp + 900; // 15 minutos em segundos
            } else {
                // MODO NORMAL:
                // 10 minutos de presença, 1 hora de votação, próxima em 1 semana
                presenceDuration = 600; // 10 minutos em segundos
                votingEndTime = block.timestamp + SECONDS_PER_HOUR; // 1 hora
                nextVotingStartTime = block.timestamp + SECONDS_PER_WEEK; // 1 semana
            }
    
    presenceRegistrationEndTime = block.timestamp + presenceDuration;


}


    /**
     * @dev Retorna quantos segundos faltam para encerrar a votação atual.
     */
    function getSecondsUntilVotingEnds() external view returns (uint256) {
        if (!isVotingOpen || block.timestamp >= votingEndTime) {
            return 0;
        }
        return votingEndTime - block.timestamp;
    }

    /**
     * @dev Retorna quantos segundos faltam para a próxima votação.
     */
    function getSecondsUntilNextVoting() external view returns (uint256) {
        if (block.timestamp >= nextVotingStartTime) {
            return 0;
        }
        return nextVotingStartTime - block.timestamp;
    }

    /**
     * @dev Registra a presença do guardiao na votação durante o período de presença.
     * Considera tanto tokens na carteira quanto tokens dos NFTs possuídos.
     * Reseta a penalidade quando o guardiao comparece.
     * guardioes suspensos podem registrar presença e serão reativados automaticamente.
     */
    function registerPresence() external {
        require(isVotingOpen, "Votacao nao esta aberta");
        require(block.timestamp <= presenceRegistrationEndTime, "Periodo de registro encerrado");
        require(isDirector(msg.sender), "Apenas guardioes podem registrar presenca");
        require(registeredTokens[msg.sender] == 0, "Presenca ja registrada");

        // Obtém tokens da carteira
        uint256 walletTokens = IToken(tokenAddress).balanceOf(msg.sender);
        
        // Obtém tokens dos NFTs (se o contrato NFT estiver configurado)
        uint256 nftTokens = 0;
        if (nftAddress != address(0)) {
            try IVotingNFT(nftAddress).getTotalTokensByOwner(msg.sender) returns (uint256 tokens) {
                nftTokens = tokens;
            } catch {
                // Se houver erro ao consultar o NFT, ignora e continua apenas com tokens da carteira
                nftTokens = 0;
            }
        }
        
        // Soma tokens da carteira + tokens dos NFTs
        uint256 tokenSnapshot = walletTokens + nftTokens;
        require(tokenSnapshot > 0, "Saldo insuficiente de tokens (carteira e NFTs)");

        registeredTokens[msg.sender] = tokenSnapshot;
        votersList.push(msg.sender);
        totalRegisteredTokens += tokenSnapshot;
        totalVoters += 1;
        
        // Reseta penalidade quando o guardiao comparece
        if (penalidades[msg.sender] > 0) {
            penalidades[msg.sender] = 0;
            emit PenalidadeResetada(msg.sender);
            
            // Se estava suspenso, reativa o guardiao
            if (!guardiaoAtivo[msg.sender]) {
                guardiaoAtivo[msg.sender] = true;
            }
        }
        
    }

    /**
     * @dev Função auxiliar que determina a porcentagem máxima de voto permitida.
     */
    function getAllowedPercentage() internal view returns (uint256) {
        if (totalVoters >= 5 && totalVoters <= 9) {
            return 25;
        } else if (totalVoters >= 10 && totalVoters <= 15) {
            return 20;
        } else if (totalVoters >= 16 && totalVoters <= 20) {
            return 15;
        } else if (totalVoters >= 21) {
            return 10;
        }
        return 100;
    }

    /**
     * @dev Cria uma nova proposta e a adiciona ao array proposalList.
     */
    function makePropose(
        uint256 amount,
        address wallet,
        string calldata proposeHash,
        uint256 price
    ) external {
        require(block.timestamp >= blockedUntil[msg.sender], "Voce esta bloqueado temporariamente");
        require(proposals[proposeHash].proposer == address(0), "Proposta ja existe");

        Proposal storage p = proposals[proposeHash];
        p.proposer = msg.sender;
        p.wallet = wallet;
        p.amount = amount * DECIMALS;
        p.price = price;
        p.proposeHash = proposeHash;
        p.tokensRemaining = p.amount;

        proposalList.push(proposeHash);

        emit ProposalCreated(msg.sender, proposeHash, p.amount, price);
    }

       function calculateEffectiveWeights() internal {
    require(totalVoters > 0, "Nenhum votante registrado");
    require(!weightsCalculated, "Pesos ja calculados");

    uint256 allowedPercentage = getAllowedPercentage();
    uint256 total = totalRegisteredTokens;

    // maxVoteWeight = cap inicial
    uint256 maxVoteWeight = (total * allowedPercentage) / 100;

    // Inicialmente, pesos = snapshots
    for (uint256 i = 0; i < votersList.length; i++) {
        address v = votersList[i];
        effectiveWeights[v] = registeredTokens[v];
    }

    // Processo iterativo (cap-and-redistribute)
    // Máximo de 20 iterações (mais que suficiente para qualquer N)
    for (uint256 round = 0; round < 20; round++) {

        uint256 sumWeights = 0;
        for (uint256 i = 0; i < votersList.length; i++) {
            sumWeights += effectiveWeights[votersList[i]];
        }

        // Recalcular cap com base no total atual
        maxVoteWeight = (sumWeights * allowedPercentage) / 100;

        uint256 excess = 0;
        uint256 uncappedSum = 0;

        // 1) Corta quem passou do limite e acumula excesso
        for (uint256 i = 0; i < votersList.length; i++) {
            address v = votersList[i];
            uint256 w = effectiveWeights[v];

            if (w > maxVoteWeight) {
                excess += (w - maxVoteWeight);
                effectiveWeights[v] = maxVoteWeight;
            } else {
                uncappedSum += w;
            }
        }

        // Se não há excesso → convergiu!
        if (excess == 0) {
            break;
        }

        // 2) Redistribui excesso proporcionalmente entre os nao-capados
        if (uncappedSum > 0) {
            for (uint256 i = 0; i < votersList.length; i++) {
                address v = votersList[i];
                uint256 w = effectiveWeights[v];

                if (w < maxVoteWeight && w > 0) {
                    uint256 parcela = (excess * w) / uncappedSum;
                    effectiveWeights[v] = w + parcela;
                }
            }
        }
        // Se todos foram capados (uncappedSum == 0), não tem para onde redistribuir.
        // Teoricamente impossível com N > 1 e percentuais reais.
    }

    weightsCalculated = true;
}


    function calcularPesos() external onlyguardiao {
                require(block.timestamp > presenceRegistrationEndTime, "Registro de presenca ainda aberto");
                calculateEffectiveWeights();
    }

    function limparPesos() external onlyguardiao {
        require(!isVotingOpen, "Nao pode limpar pesos com votacao aberta");

        for (uint256 i = 0; i < votersList.length; i++) {
            delete effectiveWeights[votersList[i]];
        }

        weightsCalculated = false;
    }

    /**
     * @dev Retorna o peso efetivo de um votante específico.
     * @param voter Endereço do votante
     * @return peso Peso efetivo calculado (0 se não calculado ou votante não registrado)
     */
    function getEffectiveWeight(address voter) external view returns (uint256) {
        return effectiveWeights[voter];
    }

    /**
     * @dev Retorna todos os pesos efetivos calculados.
     * @return votersArray Array de endereços dos votantes
     * @return weightsArray Array de pesos efetivos correspondentes a cada votante
     * @return calculado Indica se os pesos já foram calculados
     */
    function getAllEffectiveWeights() external view returns (
        address[] memory votersArray,
        uint256[] memory weightsArray,
        bool calculado
    ) {
        uint256 length = votersList.length;
        votersArray = new address[](length);
        weightsArray = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            address voter = votersList[i];
            votersArray[i] = voter;
            weightsArray[i] = effectiveWeights[voter];
        }
        
        calculado = weightsCalculated;
        
        return (votersArray, weightsArray, calculado);
    }

    /**
     * @dev guardiao vota na proposta, com peso limitado.
     * Verifica quorum mínimo antes de permitir votos.
     * Apenas guardioes que registraram presença podem votar.
     */
        function doVote(string calldata proposeHash, bool decision) external {
        require(isVotingOpen, "Votacao nao esta aberta");
        require(block.timestamp > presenceRegistrationEndTime, "Registro de presenca ainda aberto");
        require(block.timestamp >= votingStartTime && block.timestamp <= votingEndTime, "Fora do periodo de votacao");

        uint256 quorumMinimo = getQuorumMinimo();
        require(totalVoters >= quorumMinimo, "Quorum minimo nao atingido");

        Proposal storage p = proposals[proposeHash];
        require(p.proposer != address(0), "Proposta inexistente");
        require(!p.ended, "Proposta ja encerrada");
        require(!p.voted[msg.sender], "Ja votou nesta proposta");
        require(registeredTokens[msg.sender] > 0, "Votante nao registrou presenca");
        require(weightsCalculated, "Pesos nao calculados");

        uint256 effectiveWeight = effectiveWeights[msg.sender];
        require(effectiveWeight > 0, "Peso invalido");

        p.voted[msg.sender] = true;

        if (decision) {
            p.totalYesWeight += effectiveWeight;
            p.yesVoters.push(msg.sender);
        } else {
            p.totalNoWeight += effectiveWeight;
        }

        emit Voted(msg.sender, proposeHash, decision, effectiveWeight);
    }


    /**
     * @dev Encerra a votação de uma proposta.
     */
    function endVote(string calldata proposeHash) external {
        require(isVotingOpen, "Nao ha votacao aberta no momento");
        require(block.timestamp > votingEndTime, "Periodo de votacao ainda nao terminou");

        Proposal storage p = proposals[proposeHash];
        require(!p.ended, "Proposta ja encerrada");
        require(p.proposer != address(0), "Proposta inexistente");

        p.ended = true;

        if (p.totalYesWeight > p.totalNoWeight) {
            p.approved = true;
        } else {
            //regra removida blockedUntil[p.proposer] = block.timestamp + SECONDS_30_DAYS;
        }

        // Atualiza o último timestamp com votação finalizada
        ultimoTimestampVotado = block.timestamp;

        emit ProposalEnded(proposeHash, p.approved, p.totalYesWeight, p.totalNoWeight);
    }
    
    /**
     * @dev Aplica penalidades aos guardioes que não registraram presença.
     * Deve ser chamada quando a votação é fechada.
     * Aplica penalidade a todos os guardioes (ativos ou inativos) que não compareceram.
     */
    function _aplicarPenalidades() internal {
        for (uint256 i = 0; i < guardioes.length; i++) {
            address guardiao = guardioes[i];
            // Aplica penalidade a todos os guardioes que não compareceram (independente do status ativo/inativo)
            if (registeredTokens[guardiao] == 0) {
                penalidades[guardiao]++;
                emit PenalidadeAplicada(guardiao, penalidades[guardiao]);
            }
        }
    }

    /**
     * @dev Compra tokens referentes a uma proposta aprovada.
     */
    function buyTokens(string calldata proposeHash, address to) external payable {
        Proposal storage p = proposals[proposeHash];
        require(p.approved, "Proposta nao aprovada");
        require(p.ended, "Votacao ainda nao encerrada");
        require(msg.value > 0, "Precisa enviar BNB");

        uint256 tokensToBuy = (msg.value * p.price * DECIMALS) / 1e18;
        require(p.tokensRemaining >= tokensToBuy, "Nao ha tokens suficientes para vender");

        p.tokensRemaining -= tokensToBuy;
        p.bnbBalance += msg.value;

        require(IToken(tokenAddress).transfer(to, tokensToBuy), "Falha na transferencia dos tokens");

        emit TokensBought(proposeHash, msg.sender, tokensToBuy, msg.value);
    }

    /**
     * @dev Permite que o propositor saque os BNB arrecadados.
     */
    function withdraw(string calldata proposeHash) external {
        Proposal storage p = proposals[proposeHash];
        require(p.proposer == msg.sender, "Somente o propositor pode sacar");
        require(p.approved && p.ended, "Proposta nao aprovada/encerrada");
        require(p.tokensRemaining == 0, "Ainda ha tokens nao vendidos");
        require(p.bnbBalance > 0, "Nada a sacar");

        uint256 amountBNB = p.bnbBalance;
        p.bnbBalance = 0;

        payable(p.wallet).transfer(amountBNB);

        emit Withdrawn(proposeHash, msg.sender, amountBNB);
    }

    // ====================================================
    // FUNÇÕES DE GERENCIAMENTO DE guardioes
    // ====================================================

    /**
     * @dev Adiciona os primeiros 9 guardioes iniciais (apenas owner, incluindo o próprio owner).
     */
    function adicionarguardiaoInicial(address _guardiao) external onlyOwner {
        require(_guardiao != address(0), "Endereco invalido");
        require(!isDirector(_guardiao), "Ja eh guardiao");
        require(totalguardioes < 9, "Limite inicial de 9 guardioes atingido");
        guardioes.push(_guardiao);
        indexNoArray[_guardiao] = guardioes.length - 1;
        guardiaoAtivo[_guardiao] = true;
        penalidades[_guardiao] = 0;
        totalguardioes++;
        emit guardiaoAdicionado(_guardiao);
    }
    
    /**
     * @dev Transfere o ownership do contrato para um novo endereço.
     * @param newOwner Novo endereço do owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Endereco invalido");
        require(newOwner != owner, "Novo owner deve ser diferente do atual");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    /**
     * @dev Verifica se um endereço é guardiao (mesmo se suspenso).
     */
    function isDirector(address user) public view returns (bool) {
        if (guardioes.length == 0) return false;
        // Busca linear no array de guardioes
        for (uint256 i = 0; i < guardioes.length; i++) {
            if (guardioes[i] == user) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Remove um guardiao do array de forma eficiente.
     */
    function _removerguardiaoDoArray(address _guardiao) internal {
        uint256 index = indexNoArray[_guardiao];
        uint256 lastIndex = guardioes.length - 1;
        
        if (index != lastIndex) {
            address lastguardiao = guardioes[lastIndex];
            guardioes[index] = lastguardiao;
            indexNoArray[lastguardiao] = index;
        }
        
        guardioes.pop();
        delete indexNoArray[_guardiao];
        totalguardioes--;
    }

    /**
     * @dev Retorna a lista de guardioes.
     */
    function getguardioes() external view returns (address[] memory) {
        return guardioes;
    }

    /**
     * @dev Propor um novo guardiao (apenas durante votação aberta e após período de presença).
     * Verifica quorum mínimo antes de permitir propor.
     */
    function proporNovoguardiao(address candidato) external onlyguardiao {
        //require(isVotingOpen, "Votacao fechada");
        //require(block.number > presenceRegistrationEndBlock, "Presenca ainda aberta");
        //require(block.number <= votingEndBlock, "Periodo de votacao encerrado");
        require(isguardiaoAtivo(msg.sender), "guardiao deve estar ativo");
        
        // Verifica quorum mínimo
        //uint256 quorumMinimo = getQuorumMinimo();
        //require(totalVoters >= quorumMinimo, "Quorum minimo nao atingido");
        
        require(guardiaoProposals[candidato].candidate == address(0), "Proposta ja existe");
        require(!isDirector(candidato), "Ja eh guardiao");
        require(!guardiaoProposals[candidato].ended, "Proposta ja finalizada");

        guardiaoProposal storage p = guardiaoProposals[candidato];
        p.proposer = msg.sender;
        p.candidate = candidato;
        guardiaoProposalList.push(candidato);

        emit guardiaoPropostaCriada(msg.sender, candidato);
    }

    /**
     * @dev Vota em uma proposta de novo guardiao.
     * Verifica quorum mínimo e se o guardiao está ativo.
     */
    function votarNovoguardiao(address candidato, bool decisao) external onlyguardiao {
        require(isVotingOpen, "Votacao fechada");
        require(block.timestamp > presenceRegistrationEndTime, "Presenca ainda aberta");
        require(block.timestamp <= votingEndTime, "Periodo de votacao encerrado");
        require(isguardiaoAtivo(msg.sender), "guardiao deve estar ativo");
        require(registeredTokens[msg.sender] > 0, "Nao registrou presenca");
        
        // Verifica quorum mínimo
        uint256 quorumMinimo = getQuorumMinimo();
        require(totalVoters >= quorumMinimo, "Quorum minimo nao atingido");

        guardiaoProposal storage p = guardiaoProposals[candidato];
        require(p.candidate != address(0), "Proposta inexistente");
        require(!p.ended, "Proposta ja encerrada");
        require(!p.voted[msg.sender], "Ja votou");

        uint256 allowedPercentage = getAllowedPercentage();
        uint256 maxWeight = (totalRegisteredTokens * allowedPercentage) / 100;
        uint256 weight = registeredTokens[msg.sender];
        if (weight > maxWeight) weight = maxWeight;

        p.voted[msg.sender] = true;
        if (decisao) {
            p.totalYesWeight += weight;
        } else {
            p.totalNoWeight += weight;
        }

        emit guardiaoVotado(msg.sender, candidato, decisao, weight);
    }

    /**
     * @dev Encerra uma proposta de novo guardiao.
     */
    function encerrarPropostaguardiao(address candidato) external onlyguardiao {
        require(isVotingOpen, "Nenhuma votacao aberta");
        require(block.timestamp > votingEndTime, "Periodo de votacao ainda nao terminou");

        guardiaoProposal storage p = guardiaoProposals[candidato];
        require(!p.ended, "Ja encerrada");
        require(p.candidate != address(0), "Proposta inexistente");

        p.ended = true;

        if (p.totalYesWeight > p.totalNoWeight) {
            p.approved = true;
            guardioes.push(p.candidate);
            indexNoArray[p.candidate] = guardioes.length - 1;
            guardiaoAtivo[p.candidate] = true;
            penalidades[p.candidate] = 0;
            totalguardioes++;
            emit guardiaoAdicionado(p.candidate);
        }

        emit guardiaoPropostaEncerrada(candidato, p.approved);
    }
    
    /**
     * @dev Suspende guardioes inativos com penalidade >= 2.
     * Pode ser chamada por qualquer guardiao.
     */
    function suspenderInativos() external onlyguardiao {
        uint256 suspensos = 0;
        for (uint256 i = 0; i < guardioes.length; i++) {
            address guardiao = guardioes[i];
            if (guardiaoAtivo[guardiao] && penalidades[guardiao] >= 2) {
                guardiaoAtivo[guardiao] = false;
                suspensos++;
                emit guardiaoSuspenso(guardiao, penalidades[guardiao]);
            }
        }
        require(suspensos > 0, "Nenhum guardiao para suspender");
    }
    
    /**
     * @dev Remove guardioes inativos com penalidade >= 4.
     * Pode ser chamada por qualquer guardiao.
     */
    function removerInativos() external onlyguardiao {
        uint256 removidos = 0;
        // Percorre de trás para frente para evitar problemas com índices ao remover
        for (uint256 i = guardioes.length; i > 0; i--) {
            uint256 index = i - 1;
            address guardiao = guardioes[index];
            if (penalidades[guardiao] >= 4) {
                _removerguardiaoDoArray(guardiao);
                guardiaoAtivo[guardiao] = false;
                removidos++;
                emit guardiaoRemovido(guardiao, penalidades[guardiao]);
            }
        }
        require(removidos > 0, "Nenhum guardiao para remover");
    }
    
    /**
     * @dev Permite ao owner ou guardiao encerrar a janela de votação.
     * Aplica penalidades a todos os guardioes que não compareceram quando a votação é fechada.
     */
    function fecharVotacao() external {
        require(msg.sender == owner || isDirector(msg.sender), "Apenas owner ou guardiao");
        require(isVotingOpen, "Ja esta fechada");
        
        // Aplica penalidades a todos os guardioes que não compareceram (independente do status ativo/inativo)
        _aplicarPenalidades();
        
        isVotingOpen = false;
    }

    /**
     * @dev Função interna para limpar registros de presença.
     */
    function _limparRegistrosPresenca() internal {
        for (uint256 i = 0; i < votersList.length; i++) {
            registeredTokens[votersList[i]] = 0;
        }
        delete votersList;
        totalRegisteredTokens = 0;
        totalVoters = 0;
    }
    
    /**
     * @dev Após o encerramento, o owner ou guardiao pode limpar os registros de presença.
     */
    function clearPresence() external {
        require(msg.sender == owner || isDirector(msg.sender), "Apenas owner ou guardiao");
        require(!isVotingOpen, "A votacao ainda esta aberta");
        _limparRegistrosPresenca();
    }

    // ====================================================
    // FUNÇÕES DE CONSULTA
    // ====================================================

    /**
     * @dev Retorna o total de tokens de um endereço (carteira + NFTs)
     * @param account Endereço a ser consultado
     * @return totalTokens Total de tokens (carteira + NFTs)
     * @return walletTokens Tokens na carteira
     * @return nftTokens Tokens dos NFTs possuídos
     */
    function getTotalTokens(address account) external view returns (
        uint256 totalTokens,
        uint256 walletTokens,
        uint256 nftTokens
    ) {
        walletTokens = IToken(tokenAddress).balanceOf(account);
        nftTokens = 0;
        
        if (nftAddress != address(0)) {
            try IVotingNFT(nftAddress).getTotalTokensByOwner(account) returns (uint256 tokens) {
                nftTokens = tokens;
            } catch {
                nftTokens = 0;
            }
        }
        
        totalTokens = walletTokens + nftTokens;
    }

    function getProposalYesWeight(string calldata proposeHash) external view returns (uint256) {
        Proposal storage p = proposals[proposeHash];
        require(p.proposer != address(0), "Proposta inexistente");
        return p.totalYesWeight;
    }

    function getProposalYesVoters(string calldata proposeHash) external view returns (address[] memory) {
        Proposal storage p = proposals[proposeHash];
        require(p.proposer != address(0), "Proposta inexistente");
        return p.yesVoters;
    }

    function getProposalDetails(string calldata proposeHash)
        external
        view
        returns (
            address proposer,
            address wallet,
            uint256 amount,
            uint256 price,
            uint256 totalYesWeight,
            uint256 totalNoWeight,
            bool ended,
            bool approved,
            uint256 tokensRemaining,
            uint256 bnbBalance
        )
    {
        Proposal storage p = proposals[proposeHash];
        require(p.proposer != address(0), "Proposta inexistente");
        return (
            p.proposer,
            p.wallet,
            p.amount,
            p.price,
            p.totalYesWeight,
            p.totalNoWeight,
            p.ended,
            p.approved,
            p.tokensRemaining,
            p.bnbBalance
        );
    }

    /**
     * @dev Retorna os detalhes de uma proposta de novo guardiao.
     * @param candidato Endereço do candidato a guardiao
     * @return proposer Endereço de quem criou a proposta
     * @return candidate Endereço do candidato
     * @return totalYesWeight Peso total dos votos "sim"
     * @return totalNoWeight Peso total dos votos "não"
     * @return ended Se a proposta foi encerrada
     * @return approved Se a proposta foi aprovada
     */
    function getguardiaoProposalDetails(address candidato)
        external
        view
        returns (
            address proposer,
            address candidate,
            uint256 totalYesWeight,
            uint256 totalNoWeight,
            bool ended,
            bool approved
        )
    {
        guardiaoProposal storage p = guardiaoProposals[candidato];
        require(p.candidate != address(0), "Proposta inexistente");
        return (
            p.proposer,
            p.candidate,
            p.totalYesWeight,
            p.totalNoWeight,
            p.ended,
            p.approved
        );
    }

    /**
     * @dev Retorna informações sobre um guardiao (penalidade, status ativo).
     * @param guardiao Endereço do guardiao
     * @return penalidade Número de penalidades acumuladas
     * @return ativo Se o guardiao está ativo (não suspenso)
     * @return ehguardiao Se o endereço é um guardiao
     */
    function getguardiaoInfo(address guardiao) external view returns (
        uint256 penalidade,
        bool ativo,
        bool ehguardiao
    ) {
        ehguardiao = isDirector(guardiao);
        if (ehguardiao) {
            penalidade = penalidades[guardiao];
            ativo = guardiaoAtivo[guardiao];
        }
    }

    /**
     * @dev Retorna lista de guardioes ativos.
     */
    function getguardioesAtivos() external view returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < guardioes.length; i++) {
            if (guardiaoAtivo[guardioes[i]]) {
                count++;
            }
        }
        address[] memory ativos = new address[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < guardioes.length; i++) {
            if (guardiaoAtivo[guardioes[i]]) {
                ativos[j] = guardioes[i];
                j++;
            }
        }
        return ativos;
    }

    /**
     * @dev Retorna lista de guardioes suspensos.
     */
    function getguardioesSuspensos() external view returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < guardioes.length; i++) {
            if (!guardiaoAtivo[guardioes[i]]) {
                count++;
            }
        }
        address[] memory suspensos = new address[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < guardioes.length; i++) {
            if (!guardiaoAtivo[guardioes[i]]) {
                suspensos[j] = guardioes[i];
                j++;
            }
        }
        return suspensos;
    }

    /**
     * @dev Retorna informações sobre o quorum da votação atual.
     * @return quorumMinimo Quorum mínimo necessário
     * @return totalguardioesAtivos Total de guardioes ativos
     * @return totalVotantesAtual Total de votantes que registraram presença
     * @return quorumAtingido Se o quorum foi atingido
     */
    function getQuorumInfo() external view returns (
        uint256 quorumMinimo,
        uint256 totalguardioesAtivos,
        uint256 totalVotantesAtual,
        bool quorumAtingido
    ) {
        totalguardioesAtivos = getTotalguardioesAtivos();
        quorumMinimo = getQuorumMinimo();
        totalVotantesAtual = totalVoters;
        quorumAtingido = totalVotantesAtual >= quorumMinimo;
    }

    /**
     * @dev Retorna a lista completa de guardioes com suas penalidades e status.
     * @return guardioesArray Array de endereços dos guardioes
     * @return penalidadesArray Array de penalidades correspondentes a cada guardiao
     * @return ativosArray Array de status ativo (true = ativo, false = suspenso) correspondente a cada guardiao
     */
    function getguardioesCompleto() external view returns (
        address[] memory guardioesArray,
        uint256[] memory penalidadesArray,
        bool[] memory ativosArray
    ) {
        uint256 length = guardioes.length;
        guardioesArray = new address[](length);
        penalidadesArray = new uint256[](length);
        ativosArray = new bool[](length);
        
        for (uint256 i = 0; i < length; i++) {
            address guardiao = guardioes[i];
            guardioesArray[i] = guardiao;
            penalidadesArray[i] = penalidades[guardiao];
            ativosArray[i] = guardiaoAtivo[guardiao];
        }
        
        return (guardioesArray, penalidadesArray, ativosArray);
    }

    // ====================================================
    // FUNÇÕES DE SEGURANÇA: RESGATAR TOKENS E BNBs
    // ====================================================

    /**
     * @dev Função de segurança para reset do contrato caso não haja votação por 3 meses.
     * Transfere todos os tokens e BNB para o endereço especificado pelo owner.
     * NOTA: Esta função transfere apenas o BNB que está diretamente no contrato.
     * BNBs armazenados em propostas individuais (p.bnbBalance) também estão no contrato,
     * mas se não forem transferidos aqui, os propositores ainda podem sacá-los usando withdraw().
     * @param recipient Endereço que receberá os tokens e BNB
     */
    function resetContract(address recipient) external onlyOwner {
        require(recipient != address(0), "Endereco invalido");
        require(ultimoTimestampVotado > 0, "Nenhuma votacao foi finalizada ainda");
        
        // Verifica se passaram 3 meses desde a última votação finalizada
        require(
            block.timestamp >= ultimoTimestampVotado + seconds3Months,
            "Ainda nao se passaram 3 meses desde a ultima votacao finalizada"
        );

        // Transfere todos os tokens do contrato (inclui tokens não vendidos de propostas)
        uint256 tokenBalance = IToken(tokenAddress).balanceOf(address(this));
        if (tokenBalance > 0) {
            require(
                IToken(tokenAddress).transfer(recipient, tokenBalance),
                "Falha ao transferir tokens"
            );
        }

        // Transfere todo o BNB do contrato
        // Isso inclui BNBs de propostas que ainda não foram sacados pelos propositores
        uint256 bnbBalance = address(this).balance;
        if (bnbBalance > 0) {
            payable(recipient).transfer(bnbBalance);
        }

        emit ContractReset(recipient, tokenBalance, bnbBalance, ultimoTimestampVotado);
    }

    /**
     * @dev Retorna quantos segundos faltam para poder usar resetContract.
     * @return secondsRemaining Número de segundos que faltam (0 se já pode resetar)
     */
    function getSecondsUntilResetAvailable() external view returns (uint256) {
        if (ultimoTimestampVotado == 0) {
            return type(uint256).max; // Nunca poderá resetar se não houve votação
        }
        
        uint256 requiredTimestamp = ultimoTimestampVotado + seconds3Months;
        if (block.timestamp >= requiredTimestamp) {
            return 0;
        }
        return requiredTimestamp - block.timestamp;
    }

    /**
     * @dev Retorna o total de BNB armazenado em todas as propostas.
     * Útil para verificar quanto BNB está "preso" em propostas antes de usar resetContract.
     * @return totalBNBInProposals Soma de todos os bnbBalance das propostas
     */
    function getTotalBNBInProposals() external view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < proposalList.length; i++) {
            Proposal storage p = proposals[proposalList[i]];
            total += p.bnbBalance;
        }
        return total;
    }



    // ====================================================
    // NOVA FUNÇÃO: LISTA DE PROPOSTAS EM ABERTO
    // ====================================================
    function getOpenProposals() external view returns (string[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < proposalList.length; i++) {
            if (!proposals[proposalList[i]].ended) {
                count++;
            }
        }
        string[] memory openProposals = new string[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < proposalList.length; i++) {
            if (!proposals[proposalList[i]].ended) {
                openProposals[j] = proposalList[i];
                j++;
            }
        }
        return openProposals;
    }
}