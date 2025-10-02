import { walletConnection } from "../web3/wallet.js";
import { envioDaGracaABI } from "./envio_graca_abi.js";
import { envioDaGracaAddress } from "./graca_addresses.js";
import { readEthersContract } from "../web3/initialize.js";


document.addEventListener('DOMContentLoaded', () => {
    const btnConsultaSaldoUSDT = document.getElementById("btnConsultaSaldoUSDT");
    const btnConsultarPorcentagens = document.getElementById("btnConsultarPorcentagens");
    const btnConsultaStake = document.getElementById("consultarStake");
    const btnConsultarStakersAtivos = document.getElementById("consultarStakersAtivos");
    const btnConsultarStatusVotacao = document.getElementById("consultarStatusVotacao");

    async function consultarSaldoUSDT() {
        try {
            if (walletConnection.checkConnection()) {
                const saldo = await readEthersContract(walletConnection.walletAddress, "getSaldoUSDT", envioDaGracaABI, []);
                document.getElementById("saldoUSDTResult").innerHTML = "Saldo USDT: " + formatTokenAmount(saldo) + " USDT";
            }
        } catch (error) {
            console.error("Erro ao consultar saldo USDT:", error);
            alert("Erro ao consultar saldo USDT.");
        }
    }

    async function consultarPorcentagens() {
        try {
            const porcentagens = await readEthersContract(envioDaGracaAddress, "getPorcentagens", envioDaGracaABI, []);
            document.getElementById("porcentagensResult").innerHTML =
                "Porcentagem da Graça: " + porcentagens[0] + "% (para stakers)<br>" +
                "Porcentagem de Gastos: " + porcentagens[1] + "% (para carteira_de_gastos)";
        } catch (error) {
            console.error("Erro ao consultar porcentagens:", error);
            alert("Erro ao consultar porcentagens.");
        }
    }

    const consultaStake = async () => {
        try {
            const address = document.getElementById("consultaStakeAddress").value.trim() || walletConnection.walletAddress;
            const stakeInfo = await readEthersContract(envioDaGracaAddress, "getStakeInfo", envioDaGracaABI, [address]);
            let resultado = "Endereço: " + address + "<br>";
            resultado += "Quantidade: " + formatTokenAmount(stakeInfo[0]) + " FRAGA<br>";
            resultado += "Bloco Final: " + stakeInfo[1] + "<br>";
            resultado += "Status: " + (stakeInfo[2] ? "Ativo" : "Inativo");

            document.getElementById("stakeInfoResult").innerHTML = resultado;
        } catch (error) {
            console.error("Erro ao consultar stake:", error);
            alert("Erro ao consultar stake.");
        }
    }

    const consultarStakersAtivos = async () => {
        try {
            const stakers = await readEthersContract(envioDaGracaAddress, "getStakersAtivos", envioDaGracaABI, []);
            let result = "Stakers Ativos:<br>";
            if (stakers.length === 0) {
                result += "Nenhum staker ativo no momento.";
            } else {
                for (let i = 0; i < stakers.length; i++) {
                    result += `${i + 1}. ${stakers[i]}<br>`;
                }
            }
            document.getElementById("stakersAtivosResult").innerHTML = result;
        } catch (error) {
            console.error("Erro ao consultar stakers ativos:", error);
            alert("Erro ao consultar stakers ativos.");
        }
    }

    const consultarStatusVotacao = async () => {
        try {
            const votacaoInfo = await readEthersContract(envioDaGracaAddress, "getVotacaoInfo", envioDaGracaABI, []);
            let resultado = "Votação Aberta: " + (votacaoInfo[0] ? "Sim" : "Não") + "<br>";
            resultado += "Nova Porcentagem Proposta: " + votacaoInfo[1] + "%<br>";
            resultado += "Peso Total Votos Sim: " + formatTokenAmount(votacaoInfo[2]) + "<br>";
            resultado += "Peso Total Votos Não: " + formatTokenAmount(votacaoInfo[3]) + "<br>";
            resultado += "Finalizada: " + (votacaoInfo[4] ? "Sim" : "Não") + "<br>";
            resultado += "Aprovada: " + (votacaoInfo[5] ? "Sim" : "Não") + "<br>";
            resultado += "Blocos Restantes: " + votacaoInfo[6];

            document.getElementById("votacaoStatusResult").innerHTML = resultado;
        } catch (error) {
            console.error("Erro ao consultar status da votação:", error);
            alert("Erro ao consultar status da votação.");
        }
    }

    function formatTokenAmount(amount) {
        return (Number(amount) / 1e18).toFixed(2);
    }

    btnConsultarStatusVotacao.addEventListener('click', consultarStatusVotacao);
    btnConsultarPorcentagens.addEventListener('click', consultarPorcentagens);
    btnConsultaSaldoUSDT.addEventListener('click', consultarSaldoUSDT);
    btnConsultaStake.addEventListener('click', consultaStake);
    btnConsultarStakersAtivos.addEventListener('click', consultarStakersAtivos);
});

