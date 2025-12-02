$(document).ready(function(){
    if (!localStorage.clienteAutenticado) {
        alert("Acesso negado.");
        window.location.href = "login.html";
    }else{
        var cliente = JSON.parse(localStorage.getItem('clienteAutenticado'));
        var primeiroNome = cliente.nome.substr(0, cliente.nome.indexOf(' '));
        $("#nome").text(primeiroNome);
        carregarCliente();
    }
    
})

//REQUISITO FUNCIONAL 04 - CADASTRAR CONTA
function gerarNumConta(nome) {
    const letras = nome.substring(0, 2).toUpperCase();
    const numero = Math.floor(100000 + Math.random() * 900000);
    return `${letras}-${numero}`;
}

async function cadastrarConta() {
    let cliente = JSON.parse(localStorage.getItem("clienteAutenticado"));

    try {
        let resposta = await fetch("http://localhost:8888/api/contas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                numero: gerarNumConta(cliente.nome),
                idCliente: cliente.id
            })
        });

        if (!resposta.ok) {
            alert("Erro ao criar conta");
            return;
        }

        alert("Conta criada com sucesso!");
        listarContas(); // recarrega tabela se você estiver na página contas.html

    } catch (error) {
        console.error(error);
        alert("Erro interno.");
    }
}

async function carregarCliente() {
    let cliente = JSON.parse(localStorage.getItem("clienteAutenticado"));

    if (!cliente) {
        alert("Sessão expirada!");
        window.location.href = "login.html";
        return;
    }

    // Coloca o nome do cliente no header
    $("#nome").text(cliente.nome);

    try {
        let respContas = await fetch(`http://localhost:8888/api/contas/cliente/${cliente.id}`);

        if (!respContas.ok) throw new Error("Erro ao buscar contas");

        let contas = await respContas.json();

        // recalcular saldo total
        let saldoTotal = contas.reduce((s, c) => s + c.saldo, 0);

        // atualizar cliente no localStorage
        cliente.contas = contas;
        cliente.saldoTotal = saldoTotal;

        localStorage.setItem("clienteAutenticado", JSON.stringify(cliente));

        // atualizar exibição no menu
        $("#saldoTotal").text(`R$ ${saldoTotal.toFixed(2)}`);

    } catch (e) {
        console.log(e);
        alert("Erro ao atualizar informações da conta.");
    }
}

