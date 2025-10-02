import { walletConnection } from "../web3/wallet.js";
import { contratoEndereco, fragaTokenAddress } from "./mercadoSecundarioAddress.js";
import { abi, tokenABI } from "./abi.js";
import { lerContrato } from "./utils.js";

document.addEventListener('DOMContentLoaded', async () => {
    const btnIniciarNegociacao = document.getElementById("iniciarNegociacao");
    const statusEnum = {
        0: "Pendente",
        1: "Em Negociação",
        2: "Completa",
        3: "Disputada",
        4: "Revertida"
    };

    async function preencherTabelaOrdens() {
        try {
            const resposta = await lerContrato(
                "0xAA71fBb9bFaaE91a9AcA3EA742964db78aEd1D2e",
                "getTodasOrdens",
                abi,
                [] // sem argumentos
            );

            const {
                vendedores,
                quantidades,
                valores,
                compradores,
                garantias,
                blocos,
                status
            } = resposta;

            const tbody = document.getElementById("corpoTabelaOrdens");
            tbody.innerHTML = ""; // Limpa a tabela

            for (let i = 0; i < vendedores.length; i++) {
                const linha = document.createElement("tr");

                linha.innerHTML = `
          <td>${i}</td>
          <td title="${vendedores[i]}">${abreviarEndereco(vendedores[i])}</td>
          <td>${(Number(quantidades[i]) / 1e18).toFixed(4)}</td>
          <td>R$ ${valores[i]}</td>
          <td>${statusEnum[status[i]] || "Desconhecido"}</td>
          <td title="${compradores[i]}">${abreviarEndereco(compradores[i])}</td>
          <td>${blocos[i]}</td>
          <td>${(Number(garantias[i]) / 1e18).toFixed(6)} BNB</td>
          <td><button class="btn btn-primary btn-sm" onclick="preencherInputOrdem(${i})">Comprar</button></td>
          <td><button class="btn btn-danger btn-sm" onclick="preencherDisputa(${i})">Disputar</button></td>
           <td><button class="btn btn-warning btn-sm" onclick="preencherArbitro(${i})">Arbitrar</button></td>
        `;

                tbody.appendChild(linha);
            }

        } catch (error) {
            console.error("Erro ao preencher tabela de ordens:", error);
            alert("Erro ao consultar as ordens.");
        }
    }

    async function iniciarNegociacao() {
        const valortaxa = 0.3;
        const id = document.getElementById("ordemNegociar").value;        
        try {
            await writeWeb3Contract2(contratoEndereco, "iniciarNegociacao", abi, [id], valortaxa);
        } catch (error) {
            alert("Erro ao iniciar negociação.");
        }
    }

    function abreviarEndereco(endereco) {
        if (!endereco || endereco === "0x0000000000000000000000000000000000000000") return "-";
        return `${endereco.slice(0, 8)}...${endereco.slice(-6)}`;
    }

    await preencherTabelaOrdens();
    btnIniciarNegociacao.addEventListener('click', iniciarNegociacao);
});