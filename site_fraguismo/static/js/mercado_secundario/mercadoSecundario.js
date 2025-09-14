const fragaTokenAddress = "0x1E93eCdb8d5026eE38bE4CE7Ae7A49A1e28E1c40";
const tokenABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "_name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "_symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const contratoEndereco = "0xAA71fBb9bFaaE91a9AcA3EA742964db78aEd1D2e";
const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "comprador",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "garantia",
                "type": "uint256"
            }
        ],
        "name": "NegociacaoIniciada",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "vendedor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "quantidade",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "valorBRL",
                "type": "uint256"
            }
        ],
        "name": "NovaOrdem",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "OrdemCompleta",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "OrdemConfirmadaPeloArbitro",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "OrdemDisputada",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "OrdemRevertida",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "abrirDisputa",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "abrirDisputaComprador",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "arbitro",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "arbitroConfirmaPagamento",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "arbitroReverteTransacao",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "quantidade",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "valorEmBRL",
                "type": "uint256"
            }
        ],
        "name": "criarOrdem",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "garantia",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "vendedor",
                "type": "address"
            }
        ],
        "name": "getOrdensDoVendedor",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTodasOrdens",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "vendedores",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "quantidades",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "valores",
                "type": "uint256[]"
            },
            {
                "internalType": "address[]",
                "name": "compradores",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "garantias",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "blocos",
                "type": "uint256[]"
            },
            {
                "internalType": "enum MercadoSecundario.Status[]",
                "name": "status",
                "type": "uint8[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTodasOrdensIds",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "iniciarNegociacao",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "limiteBlocos",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "marcarComoCompleta",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ordemCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "ordens",
        "outputs": [
            {
                "internalType": "address",
                "name": "vendedor",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "quantidade",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "valorEmBRL",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "comprador",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "garantia",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "blocoInicial",
                "type": "uint256"
            },
            {
                "internalType": "enum MercadoSecundario.Status",
                "name": "status",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "ordensPorVendedor",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "novoLimite",
                "type": "uint256"
            }
        ],
        "name": "setLimiteBlocos",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "taxaMultiplicadora",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "token",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];


const lerContrato = async (address, functionName, abi, args) => {
    try {
        const resp = await fetch("https://graphenesmartchain.com:3012/readContract", {
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
            throw new Error(`HTTP ${resp.status} – ${resp.statusText}`);
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
};


const checkBalanceABI = [
    {
        "inputs": [{ "internalType": "address", "name": "wallet", "type": "address" }],
        "name": "getWalletBNBBalance",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

const checkBalanceAddr = "0x88F12e928941BDc2CAA9fFf1B02e72173Ac301Cb";

const checarSaldo = async () => {
    try {
        const saldo = await lerContrato(
            checkBalanceAddr, // Endereço do token
            "getWalletBNBBalance",  // Função a ser chamada
            checkBalanceABI,     // ABI do token ERC-20
            ["0x03DB1Ebc0f3746fda5c6DBE5e62F03D888710447"] // Argumentos: dono (owner) e gastador (spender, o Router)
        );
        return saldo; // Retorna o valor da aprovação
    } catch (error) {
        console.error("Erro ao verificar allowance: ", error);
        return 0;
    }
};



const checkAllowance = async (tokenAddress, owner, spender) => {
    try {
        const allowance = await lerContrato(
            tokenAddress, // Endereço do token
            "allowance",  // Função a ser chamada
            tokenABI,     // ABI do token ERC-20
            [owner, spender] // Argumentos: dono (owner) e gastador (spender, o Router)
        );
        return allowance; // Retorna o valor da aprovação
    } catch (error) {
        console.error("Erro ao verificar allowance: ", error);
        return 0;
    }
};


async function criarOrdem() {
    try {
        const q = document.getElementById("quantidade").value.trim();
        const v = document.getElementById("valorBRL").value.trim();
        const quantidadeWei = ethers.utils.parseUnits(q, 18);

        // Checar allowance
        const allowance = await lerContrato(
            fragaTokenAddress,
            "allowance",
            tokenABI,
            ["0xba2Bd85C6622e76E16ab06477Ba32574D4D872b7", contratoEndereco]
        );

        if (BigInt(allowance) < BigInt(quantidadeWei)) {
            alert("Permitindo o contrato movimentar os tokens...");
            const txApprove = await writeWeb3Contract(
                fragaTokenAddress,
                "approve",
                tokenABI,
                [contratoEndereco, quantidadeWei]
            );
            alert("Approve realizado. Aguardando confirmação para criar a ordem...");
        }

        const txHash = await writeWeb3Contract2(
            contratoEndereco,
            "criarOrdem",
            abi,
            [quantidadeWei.toString(), v],
            [valortaxa]
        );

        alert("Ordem criada com sucesso! Tx: " + txHash);
        setTimeout(async () => {
            await listarOrdensDoVendedor();
        }, 6000);
    } catch (err) {
        console.error("Erro ao criar ordem:", err);
        alert("Erro ao criar ordem.");
    }
}

async function listarOrdensDoVendedor() {
    try {
        const ids = await lerContrato(
            contratoEndereco,
            "getOrdensDoVendedor",
            abi,
            [web3Account.address]
        );

        if (Array.isArray(ids) && ids.length > 0) {
            const ultimaOrdem = ids[ids.length - 1];
            console.log("Última ordem:", ultimaOrdem);

            // Preenche o input com o ID da última ordem
            document.getElementById("ordemRecebida").value = ultimaOrdem;

            // Opcional: exibe um alerta com todas as ordens
            //alert("Você possui " + ids.length + " ordem(ns): " + ids.join(", "));
        } else {
            //alert("Você ainda não criou nenhuma ordem.");
        }
    } catch (error) {
        console.error("Erro ao listar ordens do vendedor:", error);
        alert("Não foi possível consultar suas ordens.");
    }
}

const statusEnum = {
    0: "Pendente",
    1: "Em Negociação",
    2: "Completa",
    3: "Disputada",
    4: "Revertida"
};

function abreviarEndereco(endereco) {
    if (!endereco || endereco === "0x0000000000000000000000000000000000000000") return "-";
    return `${endereco.slice(0, 8)}...${endereco.slice(-6)}`;
}

async function preencherTabelaOrdens() {
    try {
        const resposta = await lerContrato(
            contratoEndereco,
            "getTodasOrdens",
            abi,
            [] // sem argumentos
        );

        const {
            vendedores,
            quantidades,
            valores,
            compradores,
            garantias,
            blocos,
            status
        } = resposta;

        const tbody = document.getElementById("corpoTabelaOrdens");
        tbody.innerHTML = ""; // Limpa a tabela

        for (let i = 0; i < vendedores.length; i++) {
            const linha = document.createElement("tr");

            linha.innerHTML = `
          <td>${i}</td>
          <td title="${vendedores[i]}">${abreviarEndereco(vendedores[i])}</td>
          <td>${(Number(quantidades[i]) / 1e18).toFixed(4)}</td>
          <td>R$ ${valores[i]}</td>
          <td>${statusEnum[status[i]] || "Desconhecido"}</td>
          <td title="${compradores[i]}">${abreviarEndereco(compradores[i])}</td>
          <td>${blocos[i]}</td>
          <td>${(Number(garantias[i]) / 1e18).toFixed(6)} BNB</td>
          <td><button onclick="preencherInputOrdem(${i})">Comprar</button></td>
          <td><button onclick="preencherDisputa(${i})">Disputar</button></td>
           <td><button onclick="preencherArbitro(${i})">Arbitrar</button></td>
        `;

            tbody.appendChild(linha);
        }

    } catch (error) {
        console.error("Erro ao preencher tabela de ordens:", error);
        alert("Erro ao consultar as ordens.");
    }
}

function preencherInputOrdem(ordemId) {
    document.getElementById("ordemNegociar").value = ordemId;
}

function preencherDisputa(ordemId) {
    document.getElementById("ordemRecebida2").value = ordemId;
    document.getElementById("ordemRecebida").value = ordemId;
    document.getElementById("ordemRecebidaDisputar").value = ordemId;
    let botaodisputa = document.getElementById("btn_disputa");
    setActiveButton(botaodisputa);
    displayDiv('disputa');
}

function preencherArbitro(ordemId) {
    let botaoarbitra = document.getElementById("btn_admin");
    setActiveButton(botaoarbitra);
    document.getElementById("ordemConfirma").value = ordemId;
    document.getElementById("ordemReverte").value = ordemId;
    displayDiv('admin');
}

async function iniciarNegociacao() {
    const id = document.getElementById("ordemNegociar").value;
    const valorBNB = document.getElementById("valorBNB").value;
    await writeWeb3Contract2(contratoEndereco, "iniciarNegociacao", abi, [id], valortaxa);
}

async function marcarCompleta() {
    const id = document.getElementById("ordemRecebida").value;
    await writeWeb3Contract(contratoEndereco, "marcarComoCompleta", abi, [id]);
}

async function abrirDisputa() {
    const id = document.getElementById("ordemRecebida").value;
    await writeWeb3Contract(contratoEndereco, "abrirDisputa", abi, [id]);
}

async function abrirDisputaComprador() {
    const id = document.getElementById("ordemRecebida2").value;
    await writeWeb3Contract(contratoEndereco, "abrirDisputaComprador", abi, [id]);
}

async function confirmarPagamento() {
    const id = document.getElementById("ordemConfirma").value;
    await writeWeb3Contract(contratoEndereco, "arbitroConfirmaPagamento", abi, [id]);
}

async function reverterTransacao() {
    const id = document.getElementById("ordemReverte").value;
    await writeWeb3Contract(contratoEndereco, "arbitroReverteTransacao", abi, [id]);
}

function abrirAba(nome) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));
    document.getElementById(nome).classList.add('ativa');
}