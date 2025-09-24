
export const lerContrato = async (address, functionName, abi, args) => {
    try {
        const resp = await fetch("https://graphenesmartchain.com:3012/readContract", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                address,
                abi,
                functionName,
                args
            })
        });

        if (!resp.ok) {
            throw new Error(`HTTP ${resp.status} – ${resp.statusText}`);
        }

        const { result, error } = await resp.json();
        if (error) {
            throw new Error(error);
        }

        return result;
    } catch (err) {
        console.error("Erro ao ler contrato:", err);
        return 0;
    }
};

export async function listarOrdensDoVendedor() {
    try {
        const ids = await lerContrato(
            contratoEndereco,
            "getOrdensDoVendedor",
            abi,
            [web3Account.address]
        );

        if (Array.isArray(ids) && ids.length > 0) {
            const ultimaOrdem = ids[ids.length - 1];
            console.log("Última ordem:", ultimaOrdem);

            // Preenche o input com o ID da última ordem
            document.getElementById("ordemRecebida").value = ultimaOrdem;

            // Opcional: exibe um alerta com todas as ordens
            //alert("Você possui " + ids.length + " ordem(ns): " + ids.join(", "));
        } else {
            //alert("Você ainda não criou nenhuma ordem.");
        }
    } catch (error) {
        console.error("Erro ao listar ordens do vendedor:", error);
        alert("Não foi possível consultar suas ordens.");
    }
}

export const checarSaldo = async () => {
    try {
        const saldo = await lerContrato(
            checkBalanceAddr, // Endereço do token
            "getWalletBNBBalance",  // Função a ser chamada
            checkBalanceABI,     // ABI do token ERC-20
            ["0x03DB1Ebc0f3746fda5c6DBE5e62F03D888710447"] // Argumentos: dono (owner) e gastador (spender, o Router)
        );
        return saldo; // Retorna o valor da aprovação
    } catch (error) {
        console.error("Erro ao verificar allowance: ", error);
        return 0;
    }
};



export const checkAllowance = async (tokenAddress, owner, spender) => {
    try {
        const allowance = await lerContrato(
            tokenAddress, // Endereço do token
            "allowance",  // Função a ser chamada
            tokenABI,     // ABI do token ERC-20
            [owner, spender] // Argumentos: dono (owner) e gastador (spender, o Router)
        );
        return allowance; // Retorna o valor da aprovação
    } catch (error) {
        console.error("Erro ao verificar allowance: ", error);
        return 0;
    }
};