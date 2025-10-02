import { walletConnection } from "../web3/wallet.js";

document.addEventListener("DOMContentLoaded", async function () {
    const connectButton = this.getElementById("btn-connect");
    const disconnectButton = this.getElementById("btn-disconnect");
    const prepare = this.getElementById("prepare");
    const connected = this.getElementById("connected");
    const walletAddress = this.getElementById("wallet-address");
    const walletBalance = this.getElementById("wallet-balance");
    const retractPanelButton = this.getElementById("retract-panel");
    const connectPanel = this.getElementById("connect-pane");
    const contentPanel = this.getElementById("content-panel");
    let isRetracted = false;

    const connectWallet = async () => {
        if (await walletConnection.connect()) {
            walletAddress.innerHTML = walletConnection.formatWalletAddress();
            walletBalance.innerHTML = walletConnection.balance;

            disconnectButton.style.display = "block";
            connectButton.style.display = "none";
            prepare.style.display = "none";
            connected.style.display = "block";
            return;
        }

    }

    const disconnectWallet = async () => {
        if (walletConnection.disconnect()) {

            walletAddress.innerHTML = "";
            walletBalance.innerHTML = "";
            disconnectButton.style.display = "none";
            connectButton.style.display = "block";
            prepare.style.display = "block";
            connected.style.display = "none";
            window.location.reload;
            return;
        }

    }

    const retractRecoverPanel = () => {
        if (isRetracted) {
            connectPanel.style.width = "250px";
            retractPanelButton.innerHTML = `<i class="bi bi-chevron-double-right"></i>`;
            contentPanel.style.display = "block";
        } else {
            connectPanel.style.width = "50px";
            retractPanelButton.innerHTML = `<i class="bi bi-chevron-double-left"></i>`;
            contentPanel.style.display = "none";
        }
        isRetracted = !isRetracted;
    }

<<<<<<< HEAD
    const checkConnection = async () => {
        await walletConnection.checkConnection();
        if (walletConnection.isConnected) {
            walletAddress.innerHTML = walletConnection.formatWalletAddress();
            walletBalance.innerHTML = walletConnection.balance;

            disconnectButton.style.display = "block";
            connectButton.style.display = "none";
            prepare.style.display = "none";
            connected.style.display = "block";
        }
    }
    await checkConnection();
=======
    await walletConnection.checkConnection();
>>>>>>> 9b6414cceb786ff0275a177542c5edd967ae7c98
    await walletConnection.setupEventListeners();

    connectButton.addEventListener('click', connectWallet);
    disconnectButton.addEventListener('click', disconnectWallet);
    retractPanelButton.addEventListener('click', retractRecoverPanel);
});