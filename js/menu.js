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

async function atualizarSaldo(idCliente) {
    let saldo = 0;

    try {
        
    } catch (error) {
        
    }
    
}