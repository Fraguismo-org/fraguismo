import { walletConnection } from "./wallet.js";

export const writeEthersContract = async (contractAddress, methodName, contractABI, params = [], value = null) => {
    try {
        const contract = new walletConnection.ethers.Contract(contractAddress, contractABI, walletConnection.signer);
        const txOptions = {};
        if (value !== null) {
            txOptions.value = walletConnection.ethers.parseEther(value.toString());
        }
        const tx = await contract[methodName](...params, txOptions);
        return tx.hash;
    } catch (error) {
        throw error;
    }
}

// export const readEthersContract = async (address, functionName, abi, args = []) => {
//     // try {
//     //     const contract = new walletConnection.ethers.Contract(contractAddress, contractABI, walletConnection.provider);
//     //     const result = await contract[methodName](...params);
//     //     return result;
//     // } catch (error) {
//     //     throw error;
//     // }

//     try {
//         //const resp = await fetch("https://graphenesmartchain.com:3013/readContract", { //3113 são os contratos da BSC
//         const resp = await fetch("https://graphenesmartchain.com:3012/readContract", { //3112 são os contratos da Graphene
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 address,
//                 abi,
//                 functionName,
//                 args
//             })
//         });

//         if (!resp.ok) {
//             throw new Error(`HTTP ${ resp.status } – ${ resp.statusText }`);
//         }

//         const { result, error } = await resp.json();
//         if (error) {
//             throw new Error(error);
//         }

//         return result;
//     } catch (err) {
//         console.error("Erro ao ler contrato:", err);
//         return 0;
//     }
// }

// export const lerContratoGraphene = async (address, functionName, abi, args) => {
//     try {
//         //const resp = await fetch("https://graphenesmartchain.com:3013/readContract", { //3113 são os contratos da BSC
//         const resp = await fetch("https://graphenesmartchain.com:3012/readContract", { //3112 são os contratos da Graphene
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 address,
//                 abi,
//                 functionName,
//                 args
//             })
//         });

//         if (!resp.ok) {
//             throw new Error(`HTTP ${ resp.status } – ${ resp.statusText }`);
//         }

//         const { result, error } = await resp.json();
//         if (error) {
//             throw new Error(error);
//         }

//         return result;
//     } catch (err) {
//         console.error("Erro ao ler contrato:", err);
//         return 0;
//     }
// };
