import { contratoEndereco } from "./mercadoSecundarioAddress.js";
import { abi } from "./abi.js";
<<<<<<< HEAD
import { writeEthersContract } from "../web3/initialize.js";
=======
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98

document.addEventListener("DOMContentLoaded", async () => {
    const btnConfirmaPagamento = document.getElementById("confirmaPagamento");
    const btnReverterTransacao = document.getElementById("reverterTransacao");

    async function confirmarPagamento() {
        const id = document.getElementById("ordemConfirma").value;
        try {
<<<<<<< HEAD
            const hashOperacao = await writeEthersContract(contratoEndereco, "arbitroConfirmaPagamento", abi, [id]);
            alert("Pagamento confirmado com sucesso!\n" + hashOperacao);
=======

            await writeWeb3Contract(contratoEndereco, "arbitroConfirmaPagamento", abi, [id]);
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
        } catch (error) {
            alert("Erro ao confirmar pagamento.", error);
        }
    }

    async function reverterTransacao() {
        const id = document.getElementById("ordemReverte").value;
        try {
<<<<<<< HEAD
            const hashOperacao = await writeEthersContract(contratoEndereco, "arbitroReverteTransacao", abi, [id]);
            alert("Transação revertida com sucesso!\n" + hashOperacao);
=======
            await writeWeb3Contract(contratoEndereco, "arbitroReverteTransacao", abi, [id]);
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
        } catch (error) {
            alert("Erro ao reverter transação", error);
        }
    }

    btnConfirmaPagamento.addEventListener('click', confirmarPagamento);
    btnReverterTransacao.addEventListener('click', reverterTransacao);
});

