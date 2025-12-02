$(document).ready(function () {
    listarContas();
});

// 🔵 Lista as contas do cliente logado
async function listarContas() {
    let cliente = JSON.parse(localStorage.getItem("clienteAutenticado"));
    if (!cliente) {
        alert("Usuário não autenticado!");
        window.location.href = "login.html";
        return;
    }

    try {
        let resposta = await fetch(`http://localhost:8888/api/contas/cliente/${cliente.id}`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar contas");
        }

        let contas = await resposta.json();
        let tabela = $("#listaContas");

        tabela.empty(); // limpa a tabela antes de adicionar

        if (contas.length === 0) {
            tabela.append("<tr><td colspan='2'>Nenhuma conta cadastrada.</td></tr>");
        } else {
            contas.forEach(conta => {
                tabela.append(`
                    <tr>
                        <td>${conta.numero}</td>
                        <td>R$ ${conta.saldo.toFixed(2)}</td>
                    </tr>
                `);
            });
        }

    } catch (e) {
        console.log(e);
        alert("Não foi possível carregar as contas.");
    }
}