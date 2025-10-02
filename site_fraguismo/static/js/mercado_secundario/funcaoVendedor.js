import { walletConnection } from "../web3/wallet.js";
import { contratoEndereco, fragaTokenAddress } from "./mercadoSecundarioAddress.js";
import { abi, tokenABI } from "./abi.js";
<<<<<<< HEAD
import { lerContrato } from "./utils.js";
import { writeEthersContract } from "../web3/initialize.js";
import { listarOrdensDoVendedor } from "./utils.js";

document.addEventListener('DOMContentLoaded', async () => {
    const valorGarantia = 0.01;
    document.getElementById("taxaGarantia").innerText = `Taxa de garantia:  ${valorGarantia} ETH`;
=======
import { lerContrato, listarOrdensDoVendedor } from "./utils.js";

document.addEventListener('DOMContentLoaded', async () => {
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
    const btnCriarOrdem = document.getElementById("criarOrdem");
    const btnMarcarCompleta = document.getElementById("marcarCompleta");

    async function criarOrdem() {
        try {
<<<<<<< HEAD
            const quantidade = document.getElementById("quantidade").value.trim();
            const valorBRL = document.getElementById("valorBRL").value.trim();
            const valorDecimal = valorBRL.replace('.', '').replace(',', '.') * 100;
            const quantidadeWei = walletConnection.ethers.parseUnits(quantidade, 18);
=======
            const q = document.getElementById("quantidade").value.trim();
            const v = document.getElementById("valorBRL").value.trim();
            const quantidadeWei = walletConnection.ethers.parseUnits(q, 18);
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98

            // Checar allowance
            const allowance = await lerContrato(
                fragaTokenAddress,
                "allowance",
                tokenABI,
                [walletConnection.address, contratoEndereco]
            );

            if (BigInt(allowance) < BigInt(quantidadeWei)) {
                alert("Permitindo o contrato movimentar os tokens...");
<<<<<<< HEAD
                const txApprove = await writeEthersContract(
=======
                const txApprove = await writeWeb3Contract(
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
                    fragaTokenAddress,
                    "approve",
                    tokenABI,
                    [contratoEndereco, quantidadeWei]
                );
                alert("Approve realizado. Aguardando confirmação para criar a ordem...");
            }

<<<<<<< HEAD
            const txHash = await writeEthersContract(
                contratoEndereco,
                "criarOrdem",
                abi,
                [quantidadeWei.toString(), valorDecimal],
                valorGarantia
            );

            alert("Ordem criada com sucesso!\n" + txHash);
=======
            const txHash = await writeWeb3Contract2(
                contratoEndereco,
                "criarOrdem",
                abi,
                [quantidadeWei.toString(), v],
                [valortaxa]
            );

            alert("Ordem criada com sucesso! Tx: " + txHash);
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
            setTimeout(async () => {
                await listarOrdensDoVendedor();
            }, 6000);
        } catch (err) {
            console.error("Erro ao criar ordem:", err);
            alert("Erro ao criar ordem.");
        }
    }

    async function marcarCompleta() {
        const id = document.getElementById("ordemRecebida").value;
        try {
<<<<<<< HEAD
            const txHash = await writeEthersContract(contratoEndereco, "marcarComoCompleta", abi, [id]);
            alert("Ordem marcada como completa com sucesso!\n" + txHash);
=======
            await writeWeb3Contract(contratoEndereco, "marcarComoCompleta", abi, [id]);
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
        } catch (error) {
            alert("Erro ao marcar ordem recebida.");
        }
    }


    btnCriarOrdem.addEventListener('click', criarOrdem);
    btnMarcarCompleta.addEventListener('click', marcarCompleta);
});