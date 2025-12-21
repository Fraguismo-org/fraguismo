
/**
 * Função para ler informações do contrato via API
 */
const lerContrato = async (address, functionName, abi, args) => {
    try {
        const resp = await fetch("https://graphenesmartchain.com:3014/readContract", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address, abi, functionName, args })
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
        return null;
    }
};
