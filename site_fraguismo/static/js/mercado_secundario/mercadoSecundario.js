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


// async function criarOrdem() {
//     try {
//         const q = document.getElementById("quantidade").value.trim();
//         const v = document.getElementById("valorBRL").value.trim();
//         const quantidadeWei = ethers.utils.parseUnits(q, 18);

//         // Checar allowance
//         const allowance = await lerContrato(
//             fragaTokenAddress,
//             "allowance",
//             tokenABI,
//             [web3Account.address, contratoEndereco]
//         );

//         if (BigInt(allowance) < BigInt(quantidadeWei)) {
//             alert("Permitindo o contrato movimentar os tokens...");
//             const txApprove = await writeWeb3Contract(
//                 fragaTokenAddress,
//                 "approve",
//                 tokenABI,
//                 [contratoEndereco, quantidadeWei]
//             );
//             alert("Approve realizado. Aguardando confirmação para criar a ordem...");
//         }

//         const txHash = await writeWeb3Contract2(
//             contratoEndereco,
//             "criarOrdem",
//             abi,
//             [quantidadeWei.toString(), v],
//             [valortaxa]
//         );

//         alert("Ordem criada com sucesso! Tx: " + txHash);
//         setTimeout(async () => {
//             await listarOrdensDoVendedor();
//         }, 6000);
//     } catch (err) {
//         console.error("Erro ao criar ordem:", err);
//         alert("Erro ao criar ordem.");
//     }
// }

// async function listarOrdensDoVendedor() {
//     try {
//         const ids = await lerContrato(
//             contratoEndereco,
//             "getOrdensDoVendedor",
//             abi,
//             [web3Account.address]
//         );

//         if (Array.isArray(ids) && ids.length > 0) {
//             const ultimaOrdem = ids[ids.length - 1];
//             console.log("Última ordem:", ultimaOrdem);

//             // Preenche o input com o ID da última ordem
//             document.getElementById("ordemRecebida").value = ultimaOrdem;

//             // Opcional: exibe um alerta com todas as ordens
//             //alert("Você possui " + ids.length + " ordem(ns): " + ids.join(", "));
//         } else {
//             //alert("Você ainda não criou nenhuma ordem.");
//         }
//     } catch (error) {
//         console.error("Erro ao listar ordens do vendedor:", error);
//         alert("Não foi possível consultar suas ordens.");
//     }
// }

// const statusEnum = {
//     0: "Pendente",
//     1: "Em Negociação",
//     2: "Completa",
//     3: "Disputada",
//     4: "Revertida"
// };

function abreviarEndereco(endereco) {
    if (!endereco || endereco === "0x0000000000000000000000000000000000000000") return "-";
    return `${endereco.slice(0, 8)}...${endereco.slice(-6)}`;
}

// async function preencherTabelaOrdens() {
//     try {
//         const resposta = await lerContrato(
//             contratoEndereco,
//             "getTodasOrdens",
//             abi,
//             [] // sem argumentos
//         );

//         const {
//             vendedores,
//             quantidades,
//             valores,
//             compradores,
//             garantias,
//             blocos,
//             status
//         } = resposta;

//         const tbody = document.getElementById("corpoTabelaOrdens");
//         tbody.innerHTML = ""; // Limpa a tabela

//         for (let i = 0; i < vendedores.length; i++) {
//             const linha = document.createElement("tr");

//             linha.innerHTML = `
//           <td>${i}</td>
//           <td title="${vendedores[i]}">${abreviarEndereco(vendedores[i])}</td>
//           <td>${(Number(quantidades[i]) / 1e18).toFixed(4)}</td>
//           <td>R$ ${valores[i]}</td>
//           <td>${statusEnum[status[i]] || "Desconhecido"}</td>
//           <td title="${compradores[i]}">${abreviarEndereco(compradores[i])}</td>
//           <td>${blocos[i]}</td>
//           <td>${(Number(garantias[i]) / 1e18).toFixed(6)} BNB</td>
//           <td><button onclick="preencherInputOrdem(${i})">Comprar</button></td>
//           <td><button onclick="preencherDisputa(${i})">Disputar</button></td>
//            <td><button onclick="preencherArbitro(${i})">Arbitrar</button></td>
//         `;

//             tbody.appendChild(linha);
//         }

//     } catch (error) {
//         console.error("Erro ao preencher tabela de ordens:", error);
//         alert("Erro ao consultar as ordens.");
//     }
// }

// function preencherInputOrdem(ordemId) {
//     document.getElementById("ordemNegociar").value = ordemId;
// }

// function preencherDisputa(ordemId) {
//     document.getElementById("ordemRecebida2").value = ordemId;
//     document.getElementById("ordemRecebida").value = ordemId;
//     document.getElementById("ordemRecebidaDisputar").value = ordemId;
//     let botaodisputa = document.getElementById("btn_disputa");
//     setActiveButton(botaodisputa);
//     displayDiv('disputa');
// }

// function preencherArbitro(ordemId) {
//     let botaoarbitra = document.getElementById("btn_admin");
//     setActiveButton(botaoarbitra);
//     document.getElementById("ordemConfirma").value = ordemId;
//     document.getElementById("ordemReverte").value = ordemId;
//     displayDiv('admin');
// }

// async function iniciarNegociacao() {
//     const id = document.getElementById("ordemNegociar").value;
//     const valorBNB = document.getElementById("valorBNB").value;
//     await writeWeb3Contract2(contratoEndereco, "iniciarNegociacao", abi, [id], valortaxa);
// }

// async function marcarCompleta() {
//     const id = document.getElementById("ordemRecebida").value;
//     await writeWeb3Contract(contratoEndereco, "marcarComoCompleta", abi, [id]);
// }

// async function abrirDisputa() {
//     const id = document.getElementById("ordemRecebida").value;
//     await writeWeb3Contract(contratoEndereco, "abrirDisputa", abi, [id]);
// }

// async function abrirDisputaComprador() {
//     const id = document.getElementById("ordemRecebida2").value;
//     await writeWeb3Contract(contratoEndereco, "abrirDisputaComprador", abi, [id]);
// }

// async function confirmarPagamento() {
//     const id = document.getElementById("ordemConfirma").value;
//     await writeWeb3Contract(contratoEndereco, "arbitroConfirmaPagamento", abi, [id]);
// }

// async function reverterTransacao() {
//     const id = document.getElementById("ordemReverte").value;
//     await writeWeb3Contract(contratoEndereco, "arbitroReverteTransacao", abi, [id]);
// }

function abrirAba(nome) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));
    document.getElementById(nome).classList.add('ativa');
}

