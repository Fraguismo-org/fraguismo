<<<<<<< HEAD
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
=======
document.addEventListener('DOMContentLoaded', async () => {
    const btnAbrirDisputaComprador = document.getElementById("abrirDisputaComprador");
    const btnAbrirDisputa = document.getElementById("abrirDisputa");

    async function abrirDisputa() {
        const id = document.getElementById("ordemRecebidaComprador").value;
        try {
            await writeWeb3Contract(contratoEndereco, "abrirDisputa", abi, [id]);
        } catch (error) {
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
            alert("Erro ao abrir disputa (comprador)");
        }
    }

<<<<<<< HEAD
    btnAbrirDisputaComprador.addEventListener('click', abrirDisputaComprador);
    btnAbrirDisputaVendedor.addEventListener('click', abrirDisputaVendedor);
=======
    async function abrirDisputaComprador() {
        const id = document.getElementById("ordemRecebidaVendedor").value;
        try {
            await writeWeb3Contract(contratoEndereco, "abrirDisputaComprador", abi, [id]);
        } catch (error) {
            alert("Erro ao abrir disputa (vendedor)");
        }
    }

    btnAbrirDisputaComprador.addEventListener('click', abrirDisputaComprador);
    btnAbrirDisputa.addEventListener('click', abrirDisputa);
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
});