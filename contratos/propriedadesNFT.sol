// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Interface para o token usado para mintar NFTs
 */
interface IToken {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

/**
 * @title Interface para o contrato dos Guardioes
 * Permite consultar o estado da votacao e usar os mesmos pesos
 */
interface IGuardioes {
    function isVotingOpen() external view returns (bool);
    function presenceRegistrationEndTime() external view returns (uint256);
    function votingEndTime() external view returns (uint256);
    function totalVoters() external view returns (uint256);
    function getQuorumMinimo() external view returns (uint256);
    function registeredTokens(address account) external view returns (uint256);
    function effectiveWeights(address account) external view returns (uint256);
    function weightsCalculated() external view returns (bool);
    function isDirector(address account) external view returns (bool);
    function isguardiaoAtivo(address account) external view returns (bool);
    function getguardioes() external view returns (address[] memory);
}

/**
 * @title Interface para o contrato NFT de votacao
 * Implementada por este contrato para ser consultada pelo contrato dos Guardioes
 */
interface IVotingNFT {
    function getTotalTokensByOwner(address account) external view returns (uint256);
}

/**
 * @title Contrato de NFT de Propriedades
 * Representa propriedades do mundo real com informacoes armazenadas em string.
 * Mantém um saldo virtual de tokens por carteira que é incrementado ao mintar
 * e decrementado ao transferir ou destruir NFTs.
 */
contract PropriedadesNFT is IVotingNFT {
    
    address public owner;
    address public tokenAddress;
    address public guardioesAddress;
    bool public modoTeste;
    
    address public constant CARTEIRA_MAE = 0x1757507B8695aA36caa965351F143a63281e3ea7;
    uint256 public constant TEMPO_INATIVIDADE = 365 days;
    uint256 public constant TEMPO_INATIVIDADE_TESTE = 20 minutes;
    
    // Saldo virtual de tokens por carteira (tokens usados para mintar NFTs)
    mapping(address => uint256) public virtualTokenBalance;
    
    // Ultima atividade registrada por tokenId (timestamp)
    mapping(uint256 => uint256) public lastActivity;
    
    // Contadores
    uint256 public totalSupply;    // NFTs existentes atualmente
    uint256 public nextTokenId;    // Contador monotônico de IDs (nunca decresce)
    
    // Estrutura de um NFT
    struct NFT {
        uint256 tokenId;
        address minter;           // Quem fez o mint original
        address currentOwner;     // Dono atual do NFT (atualizado em transferências)
        string metadata;          // String com informacoes (coordenadas, hash, placa, etc.)
        uint256 tokenAmount;      // Quantidade de tokens usados para mintar
        bool exists;
    }
    
    // Mapeia tokenId para NFT
    mapping(uint256 => NFT) public nfts;
    
    // Array de todos os tokenIds
    uint256[] public tokenIds;
    
    // Controle de pesos (flag apenas - pesos reais vêm do contrato guardioes)
    bool public weightsCalculated;
    
    // Estrutura de proposta de criacao de NFT
    struct CriacaoProposal {
        address proposer;
        string metadata;
        uint256 tokenAmount;
        address destinatario;   // address(0) = venda livre, senao = predestinado
        bool ended;
        bool approved;
        bool minted;            // Indica se o NFT já foi mintado
        uint256 totalYesWeight;
        uint256 totalNoWeight;
        mapping(address => bool) voted;
    }
    
    // Mapeia hash da proposta para sua estrutura
    mapping(string => CriacaoProposal) public criacaoProposals;
    string[] public criacaoProposalList;
    
    // Estrutura de proposta de destruicao de NFT
    struct DestruicaoProposal {
        address proposer;
        uint256 tokenId;
        bool ended;
        bool approved;
        uint256 totalYesWeight;
        uint256 totalNoWeight;
        mapping(address => bool) voted;
    }
    
    // Mapeia tokenId para proposta de destruicao
    mapping(uint256 => DestruicaoProposal) public destruicaoProposals;
    uint256[] public destruicaoProposalList;
    
    // Eventos
    event NFTCriacaoPropostaCriada(
        address indexed proposer,
        string proposalHash,
        string metadata,
        uint256 tokenAmount,
        address destinatario
    );
    event NFTCriacaoVotado(
        address indexed voter,
        string proposalHash,
        bool decisao,
        uint256 peso
    );
    event NFTCriacaoPropostaEncerrada(
        string proposalHash,
        bool aprovada
    );
    event NFTDestruicaoPropostaCriada(
        address indexed proposer,
        uint256 tokenId
    );
    event NFTDestruicaoVotado(
        address indexed voter,
        uint256 tokenId,
        bool decisao,
        uint256 peso
    );
    event NFTDestruicaoPropostaEncerrada(
        uint256 tokenId,
        bool aprovada
    );
    event NFTMintado(
        uint256 indexed tokenId,
        address indexed minter,
        address indexed currentOwner,
        string metadata,
        uint256 tokenAmount
    );
    event NFTDestruido(
        uint256 indexed tokenId,
        address indexed currentOwner,
        uint256 tokenAmount
    );
    event NFTTransferido(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 tokenAmount
    );
    event PesosCalculados();
    event PesosLimpados();
    event AtividadeRegistrada(
        address indexed proprietario,
        uint256[] tokenIdsAtualizados,
        uint256 timestamp
    );
    event NFTRecuperado(
        uint256 indexed tokenId,
        address indexed antigoProprietario,
        address indexed carteiraMae,
        uint256 tokenAmount,
        uint256 tempoInativo
    );
    
    constructor(
        address _tokenAddress,
        address _guardioesAddress,
        bool _modoTeste
    ) {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
        guardioesAddress = _guardioesAddress;
        modoTeste = _modoTeste;
        totalSupply = 0;
        nextTokenId = 1;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Somente o owner pode chamar esta funcao");
        _;
    }
    
    modifier onlyGuardiao() {
        require(IGuardioes(guardioesAddress).isDirector(msg.sender), "Apenas guardioes");
        _;
    }
    
    // ====================================================
    // FUNCOES BASICAS DE NFT
    // ====================================================
    
    /**
     * @dev Retorna o total de tokens virtuais de uma carteira
     * Implementa a interface IVotingNFT para ser consultada pelo contrato dos Guardioes
     */
    function getTotalTokensByOwner(address account) external view override returns (uint256) {
        return virtualTokenBalance[account];
    }
    
    /**
     * @dev Transfere um NFT de um dono para outro.
     * Atualiza o saldo virtual de ambos.
     * @param tokenId ID do NFT a ser transferido
     * @param to Endereco do novo dono
     */
    function transferNFT(uint256 tokenId, address to) external {
        NFT storage nft = nfts[tokenId];
        require(nft.exists, "NFT nao existe");
        require(nft.currentOwner == msg.sender, "Apenas o dono pode transferir");
        require(to != address(0), "Endereco invalido");
        require(to != msg.sender, "Nao pode transferir para si mesmo");
        
        address from = msg.sender;
        uint256 amount = nft.tokenAmount;
        
        // Atualiza saldo virtual
        virtualTokenBalance[from] -= amount;
        virtualTokenBalance[to] += amount;
        
        // Atualiza dono atual e reseta atividade
        nft.currentOwner = to;
        lastActivity[tokenId] = block.timestamp;
        
        emit NFTTransferido(tokenId, from, to, amount);
    }
    
    // ====================================================
    // FUNCOES DE VOTACAO (pesos do contrato guardioes)
    // ====================================================
    
    /**
     * @dev Retorna a porcentagem maxima de voto permitida
     */
    function getAllowedPercentage(uint256 totalVotersCount) internal pure returns (uint256) {
        if (totalVotersCount >= 5 && totalVotersCount <= 9) {
            return 25;
        } else if (totalVotersCount >= 10 && totalVotersCount <= 15) {
            return 20;
        } else if (totalVotersCount >= 16 && totalVotersCount <= 20) {
            return 15;
        } else if (totalVotersCount >= 21) {
            return 10;
        }
        return 100;
    }
    
    /**
     * @dev Simula os pesos de voto de cada guardiao considerando todos presentes
     */
    function simularPesos() external view returns (
        address[] memory guardioesArray,
        uint256[] memory tokensReaisArray,
        uint256[] memory tokensVirtuaisArray,
        uint256[] memory tokensTotaisArray,
        uint256[] memory pesosSimuladosArray
    ) {
        IGuardioes guardioes = IGuardioes(guardioesAddress);
        address[] memory todosGuardioes = guardioes.getguardioes();
        
        uint256 length = todosGuardioes.length;
        guardioesArray = new address[](length);
        tokensReaisArray = new uint256[](length);
        tokensVirtuaisArray = new uint256[](length);
        tokensTotaisArray = new uint256[](length);
        pesosSimuladosArray = new uint256[](length);
        
        uint256 totalTokens = 0;
        for (uint256 i = 0; i < length; i++) {
            address guardiao = todosGuardioes[i];
            guardioesArray[i] = guardiao;
            
            uint256 tokensReais = IToken(tokenAddress).balanceOf(guardiao);
            tokensReaisArray[i] = tokensReais;
            
            uint256 tokensVirtuais = virtualTokenBalance[guardiao];
            tokensVirtuaisArray[i] = tokensVirtuais;
            
            uint256 tokensTotal = tokensReais + tokensVirtuais;
            tokensTotaisArray[i] = tokensTotal;
            totalTokens += tokensTotal;
        }
        
        if (length == 0 || totalTokens == 0) {
            return (guardioesArray, tokensReaisArray, tokensVirtuaisArray, tokensTotaisArray, pesosSimuladosArray);
        }
        
        uint256 allowedPercentage = getAllowedPercentage(length);
        
        for (uint256 i = 0; i < length; i++) {
            pesosSimuladosArray[i] = tokensTotaisArray[i];
        }
        
        for (uint256 round = 0; round < 20; round++) {
            uint256 sumWeights = 0;
            for (uint256 i = 0; i < length; i++) {
                sumWeights += pesosSimuladosArray[i];
            }
            
            uint256 maxVoteWeight = (sumWeights * allowedPercentage) / 100;
            
            uint256 excess = 0;
            uint256 uncappedSum = 0;
            
            for (uint256 i = 0; i < length; i++) {
                uint256 w = pesosSimuladosArray[i];
                
                if (w > maxVoteWeight) {
                    excess += (w - maxVoteWeight);
                    pesosSimuladosArray[i] = maxVoteWeight;
                } else {
                    uncappedSum += w;
                }
            }
            
            if (excess == 0) {
                break;
            }
            
            if (uncappedSum > 0) {
                for (uint256 i = 0; i < length; i++) {
                    uint256 w = pesosSimuladosArray[i];
                    
                    if (w < maxVoteWeight && w > 0) {
                        uint256 parcela = (excess * w) / uncappedSum;
                        pesosSimuladosArray[i] = w + parcela;
                    }
                }
            }
        }
        
        return (guardioesArray, tokensReaisArray, tokensVirtuaisArray, tokensTotaisArray, pesosSimuladosArray);
    }
    
    /**
     * @dev Calcula os pesos efetivos usando o mesmo sistema do contrato guardioes
     */
    function calcularPesos() external onlyGuardiao {
        require(IGuardioes(guardioesAddress).isVotingOpen(), "Votacao nao esta aberta");
        require(
            block.timestamp > IGuardioes(guardioesAddress).presenceRegistrationEndTime(),
            "Registro de presenca ainda aberto"
        );
        require(
            IGuardioes(guardioesAddress).weightsCalculated(),
            "Pesos no contrato guardioes ainda nao foram calculados"
        );
        require(!weightsCalculated, "Pesos ja calculados");
        
        weightsCalculated = true;
        emit PesosCalculados();
    }
    
    /**
     * @dev Limpa os pesos calculados
     */
    function limparPesos() external onlyGuardiao {
        require(!IGuardioes(guardioesAddress).isVotingOpen(), "Nao pode limpar pesos com votacao aberta");
        weightsCalculated = false;
        emit PesosLimpados();
    }
    
    /**
     * @dev Obtem o peso efetivo de um votante (do contrato guardioes)
     */
    function getEffectiveWeight(address voter) internal view returns (uint256) {
        return IGuardioes(guardioesAddress).effectiveWeights(voter);
    }
    
    // ====================================================
    // PROPOSTAS DE CRIACAO DE NFT
    // ====================================================
    
    /**
     * @dev Cria uma proposta de criacao de novo NFT
     */
    function criarPropostaCriacaoNFT(
        string calldata proposalHash,
        string calldata metadata,
        uint256 tokenAmount,
        address destinatario
    ) external onlyGuardiao {
        require(
            IGuardioes(guardioesAddress).isguardiaoAtivo(msg.sender),
            "guardiao deve estar ativo"
        );
        require(
            criacaoProposals[proposalHash].proposer == address(0),
            "Proposta ja existe"
        );
        require(tokenAmount > 0, "Quantidade de tokens deve ser maior que zero");
        
        CriacaoProposal storage p = criacaoProposals[proposalHash];
        p.proposer = msg.sender;
        p.metadata = metadata;
        p.tokenAmount = tokenAmount;
        p.destinatario = destinatario;
        
        criacaoProposalList.push(proposalHash);
        
        emit NFTCriacaoPropostaCriada(msg.sender, proposalHash, metadata, tokenAmount, destinatario);
    }
    
    /**
     * @dev Vota em uma proposta de criacao de NFT
     */
    function votarCriacaoNFT(string calldata proposalHash, bool decisao) external onlyGuardiao {
        IGuardioes guardioes = IGuardioes(guardioesAddress);
        
        require(guardioes.isVotingOpen(), "Votacao fechada");
        require(
            block.timestamp > guardioes.presenceRegistrationEndTime(),
            "Presenca ainda aberta"
        );
        require(
            block.timestamp <= guardioes.votingEndTime(),
            "Periodo de votacao encerrado"
        );
        require(guardioes.isguardiaoAtivo(msg.sender), "guardiao deve estar ativo");
        require(guardioes.registeredTokens(msg.sender) > 0, "Nao registrou presenca");
        
        uint256 quorumMinimo = guardioes.getQuorumMinimo();
        require(guardioes.totalVoters() >= quorumMinimo, "Quorum minimo nao atingido");
        require(guardioes.weightsCalculated(), "Pesos nao calculados no contrato guardioes");
        require(weightsCalculated, "Pesos nao calculados neste contrato");
        
        CriacaoProposal storage p = criacaoProposals[proposalHash];
        require(p.proposer != address(0), "Proposta inexistente");
        require(!p.ended, "Proposta ja encerrada");
        require(!p.voted[msg.sender], "Ja votou");
        
        uint256 effectiveWeight = getEffectiveWeight(msg.sender);
        require(effectiveWeight > 0, "Peso invalido");
        
        p.voted[msg.sender] = true;
        
        if (decisao) {
            p.totalYesWeight += effectiveWeight;
        } else {
            p.totalNoWeight += effectiveWeight;
        }
        
        emit NFTCriacaoVotado(msg.sender, proposalHash, decisao, effectiveWeight);
    }
    
    /**
     * @dev Encerra uma proposta de criacao de NFT
     */
    function encerrarPropostaCriacaoNFT(string calldata proposalHash) external onlyGuardiao {
        IGuardioes guardioes = IGuardioes(guardioesAddress);
        
        require(guardioes.isVotingOpen(), "Nenhuma votacao aberta");
        require(
            block.timestamp > guardioes.votingEndTime(),
            "Periodo de votacao ainda nao terminou"
        );
        
        CriacaoProposal storage p = criacaoProposals[proposalHash];
        require(!p.ended, "Ja encerrada");
        require(p.proposer != address(0), "Proposta inexistente");
        
        p.ended = true;
        
        if (p.totalYesWeight > p.totalNoWeight) {
            p.approved = true;
        }
        
        emit NFTCriacaoPropostaEncerrada(proposalHash, p.approved);
    }
    
    // ====================================================
    // PROPOSTAS DE DESTRUICAO DE NFT
    // ====================================================
    
    /**
     * @dev Cria uma proposta de destruicao de NFT
     */
    function criarPropostaDestruicaoNFT(uint256 tokenId) external onlyGuardiao {
        require(
            IGuardioes(guardioesAddress).isguardiaoAtivo(msg.sender),
            "guardiao deve estar ativo"
        );
        require(nfts[tokenId].exists, "NFT nao existe");
        require(
            destruicaoProposals[tokenId].proposer == address(0),
            "Proposta ja existe"
        );
        
        DestruicaoProposal storage p = destruicaoProposals[tokenId];
        p.proposer = msg.sender;
        p.tokenId = tokenId;
        
        destruicaoProposalList.push(tokenId);
        
        emit NFTDestruicaoPropostaCriada(msg.sender, tokenId);
    }
    
    /**
     * @dev Vota em uma proposta de destruicao de NFT
     */
    function votarDestruicaoNFT(uint256 tokenId, bool decisao) external onlyGuardiao {
        IGuardioes guardioes = IGuardioes(guardioesAddress);
        
        require(guardioes.isVotingOpen(), "Votacao fechada");
        require(
            block.timestamp > guardioes.presenceRegistrationEndTime(),
            "Presenca ainda aberta"
        );
        require(
            block.timestamp <= guardioes.votingEndTime(),
            "Periodo de votacao encerrado"
        );
        require(guardioes.isguardiaoAtivo(msg.sender), "guardiao deve estar ativo");
        require(guardioes.registeredTokens(msg.sender) > 0, "Nao registrou presenca");
        
        uint256 quorumMinimo = guardioes.getQuorumMinimo();
        require(guardioes.totalVoters() >= quorumMinimo, "Quorum minimo nao atingido");
        require(guardioes.weightsCalculated(), "Pesos nao calculados no contrato guardioes");
        require(weightsCalculated, "Pesos nao calculados neste contrato");
        
        DestruicaoProposal storage p = destruicaoProposals[tokenId];
        require(p.proposer != address(0), "Proposta inexistente");
        require(!p.ended, "Proposta ja encerrada");
        require(!p.voted[msg.sender], "Ja votou");
        
        uint256 effectiveWeight = getEffectiveWeight(msg.sender);
        require(effectiveWeight > 0, "Peso invalido");
        
        p.voted[msg.sender] = true;
        
        if (decisao) {
            p.totalYesWeight += effectiveWeight;
        } else {
            p.totalNoWeight += effectiveWeight;
        }
        
        emit NFTDestruicaoVotado(msg.sender, tokenId, decisao, effectiveWeight);
    }
    
    /**
     * @dev Encerra uma proposta de destruicao de NFT e executa a destruicao se aprovada
     */
    function encerrarPropostaDestruicaoNFT(uint256 tokenId) external onlyGuardiao {
        IGuardioes guardioes = IGuardioes(guardioesAddress);
        
        require(guardioes.isVotingOpen(), "Nenhuma votacao aberta");
        require(
            block.timestamp > guardioes.votingEndTime(),
            "Periodo de votacao ainda nao terminou"
        );
        
        DestruicaoProposal storage p = destruicaoProposals[tokenId];
        require(!p.ended, "Ja encerrada");
        require(p.proposer != address(0), "Proposta inexistente");
        
        p.ended = true;
        
        if (p.totalYesWeight > p.totalNoWeight) {
            p.approved = true;
            _destruirNFT(tokenId);
        }
        
        emit NFTDestruicaoPropostaEncerrada(tokenId, p.approved);
    }
    
    // ====================================================
    // FUNCOES INTERNAS
    // ====================================================
    
    /**
     * @dev Funcao interna para destruir um NFT e retornar tokens ao dono atual
     */
    function _destruirNFT(uint256 tokenId) internal {
        NFT storage nft = nfts[tokenId];
        require(nft.exists, "NFT nao existe");
        
        address currentOwnerAddr = nft.currentOwner;
        uint256 tokenAmount = nft.tokenAmount;
        
        // Remove do saldo virtual do dono atual
        require(virtualTokenBalance[currentOwnerAddr] >= tokenAmount, "Saldo virtual insuficiente");
        virtualTokenBalance[currentOwnerAddr] -= tokenAmount;
        
        // Transfere tokens de volta para o dono atual
        require(
            IToken(tokenAddress).transfer(currentOwnerAddr, tokenAmount),
            "Falha ao transferir tokens de volta"
        );
        
        // Remove NFT
        delete nfts[tokenId];
        totalSupply--;
        
        // Remove do array de tokenIds
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenIds[i] == tokenId) {
                tokenIds[i] = tokenIds[tokenIds.length - 1];
                tokenIds.pop();
                break;
            }
        }
        
        emit NFTDestruido(tokenId, currentOwnerAddr, tokenAmount);
    }
    
    // ====================================================
    // FUNCOES DE MINT
    // ====================================================
    
    /**
     * @dev Faz mint de um NFT apos aprovacao da proposta (modo normal)
     */
    function mintNFT(
        string calldata proposalHash
    ) external {
        CriacaoProposal storage p = criacaoProposals[proposalHash];
        require(p.approved, "Proposta nao aprovada");
        require(p.ended, "Proposta ainda nao encerrada");
        require(!p.minted, "NFT ja foi mintado desta proposta");
        
        // Verifica se eh predestinado
        if (p.destinatario != address(0)) {
            require(msg.sender == p.destinatario, "NFT predestinado a outra carteira");
        }
        
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        
        // Transfere tokens do usuario para o contrato
        require(
            IToken(tokenAddress).transferFrom(msg.sender, address(this), p.tokenAmount),
            "Falha ao transferir tokens"
        );
        
        // Cria o NFT
        nfts[tokenId] = NFT({
            tokenId: tokenId,
            minter: msg.sender,
            currentOwner: msg.sender,
            metadata: p.metadata,
            tokenAmount: p.tokenAmount,
            exists: true
        });
        
        tokenIds.push(tokenId);
        totalSupply++;
        
        // Marca como mintado
        p.minted = true;
        
        // Incrementa saldo virtual e registra atividade
        virtualTokenBalance[msg.sender] += p.tokenAmount;
        lastActivity[tokenId] = block.timestamp;
        
        emit NFTMintado(tokenId, msg.sender, msg.sender, p.metadata, p.tokenAmount);
    }
    
    /**
     * @dev Faz mint de um NFT diretamente (apenas em modo teste, apenas owner)
     */
    function mintNFTTeste(
        string calldata metadata,
        uint256 tokenAmount,
        address to
    ) external onlyOwner {
        require(modoTeste, "Modo teste desativado");
        require(to != address(0), "Endereco invalido");
        require(tokenAmount > 0, "Quantidade deve ser maior que zero");
        
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        
        // Transfere tokens do owner para o contrato
        require(
            IToken(tokenAddress).transferFrom(msg.sender, address(this), tokenAmount),
            "Falha ao transferir tokens"
        );
        
        // Cria o NFT
        nfts[tokenId] = NFT({
            tokenId: tokenId,
            minter: to,
            currentOwner: to,
            metadata: metadata,
            tokenAmount: tokenAmount,
            exists: true
        });
        
        tokenIds.push(tokenId);
        totalSupply++;
        
        // Incrementa saldo virtual do destinatario e registra atividade
        virtualTokenBalance[to] += tokenAmount;
        lastActivity[tokenId] = block.timestamp;
        
        emit NFTMintado(tokenId, to, to, metadata, tokenAmount);
    }
    
    // ====================================================
    // CHECKPOINT / PROVA DE VIDA
    // ====================================================
    
    /**
     * @dev Retorna o tempo de inatividade necessario de acordo com o modo atual
     */
    function getTempoInatividade() public view returns (uint256) {
        return modoTeste ? TEMPO_INATIVIDADE_TESTE : TEMPO_INATIVIDADE;
    }
    
    /**
     * @dev Registra atividade (prova de vida) para todos os NFTs do caller.
     * O proprietario pode chamar a qualquer momento.
     */
    function registrarAtividade() external {
        uint256 count = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (nfts[tokenIds[i]].currentOwner == msg.sender) {
                count++;
            }
        }
        require(count > 0, "Voce nao possui nenhum NFT");
        
        uint256[] memory atualizados = new uint256[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tid = tokenIds[i];
            if (nfts[tid].currentOwner == msg.sender) {
                lastActivity[tid] = block.timestamp;
                atualizados[j] = tid;
                j++;
            }
        }
        
        emit AtividadeRegistrada(msg.sender, atualizados, block.timestamp);
    }
    
    /**
     * @dev Recupera um NFT inativo, transferindo-o para a carteira mae do Fraguismo.
     * Qualquer pessoa pode chamar esta funcao desde que o NFT esteja inativo
     * pelo tempo necessario (365 dias, ou 2 horas em modo teste).
     * O saldo virtual eh transferido do antigo dono para a carteira mae.
     */
    function recuperarNFT(uint256 tokenId) external {
        NFT storage nft = nfts[tokenId];
        require(nft.exists, "NFT nao existe");
        require(nft.currentOwner != CARTEIRA_MAE, "NFT ja esta na carteira mae");
        
        uint256 tempoNecessario = getTempoInatividade();
        uint256 ultimaAtividade = lastActivity[tokenId];
        require(ultimaAtividade > 0, "NFT sem registro de atividade");
        
        uint256 tempoInativo = block.timestamp - ultimaAtividade;
        require(
            tempoInativo >= tempoNecessario,
            "NFT ainda nao atingiu o tempo de inatividade necessario"
        );
        
        address antigoProprietario = nft.currentOwner;
        uint256 amount = nft.tokenAmount;
        
        // Transfere saldo virtual do antigo dono para a carteira mae
        virtualTokenBalance[antigoProprietario] -= amount;
        virtualTokenBalance[CARTEIRA_MAE] += amount;
        
        // Atualiza dono e reseta atividade
        nft.currentOwner = CARTEIRA_MAE;
        lastActivity[tokenId] = block.timestamp;
        
        emit NFTRecuperado(tokenId, antigoProprietario, CARTEIRA_MAE, amount, tempoInativo);
        emit NFTTransferido(tokenId, antigoProprietario, CARTEIRA_MAE, amount);
    }
    
    // ====================================================
    // FUNCOES DE CONSULTA
    // ====================================================
    
    /**
     * @dev Retorna informacoes de um NFT
     */
    function getNFT(uint256 tokenId) external view returns (
        address minter,
        address currentOwnerAddr,
        string memory metadata,
        uint256 tokenAmount,
        bool exists
    ) {
        NFT storage nft = nfts[tokenId];
        return (nft.minter, nft.currentOwner, nft.metadata, nft.tokenAmount, nft.exists);
    }
    
    /**
     * @dev Retorna todos os tokenIds
     */
    function getAllTokenIds() external view returns (uint256[] memory) {
        return tokenIds;
    }
    
    /**
     * @dev Retorna todos os tokenIds de um determinado dono
     * @param ownerAddr Endereco do dono
     * @return Array de tokenIds pertencentes ao dono
     */
    function getNFTsByOwner(address ownerAddr) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (nfts[tokenIds[i]].currentOwner == ownerAddr) {
                count++;
            }
        }
        uint256[] memory result = new uint256[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (nfts[tokenIds[i]].currentOwner == ownerAddr) {
                result[j] = tokenIds[i];
                j++;
            }
        }
        return result;
    }
    
    /**
     * @dev Retorna detalhes de uma proposta de criacao
     */
    function getCriacaoProposalDetails(string calldata proposalHash) external view returns (
        address proposer,
        string memory metadata,
        uint256 tokenAmount,
        address destinatario,
        bool ended,
        bool approved,
        bool minted,
        uint256 totalYesWeight,
        uint256 totalNoWeight
    ) {
        CriacaoProposal storage p = criacaoProposals[proposalHash];
        require(p.proposer != address(0), "Proposta inexistente");
        return (
            p.proposer,
            p.metadata,
            p.tokenAmount,
            p.destinatario,
            p.ended,
            p.approved,
            p.minted,
            p.totalYesWeight,
            p.totalNoWeight
        );
    }
    
    /**
     * @dev Retorna detalhes de uma proposta de destruicao
     */
    function getDestruicaoProposalDetails(uint256 tokenId) external view returns (
        address proposer,
        bool ended,
        bool approved,
        uint256 totalYesWeight,
        uint256 totalNoWeight
    ) {
        DestruicaoProposal storage p = destruicaoProposals[tokenId];
        require(p.proposer != address(0), "Proposta inexistente");
        return (
            p.proposer,
            p.ended,
            p.approved,
            p.totalYesWeight,
            p.totalNoWeight
        );
    }
    
    /**
     * @dev Retorna lista de propostas de criacao abertas
     */
    function getPropostasCriacaoAbertas() external view returns (string[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < criacaoProposalList.length; i++) {
            if (!criacaoProposals[criacaoProposalList[i]].ended) {
                count++;
            }
        }
        string[] memory abertas = new string[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < criacaoProposalList.length; i++) {
            if (!criacaoProposals[criacaoProposalList[i]].ended) {
                abertas[j] = criacaoProposalList[i];
                j++;
            }
        }
        return abertas;
    }
    
    /**
     * @dev Retorna lista de propostas de destruicao abertas
     */
    function getPropostasDestruicaoAbertas() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < destruicaoProposalList.length; i++) {
            if (!destruicaoProposals[destruicaoProposalList[i]].ended) {
                count++;
            }
        }
        uint256[] memory abertas = new uint256[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < destruicaoProposalList.length; i++) {
            if (!destruicaoProposals[destruicaoProposalList[i]].ended) {
                abertas[j] = destruicaoProposalList[i];
                j++;
            }
        }
        return abertas;
    }
    
    /**
     * @dev Retorna informacoes completas de todos os NFTs existentes
     */
    function getAllNFTsInfo() external view returns (
        uint256[] memory ids,
        address[] memory minters,
        address[] memory owners,
        uint256[] memory amounts,
        uint256[] memory ultimasAtividades
    ) {
        uint256 length = tokenIds.length;
        ids = new uint256[](length);
        minters = new address[](length);
        owners = new address[](length);
        amounts = new uint256[](length);
        ultimasAtividades = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            uint256 tid = tokenIds[i];
            NFT storage nft = nfts[tid];
            ids[i] = tid;
            minters[i] = nft.minter;
            owners[i] = nft.currentOwner;
            amounts[i] = nft.tokenAmount;
            ultimasAtividades[i] = lastActivity[tid];
        }
        
        return (ids, minters, owners, amounts, ultimasAtividades);
    }
    
    /**
     * @dev Retorna informacoes de atividade de um NFT especifico
     */
    function getAtividadeNFT(uint256 tokenId) external view returns (
        address proprietario,
        uint256 ultimaAtividade,
        uint256 tempoInativo,
        bool recuperavel
    ) {
        NFT storage nft = nfts[tokenId];
        require(nft.exists, "NFT nao existe");
        
        proprietario = nft.currentOwner;
        ultimaAtividade = lastActivity[tokenId];
        tempoInativo = block.timestamp - ultimaAtividade;
        recuperavel = (tempoInativo >= getTempoInatividade()) && (proprietario != CARTEIRA_MAE);
    }
    
    /**
     * @dev Retorna todos os NFTs que estao recuperaveis por inatividade
     */
    function getNFTsRecuperaveis() external view returns (
        uint256[] memory idsRecuperaveis,
        address[] memory proprietarios,
        uint256[] memory temposInativos
    ) {
        uint256 tempoNecessario = getTempoInatividade();
        
        uint256 count = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tid = tokenIds[i];
            NFT storage nft = nfts[tid];
            if (nft.currentOwner != CARTEIRA_MAE && 
                lastActivity[tid] > 0 &&
                (block.timestamp - lastActivity[tid]) >= tempoNecessario) {
                count++;
            }
        }
        
        idsRecuperaveis = new uint256[](count);
        proprietarios = new address[](count);
        temposInativos = new uint256[](count);
        
        uint256 j = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tid = tokenIds[i];
            NFT storage nft = nfts[tid];
            uint256 inativo = block.timestamp - lastActivity[tid];
            if (nft.currentOwner != CARTEIRA_MAE && 
                lastActivity[tid] > 0 &&
                inativo >= tempoNecessario) {
                idsRecuperaveis[j] = tid;
                proprietarios[j] = nft.currentOwner;
                temposInativos[j] = inativo;
                j++;
            }
        }
    }
}
