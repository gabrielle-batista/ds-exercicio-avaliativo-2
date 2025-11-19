$(document).ready(function(){
    if (!localStorage.clienteAutenticado) {
        alert("Acesso negado.");
        window.location.href = "login.html";
    }else{
        var cliente = JSON.parse(localStorage.getItem('clienteAutenticado'));
        var primeiroNome = cliente.nome.substr(0, cliente.nome.indexOf(' '));
        $("#nome").text(primeiroNome);
    }
    
})

//O menu é a camada que gerencia as operações do sistema após o login do cliente;

/*async function atualizarSaldo(idCliente) {
    let saldo = 0;

    try {
        
    } catch (error) {
        
    }
    
}*/

function gerarNumConta(nome) {
    const letras = nome.substring(0, 2).toUpperCase();
    const numero = Math.floor(100000 + Math.random() * 900000);
    return `${letras}-${numero}`;
}

function cadastrarConta() {
    let cliente = JSON.parse(localStorage.getItem('clienteAutenticado'));

    // pega todas as contas do sistema
    let contas = JSON.parse(localStorage.getItem('contas')) || [];

    let numero;
    do {
        numero = gerarNumeroConta(cliente.nome);
    } while (contas.some(c => c.numero === numero));

    // cria conta
    const novaConta = {
        numero: numero,
        saldo: 0,
        cpf: cliente.cpf   // identifica o dono da conta
    };

    // salva no sistema
    contas.push(novaConta);
    localStorage.setItem('contas', JSON.stringify(contas));

    alert("Conta criada: " + numero);
}