/**
 *Submitted for verification at polygonscan.com on 2026-02-20
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address from, address to, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
}

contract VendaComGarantia {
    IERC20 public token;
    address public arbitro;
    uint256 public taxaMultiplicadora = 3;
    mapping(address => uint256[]) public ordensPorVendedor;

    enum Status { Pendente, EmNegociacao, Completa, Disputada, Revertida }

    struct Ordem {
        address vendedor;
        uint256 quantidade;
        uint256 valorEmBRL;
        address comprador;
        uint256 garantia; // em BNB
        uint256 blocoInicial;
        Status status;
    }

    uint256 public ordemCount;
    mapping(uint256 => Ordem) public ordens;

    event NovaOrdem(uint256 id, address vendedor, uint256 quantidade, uint256 valorBRL);
    event NegociacaoIniciada(uint256 id, address comprador, uint256 garantia);
    event OrdemCompleta(uint256 id);
    event OrdemDisputada(uint256 id);
    event OrdemRevertida(uint256 id);
    event OrdemConfirmadaPeloArbitro(uint256 id);

    modifier onlyArbitro() {
        require(msg.sender == arbitro, "Apenas o arbitro pode fazer isso");
        _;
    }

    constructor(IERC20 _token) {
        token = _token;
        arbitro = msg.sender;
    }

    function criarOrdem(uint256 quantidade, uint256 valorEmBRL) external returns (uint256) {
        require(quantidade > 0, "Quantidade invalida");

        token.transferFrom(msg.sender, address(this), quantidade);

        ordens[ordemCount] = Ordem({
            vendedor: msg.sender,
            quantidade: quantidade,
            valorEmBRL: valorEmBRL,
            comprador: address(0),
            garantia: 0,
            blocoInicial: 0,
            status: Status.Pendente
        });

        ordensPorVendedor[msg.sender].push(ordemCount);

        emit NovaOrdem(ordemCount, msg.sender, quantidade, valorEmBRL);
        ordemCount++;

        return ordemCount - 1;
    }

    function getOrdensDoVendedor(address vendedor) external view returns (uint256[] memory) {
        return ordensPorVendedor[vendedor];
    }

    /// 🔹 Função para retornar TODAS as ordens
    function getTodasOrdens() external view returns (
        address[] memory vendedores,
        uint256[] memory quantidades,
        uint256[] memory valores,
        address[] memory compradores,
        uint256[] memory garantias,
        uint256[] memory blocos,
        Status[] memory statusList
    ) {
        vendedores = new address[](ordemCount);
        quantidades = new uint256[](ordemCount);
        valores = new uint256[](ordemCount);
        compradores = new address[](ordemCount);
        garantias = new uint256[](ordemCount);
        blocos = new uint256[](ordemCount);
        statusList = new Status[](ordemCount);

        for (uint256 i = 0; i < ordemCount; i++) {
            Ordem storage o = ordens[i];
            vendedores[i] = o.vendedor;
            quantidades[i] = o.quantidade;
            valores[i] = o.valorEmBRL;
            compradores[i] = o.comprador;
            garantias[i] = o.garantia;
            blocos[i] = o.blocoInicial;
            statusList[i] = o.status;
        }
    }

    function iniciarNegociacao(uint256 id) external payable {
        Ordem storage ordem = ordens[id];
        require(ordem.status == Status.Pendente, "Ordem invalida");
        require(msg.value > 0, "Taxa de garantia obrigatoria");

        uint256 taxa = tx.gasprice * taxaMultiplicadora;
        require(msg.value >= taxa, "Taxa de garantia insuficiente");

        ordem.comprador = msg.sender;
        ordem.garantia = msg.value;
        ordem.status = Status.EmNegociacao;
        ordem.blocoInicial = block.number;

        emit NegociacaoIniciada(id, msg.sender, msg.value);
    }

    function marcarComoCompleta(uint256 id) external {
        Ordem storage ordem = ordens[id];
        require(msg.sender == ordem.vendedor, "Apenas o vendedor pode confirmar");
        require(ordem.status == Status.EmNegociacao, "Status invalido");

        ordem.status = Status.Completa;

        payable(ordem.comprador).transfer(ordem.garantia);
        token.transfer(ordem.comprador, ordem.quantidade);

        emit OrdemCompleta(id);
    }

    function abrirDisputa(uint256 id) external {
        Ordem storage ordem = ordens[id];
        require(msg.sender == ordem.vendedor, "Apenas o vendedor pode abrir disputa");
        require(ordem.status == Status.EmNegociacao, "Status invalido");
        require(block.number >= ordem.blocoInicial + 300, "Aguardando mais blocos");

        ordem.status = Status.Disputada;

        emit OrdemDisputada(id);
    }

    function arbitroConfirmaPagamento(uint256 id) external onlyArbitro {
        Ordem storage ordem = ordens[id];
        require(ordem.status == Status.Disputada, "Status invalido");

        ordem.status = Status.Completa;

        payable(ordem.comprador).transfer(ordem.garantia);
        token.transfer(ordem.comprador, ordem.quantidade);

        emit OrdemConfirmadaPeloArbitro(id);
    }

    function arbitroReverteTransacao(uint256 id) external onlyArbitro {
        Ordem storage ordem = ordens[id];
        require(ordem.status == Status.Disputada, "Status invalido");

        ordem.status = Status.Revertida;

        uint256 metade = ordem.garantia / 2;
        payable(ordem.vendedor).transfer(metade);
        payable(arbitro).transfer(ordem.garantia - metade);

        token.transfer(ordem.vendedor, ordem.quantidade);

        emit OrdemRevertida(id);
    }
}