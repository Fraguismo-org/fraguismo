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

var web3Account = getAccount();

var connected = false;

const formatWallet = (address) => {
    if (address.length >= 12) {
        const prefix = address.substring(0, 5);
        const suffix = address.substring(address.length - 5);
        return `${prefix}...${suffix}`;
    }
    return address;
}

if (web3Account.isConnected == true) {
    connected = true;
    document.getElementById("connect-pane").style.display = "inline-block";
    document.getElementById("disconnect").onclick = ()=> {
        web3modal.openModal();
    };
}
else {
    connected = false;
    document.getElementById("connect-pane").style.display = "inline-block";
    document.getElementById("connect").onclick = ()=> {
        web3modal.openModal();
    };
}

const listen = ()=> {
    web3Account = getAccount();
    if (web3Account.isConnected) {
        document.getElementById("connect-pane").style.display = "none";
        document.getElementById("disconnect-pane").style.display = "inline-block";
        document.getElementById("disconnect").innerHTML = formatWallet(web3Account.address);
        document.getElementById("connect").onclick = ()=> {
            web3modal.openModal();
        };
        //document.getElementById("content").innerHTML = `Connected To: ${web3Account.address}`;
        connected = true;
    }
    else {
        document.getElementById("connect-pane").style.display = "inline-block";
        document.getElementById("disconnect-pane").style.display = "none";
        document.getElementById("disconnect").onclick = ()=> {
            web3modal.openModal();
        };
        connected = false;
        document.getElementById("content").innerHTML = ``;
    }
}

setInterval(listen, 200);