import { envioDaGracaABI } from './envio_graca_abi.js';

document.addEventListener('DOMContentLoaded', async () => {
    const btnAlterarCarteiraGastos = document.getElementById("alterarCarteiraGastos");
    const btnIniciarVotacao = document.getElementById("iniciarVotacao");

    const alterarCarteiraGastos = async () => {
        try {
            const novaCarteira = document.getElementById("novaCarteiraGastos").value.trim();
            if (!novaCarteira || !ethers.utils.isAddress(novaCarteira)) {
                alert("Por favor, informe um endereço de carteira válido.");
                return;
            }

            const txHash = await writeEthersContract(envioDaGracaAddress, "setCarteiraGastos", envioDaGracaABI, [novaCarteira]);
            alert("Carteira de gastos alterada com sucesso! Tx: " + txHash);
        } catch (error) {
            console.error("Erro ao alterar carteira de gastos:", error);
            alert("Erro ao alterar carteira de gastos. Verifique se você é o owner do contrato.");
        }
    }

    const iniciarVotacao = async () => {
        try {
            const novaPorcentagem = document.getElementById("novaPorcentagem").value.trim();
            if (!novaPorcentagem || isNaN(novaPorcentagem) || parseFloat(novaPorcentagem) < 1 || parseFloat(novaPorcentagem) > 99) {
                alert("Por favor, informe uma porcentagem válida entre 1 e 99.");
                return;
            }

            const txHash = await writeEthersContract(envioDaGracaAddress, "iniciarVotacao", envioDaGracaABI, [novaPorcentagem]);
            alert("Votação iniciada com sucesso! Tx: " + txHash);
        } catch (error) {
            console.error("Erro ao iniciar votação:", error);
            alert("Erro ao iniciar votação. Verifique se você é o owner do contrato.");
        }
    }

    btnAlterarCarteiraGastos.addEventListener('click', alterarCarteiraGastos);
    btnIniciarVotacao.addEventListener('click', iniciarVotacao);
});