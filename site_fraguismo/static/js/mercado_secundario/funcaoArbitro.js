import { contratoEndereco } from "./mercadoSecundarioAddress.js";
import { abi } from "./abi.js";

document.addEventListener("DOMContentLoaded", async () => {
    const btnConfirmaPagamento = document.getElementById("confirmaPagamento");
    const btnReverterTransacao = document.getElementById("reverterTransacao");

    async function confirmarPagamento() {
        const id = document.getElementById("ordemConfirma").value;
        try {

            await writeWeb3Contract(contratoEndereco, "arbitroConfirmaPagamento", abi, [id]);
        } catch (error) {
            alert("Erro ao confirmar pagamento.", error);
        }
    }

    async function reverterTransacao() {
        const id = document.getElementById("ordemReverte").value;
        try {
            await writeWeb3Contract(contratoEndereco, "arbitroReverteTransacao", abi, [id]);
        } catch (error) {
            alert("Erro ao reverter transação", error);
        }
    }

    btnConfirmaPagamento.addEventListener('click', confirmarPagamento);
    btnReverterTransacao.addEventListener('click', reverterTransacao);
});

