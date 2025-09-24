document.addEventListener('DOMContentLoaded', async () => {
    const btnAbrirDisputaComprador = document.getElementById("abrirDisputaComprador");
    const btnAbrirDisputa = document.getElementById("abrirDisputa");

    async function abrirDisputa() {
        const id = document.getElementById("ordemRecebidaComprador").value;
        try {
            await writeWeb3Contract(contratoEndereco, "abrirDisputa", abi, [id]);
        } catch (error) {
            alert("Erro ao abrir disputa (comprador)");
        }
    }

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
});