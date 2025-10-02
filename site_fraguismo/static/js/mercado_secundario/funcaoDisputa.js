import { contratoEndereco } from "./mercadoSecundarioAddress.js";
import { abi } from "./abi.js";
import { writeEthersContract } from "../web3/initialize.js";

document.addEventListener('DOMContentLoaded', async () => {
    const btnAbrirDisputaComprador = document.getElementById("abrirDisputaComprador");
    const btnAbrirDisputaVendedor = document.getElementById("abrirDisputaVendedor");

    async function abrirDisputaVendedor() {
        const id = document.getElementById("ordemRecebidaVendedor").value;
        try {
            await writeEthersContract(contratoEndereco, "abrirDisputa", abi, [id]);
        } catch (error) {
            if (error.message && error.message.includes("Only the buyer can open a dispute")) {
                alert("Apenas o comprador pode abrir uma disputa para esta ordem.");
                return;
            }
            if (error.code === 'ACTION_REJECTED') {
                alert("Ação rejeitada pelo usuário.");
                return;
            }
            alert("Erro ao abrir disputa (vendedor)");
        }
    }

    async function abrirDisputaComprador() {
        const id = document.getElementById("ordemRecebidaComprador").value;
        try {
            await writeEthersContract(contratoEndereco, "abrirDisputaComprador", abi, [id]);
        } catch (error) {
            if (error.message && error.message.includes("Only the buyer can open a dispute")) {
                alert("Apenas o comprador pode abrir uma disputa para esta ordem.");
                return;
            }
            if (error.code === 'ACTION_REJECTED') {
                alert("Ação rejeitada pelo usuário.");
                return;
            }
            alert("Erro ao abrir disputa (comprador)");
        }
    }

    btnAbrirDisputaComprador.addEventListener('click', abrirDisputaComprador);
    btnAbrirDisputaVendedor.addEventListener('click', abrirDisputaVendedor);
});