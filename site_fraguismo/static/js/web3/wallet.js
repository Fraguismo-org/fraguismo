import { ethers } from "../ethers/ethers.min.js";

// Configuração da rede de teste Graphene
const GRAPHENE_TESTNET = {
    chainId: '0x4283', // 17027 em decimal
    chainName: 'Graphene Smart Chain Testnet',
    nativeCurrency: {
        name: 'Graphene',
        symbol: 'GPH',
        decimals: 18
    },
    rpcUrls: ['https://graphenesmartchain.com'],
    blockExplorerUrls: ['https://graphenesmartchain.com/explorer']
};

class Wallet {
    constructor() {
        this.isConnected = false;
        this.walletAddress = "";
        this.provider = null;
        this.signer = null;
        this.ethers = ethers;
        this.balance = 0;
        this.requiredChainId = GRAPHENE_TESTNET.chainId;
        this.networkConfig = GRAPHENE_TESTNET;
    }

    async connect() {
        if (typeof window.ethereum === 'undefined') {
            alert('Por favor, instale uma carteira Web3 como MetaMask.');
            return false;
        }
        try {
            // Verificar se está na rede correta
            const isCorrect = await this.isCorrectNetwork();

            if (!isCorrect) {
                const currentChainId = await this.getCurrentChainId();
                const confirm = window.confirm(
                    `Você está na rede errada (Chain ID: ${currentChainId}).\n` +
                    `Esta aplicação requer a rede ${this.networkConfig.chainName} (Chain ID: ${this.requiredChainId}).\n\n` +
                    'Deseja trocar para a rede correta?'
                );

                if (confirm) {
                    try {
                        await this.switchToTestNetwork();
                    } catch (switchError) {
                        alert('Não foi possível trocar de rede. Por favor, troque manualmente na sua carteira.');
                        return false;
                    }
                } else {
                    alert('É necessário estar na rede correta para usar esta aplicação.');
                    return false;
                }
            }

            this.provider = new this.ethers.BrowserProvider(window.ethereum);
            this.signer = await this.provider.getSigner();
            this.walletAddress = await this.signer.getAddress();
            this.balance = await this.provider.getBalance(this.walletAddress);
            this.balance = this.ethers.formatEther(this.balance);
            this.isConnected = true;
            localStorage.setItem('isWalletConnected', `${this.isConnected}`);
            return true;
        } catch (error) {
            if (error.code === 4001) {
                alert('Conexão rejeitada pelo usuário.');
                return false;
            } else {
                console.error('Erro ao conectar carteira:', error);
                alert('Erro ao conectar carteira. Veja o console para mais detalhes.');
                return false;
            }
        }
    }

    async getCurrentChainId() {
        try {
            if (typeof window.ethereum === 'undefined') {
                return null;
            }
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            return chainId;
        } catch (error) {
            console.error('Erro ao obter chainId:', error);
            return null;
        }
    }

    async isCorrectNetwork() {
        const currentChainId = await this.getCurrentChainId();
        return currentChainId === this.requiredChainId;
    }

    async switchToTestNetwork() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: this.requiredChainId }],
            });
            return true;
        } catch (switchError) {
            // Erro 4902 significa que a rede não está adicionada na carteira
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [this.networkConfig],
                    });
                    return true;
                } catch (addError) {
                    console.error('Erro ao adicionar rede:', addError);
                    throw addError;
                }
            }
            console.error('Erro ao trocar de rede:', switchError);
            throw switchError;
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
