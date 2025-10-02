import { contratoEndereco } from "./mercadoSecundarioAddress.js";
import { abi } from "./abi.js";
import { writeEthersContract } from "../web3/initialize.js";

document.addEventListener("DOMContentLoaded", async () => {
    const btnConfirmaPagamento = document.getElementById("confirmaPagamento");
    const btnReverterTransacao = document.getElementById("reverterTransacao");

    async function confirmarPagamento() {
        const id = document.getElementById("ordemConfirma").value;
        try {
            const hashOperacao = await writeEthersContract(contratoEndereco, "arbitroConfirmaPagamento", abi, [id]);
            alert("Pagamento confirmado com sucesso!\n" + hashOperacao);
        } catch (error) {
            alert("Erro ao confirmar pagamento.", error);
        }
    }

    async function reverterTransacao() {
        const id = document.getElementById("ordemReverte").value;
        try {
            const hashOperacao = await writeEthersContract(contratoEndereco, "arbitroReverteTransacao", abi, [id]);
            alert("Transação revertida com sucesso!\n" + hashOperacao);
        } catch (error) {
            alert("Erro ao reverter transação", error);
        }
    }

    btnConfirmaPagamento.addEventListener('click', confirmarPagamento);
    btnReverterTransacao.addEventListener('click', reverterTransacao);
});

