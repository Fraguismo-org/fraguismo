import { walletConnection } from "./wallet.js";

export const writeEthersContract = async (contractAddress, methodName, contractABI, params = [], value = null) => {
    try {
        // Verificar se a carteira está conectada
        if (!walletConnection.isConnected) {
            throw new Error('Carteira não conectada. Por favor, conecte sua carteira primeiro.');
        }

        // Verificar se está na rede correta antes de fazer a transação
        const isCorrect = await walletConnection.isCorrectNetwork();
        if (!isCorrect) {
            const currentChainId = await walletConnection.getCurrentChainId();
            const confirm = window.confirm(
                `Você está na rede errada (Chain ID: ${currentChainId}).\n` +
                `Esta transação requer a rede ${walletConnection.networkConfig.chainName} (Chain ID: ${walletConnection.requiredChainId}).\n\n` +
                'Deseja trocar para a rede correta?'
            );

            if (confirm) {
                await walletConnection.switchToTestNetwork();
                // Reconectar após trocar de rede
                await walletConnection.connect();
            } else {
                throw new Error('Transação cancelada: rede incorreta.');
            }
        }

        const contract = new walletConnection.ethers.Contract(contractAddress, contractABI, walletConnection.signer);
        const txOptions = {};
        if (value !== null) {
            txOptions.value = walletConnection.ethers.parseEther(value.toString());
        }
        const tx = await contract[methodName](...params, txOptions);
        return tx.hash;
    } catch (error) {
        console.error('Erro em writeEthersContract:', error);
        throw error;
    }
}

export const readEthersContract = async (address, functionName, abi, args = []) => {
    try {        
        const resp = await fetch("https://graphenesmartchain.com:3014/readContract", { //3112 são os contratos da Graphene
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
            throw new Error(`HTTP ${ resp.status } – ${ resp.statusText }`);
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
}
