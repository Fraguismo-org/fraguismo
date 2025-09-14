var connected = false;

const formatWallet = (address) => {
    if (address.length >= 12) {
        const prefix = address.substring(0, 5);
        const suffix = address.substring(address.length - 5);
        return `${prefix}...${suffix}`;
    }
    return address;
}

if (web3Account.isConnected) {
    connected = true;
    document.getElementById("connected").style.display = "inline-block";
    document.getElementById("btn-disconnect").onclick = ()=> {
        web3modal.openModal();
    };
}
else {
    connected = false;
    document.getElementById("prepare").style.display = "inline-block";
    document.getElementById("btn-connect").onclick = ()=> {
        web3modal.openModal();
    };
}

const listen = ()=> {
    web3Account = getAccount();
    if (web3Account.isConnected) {
        document.getElementById("prepare").style.display = "none";
        document.getElementById("connected").style.display = "inline-block";
        document.getElementById("wallet-address").innerHTML = formatWallet(web3Account.address);
        document.getElementById("btn-disconnect").onclick = ()=> {
            web3modal.openModal();
        };        
        connected = true;
    }
    else {
        document.getElementById("prepare").style.display = "inline-block";
        document.getElementById("connected").style.display = "none";
        document.getElementById("btn-connect").onclick = ()=> {
            web3modal.openModal();
        };
        connected = false;
        // document.getElementById("content").innerHTML = ``;
    }
}

setInterval(listen, 200);