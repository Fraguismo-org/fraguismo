import { walletConnection } from "../web3/wallet.js";
import { contratoEndereco, fragaTokenAddress } from "./mercadoSecundarioAddress.js";
import { abi, tokenABI } from "./abi.js";
import { lerContrato, listarOrdensDoVendedor } from "./utils.js";
import { writeEthersContract } from "../web3/initialize.js";

document.addEventListener('DOMContentLoaded', async () => {
    const btnCriarOrdem = document.getElementById("criarOrdem");
    const btnMarcarCompleta = document.getElementById("marcarCompleta");

    async function criarOrdem() {
        try {
            const quantidade = document.getElementById("quantidade").value.trim();
            const valorBRL = document.getElementById("valorBRL").value.trim();
            const quantidadeWei = walletConnection.ethers.parseUnits(quantidade, 18);

            // Checar allowance
            const allowance = await lerContrato(
                fragaTokenAddress,
                "allowance",
                tokenABI,
                [walletConnection.address, contratoEndereco]
            );

            if (BigInt(allowance) < BigInt(quantidadeWei)) {
                alert("Permitindo o contrato movimentar os tokens...");
                const txApprove = await writeEthersContract(
                    fragaTokenAddress,
                    "approve",
                    tokenABI,
                    [contratoEndereco, quantidadeWei]
                );
                alert("Approve realizado. Aguardando confirmação para criar a ordem...");
            }

            const txHash = await writeEthersContract(
                contratoEndereco,
                "criarOrdem",
                abi,
                [quantidadeWei.toString(), valorBRL],
                valortaxa
            );

            alert("Ordem criada com sucesso! Tx: " + txHash);
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
            await writeEthersContract(contratoEndereco, "marcarComoCompleta", abi, [id]);
        } catch (error) {
            alert("Erro ao marcar ordem recebida.");
        }
    }


    btnCriarOrdem.addEventListener('click', criarOrdem);
    btnMarcarCompleta.addEventListener('click', marcarCompleta);
});