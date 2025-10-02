<<<<<<< HEAD
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
=======
const writeWeb3Contract2 = async (address, functionName, abi, args=[], value=null) => {
    console.log("Values chegaram aqui: "+value);
    const valor = parseEther(value.toString());
    const config = await prepareWriteContract({
        address: address,
        abi: abi,
        functionName: functionName,
        args:args,
        value: valor
    })

    if (value !== null) {
        //config.value = parseEther(valor.toString());
    }

    const { hash } = await writeContract(config)
    return hash;
}

const writeWeb3Contract = async (address, functionName, abi, args=[], value=null) => {
    const config = await prepareWriteContract({
        address: address,
        abi: abi,
        functionName: functionName,
        args:args
    })

    if (value !== null) {
        config.value = 'parseEther(value.toString())';
    }

    const { hash } = await writeContract(config)
    return hash;
}


const awaitConfirmation = async(hash)=> {
    const data = await waitForTransaction({
        hash: hash
    });
    return data;
}

const sendEthereum = async(to, value)=> {
    const config = await prepareSendTransaction({
        to: to,
        value: parseEther(value.toString())
    })
    const { hash } = await sendTransaction(config)
    return hash;
}

const readWeb3Contract = async (address, functionName, abi, args) => {
    const data = await readContract({
        address: address,
        functionName: functionName,
        abi: abi,
        args: args
    })
    return data;
}

// var web3Account = getAccount();
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
