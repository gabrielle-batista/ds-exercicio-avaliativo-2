//RF-05: Realizar Operação Financeira
const BASE_URL = "http://localhost:8888/api";

//Verifica sessão do cliente
function obterClienteAutenticado() {
    const cliente = JSON.parse(localStorage.getItem("clienteAutenticado"));
    if (!cliente) {
        alert("Sessão expirada! Faça login novamente.");
        window.location.href = "login.html";
        return null;
    }
    return cliente;
}

//Carregar contas do cliente
async function carregarContasSelect() {
    const cliente = obterClienteAutenticado();
    if (!cliente) return;

    try {
        const resp = await fetch(`${BASE_URL}/contas/cliente/${cliente.id}`);

        if (!resp.ok) throw new Error("Erro ao buscar contas do cliente");

        const contas = await resp.json();
        const select = document.getElementById("numeroConta");

        select.innerHTML = `<option value="">Selecione...</option>`;

        contas.forEach(c => {
            select.innerHTML += `
                <option value="${c.id}">
                    Conta ${c.numero} — Saldo: R$ ${c.saldo.toFixed(2)}
                </option>`;
        });

    } catch (error) {
        console.error("Erro ao carregar contas:", error);
        alert("Erro ao carregar contas.");
    }
}

//Listar lançamentos da conta selecionada
async function listarOperacoes() {
    const idConta = obterIdContaDaURL();
    if (!idConta) return;

    try {
        const resp = await fetch(`${BASE_URL}/lancamentos/conta/${idConta}`);
        if (!resp.ok) throw new Error("Erro ao buscar operações");

        const lista = await resp.json();
        const tbody = document.getElementById("listaOperacoes");

        tbody.innerHTML = "";

        lista.forEach(op => {
            tbody.innerHTML += `
                <tr>
                    <td>${op.tipo}</td>
                    <td>R$ ${Number(op.valor).toFixed(2)}</td>
                    <td>${op.dataHora ?? "—"}</td>
                </tr>`;
        });

    } catch (error) {
        console.error(error);
        alert("Erro ao carregar operações.");
    }
}

//OBTER CONTA SELECIONADA VIA URL
function obterIdContaDaURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("idConta");
}

//REGISTRO DE EXTRATO
function registrarExtrato(conta, tipo, valor, data) {
    const cliente = JSON.parse(localStorage.getItem("clienteAutenticado"));

    const novoLancamento = {
        tipo,
        valor,
        data: new Date().toISOString()
    };

    if (!conta.extrato) {
        conta.extrato = [];
    }

    conta.extrato.push(novoLancamento);

    localStorage.setItem("clienteAutenticado", JSON.stringify(cliente));
}

/* =========================================
   SALVAR OPERAÇÃO (DEPÓSITO / SAQUE)
========================================= */
async function salvarOperacao() {

    const tipo = document.getElementById("tipoOperacao").value;
    const valor = Number(document.getElementById("valor").value);
    const data = new Date().toISOString();
    const idConta = Number(document.getElementById("numeroConta").value);

    if (!tipo || valor <= 0 || !idConta) {
        alert("Preencha todos os campos!");
        return;
    }

    // ================================
    //   VALIDAÇÃO DE SALDO PARA SAQUE
    // ================================
    try {
        const respConta = await fetch(`${BASE_URL}/contas/${idConta}`);

        if (!respConta.ok) throw new Error("Erro ao buscar conta");

        const conta = await respConta.json();

        if (tipo === "SAQUE" && valor > conta.saldo) {
            alert(`Saldo insuficiente! Saldo atual: R$ ${conta.saldo.toFixed(2)}`);
            return;
        }

    } catch (e) {
        console.error(e);
        alert("Erro ao validar saldo.");
        return;
    }

    // ================================
    // DADOS DA OPERAÇÃO
    // ================================
    const dados = {
        id: null,
        valor: valor,
        tipo: tipo,
        data: data,
        idConta: idConta
    };

    try {
        const resp = await fetch(`${BASE_URL}/lancamentos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        if (!resp.ok) {
            const erro = await resp.text();
            alert("Erro ao registrar operação: " + erro);
            return;
        }

        // Depois que a API salvar a operação com sucesso:
        alert("Operação registrada com sucesso!");

        // Atualizar extrato local
        const cliente = JSON.parse(localStorage.getItem("clienteAutenticado"));
        const conta = cliente.contas.find(c => c.id === idConta);

        registrarExtrato(conta, tipo, valor);

        // ================================
        // ATUALIZAR CONTAS DO CLIENTE APÓS A OPERAÇÃO
        // ================================
        const clienteAtualizadoResp = await fetch(`${BASE_URL}/contas/cliente/${cliente.id}`);
        if (clienteAtualizadoResp.ok) {
            const contasAtualizadas = await clienteAtualizadoResp.json();
            cliente.contas = contasAtualizadas;
        }

        // Salvar cliente atualizado
        localStorage.setItem("clienteAutenticado", JSON.stringify(cliente));

        // Redirecionar
        window.location.href = "operacoes.html";



    } catch (error) {
        console.error(error);
        alert("Erro ao salvar operação.");
    }
}

/* =========================================
   REDIRECIONAR PARA NOVA OPERAÇÃO
========================================= */
function novaOperacao() {
    window.location.href = "operacoes.html";
}