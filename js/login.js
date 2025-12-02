$(document).ready(function(){
    if (localStorage.clienteAutenticado) {
        localStorage.removeItem('clienteAutenticado');
    }
    
    $('#cpf').mask('999.999.999-99');
})


async function autenticar() {
    //verifica se o formulário atende as regras de validação do jQuery Validation.
    if ($("#formulario").valid()) {

        let cliente = new Object();
        cliente.cpf = $("#cpf").val();
        cliente.senha = $("#senha").val();

        localStorage.setItem("clienteAutenticado", JSON.stringify(cliente));
        localStorage.setItem("ultimaAcao", Date.now());


        try {
            let resposta = await fetch("http://localhost:8888/api/clientes/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cliente)
            });

            if (!resposta.ok) {
                alert("CPF ou senha inválidos.");
            } else {
                let cliente = await resposta.json();

                // 1) Baixar as contas do cliente
                let respContas = await fetch(`http://localhost:8888/api/contas/cliente/${cliente.id}`);
                let contas = await respContas.json();

                // 2) Calcular saldo total
                let saldoTotal = contas.reduce((s, c) => s + c.saldo, 0);

                // 3) Salvar tudo no localStorage
                cliente.contas = contas;
                cliente.saldoTotal = saldoTotal;

                localStorage.setItem('clienteAutenticado', JSON.stringify(cliente));

                window.location.href = "menu.html";
            }



        } catch (erro) {
            console.log(erro)
        }    
    }
}

$("#formulario").validate(
    {
        rules: {
            cpf: {
                required: true,
                minlength: 14,
                maxlength: 14
            },
            senha: {
                required: true,
                minlength: 3
            }
        },
        messages: {
            cpf: {
                required: "Campo obrigatório",
                minlength: "CPF deve ter 14 caracteres",
                maxlength: "CPF deve ter 14 caracteres"                
            },
            senha: {
                required: "Campo obrigatório",
                minlength: "A senha deve ter no mínimo 3 caracteres"
            }
        }
    }
);
