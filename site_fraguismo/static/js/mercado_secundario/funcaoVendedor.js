import { walletConnection } from "../web3/wallet.js";
import { contratoEndereco, fragaTokenAddress } from "./mercadoSecundarioAddress.js";
import { abi, tokenABI } from "./abi.js";
import { lerContrato, listarOrdensDoVendedor } from "./utils.js";

document.addEventListener('DOMContentLoaded', async () => {
    const btnCriarOrdem = document.getElementById("criarOrdem");
    const btnMarcarCompleta = document.getElementById("marcarCompleta");

    async function criarOrdem() {
        try {
            const q = document.getElementById("quantidade").value.trim();
            const v = document.getElementById("valorBRL").value.trim();
            const quantidadeWei = walletConnection.ethers.parseUnits(q, 18);

            // Checar allowance
            const allowance = await lerContrato(
                fragaTokenAddress,
                "allowance",
                tokenABI,
                [walletConnection.address, contratoEndereco]
            );

            if (BigInt(allowance) < BigInt(quantidadeWei)) {
                alert("Permitindo o contrato movimentar os tokens...");
                const txApprove = await writeWeb3Contract(
                    fragaTokenAddress,
                    "approve",
                    tokenABI,
                    [contratoEndereco, quantidadeWei]
                );
                alert("Approve realizado. Aguardando confirmação para criar a ordem...");
            }

            const txHash = await writeWeb3Contract2(
                contratoEndereco,
                "criarOrdem",
                abi,
                [quantidadeWei.toString(), v],
                [valortaxa]
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
            await writeWeb3Contract(contratoEndereco, "marcarComoCompleta", abi, [id]);
        } catch (error) {
            alert("Erro ao marcar ordem recebida.");
        }
    }


    btnCriarOrdem.addEventListener('click', criarOrdem);
    btnMarcarCompleta.addEventListener('click', marcarCompleta);
});