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

export const readEthersContract = async (contractAddress, methodName, contractABI, params = []) => {
    try {
        const contract = new walletConnection.ethers.Contract(contractAddress, contractABI, walletConnection.provider);
        const result = await contract[methodName](...params);
        return result;
    } catch (error) {
        throw error;
    }
}
