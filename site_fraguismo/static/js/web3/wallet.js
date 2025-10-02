import { ethers } from "../ethers/ethers.min.js";

class Wallet {
    constructor() {
        this.isConnected = false;
        this.walletAddress = "";
        this.provider = null;
        this.signer = null;
        this.ethers = ethers;
        this.balance = 0;
    }

    async connect() {
        if (typeof window.ethereum === 'undefined') {
            return;
        }
        try {

            //this.provider = new this.ethers.BrowserProvider(window.ethereum);
            this.provider = new this.ethers.JsonRpcProvider();
            this.signer = await this.provider.getSigner();
            this.walletAddress = await this.signer.getAddress();
            const balanceEth = await this.provider.getBalance(this.walletAddress);
            this.balance = this.ethers.formatEther(await this.provider.getBalance(this.walletAddress));
            this.isConnected = true;
            localStorage.setItem('isWalletConnected', `${this.isConnected}`);
            return true;
        } catch (error) {
            if (error.code === 4001) {
                return false;
            } else {
                return false;
            }
        }
    }

    disconnect() {
        this.provider = null;
        this.signer = null;
        this.address = "";
        this.balance = 0;
        this.isConnected = false;
        localStorage.removeItem('isWalletConnected');
        return true;
    }

    async setupEventListeners() {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', (accounts) => {
                console.log('Conta alterada:', accounts[0]);
                if (accounts.length === 0) {
                    this.disconnect();
                } else {
                    this.connect();
                }
            });

            window.ethereum.on('chainChanged', (chainId) => {
                console.log('Rede alterada para:', chainId);
                window.location.reload();
            });
        }
    }

    async checkConnection() {
        if (localStorage.getItem('isWalletConnected') === 'true' 
            && typeof window.ethereum !== 'undefined') {
            await this.connect();
        }
    }

    formatWalletAddress() {
        return `${this.walletAddress.slice(0,5)}...${this.walletAddress.slice(-5)}`;
    }
};

export const walletConnection = new Wallet();
