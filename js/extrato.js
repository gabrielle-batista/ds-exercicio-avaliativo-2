// Carrega as contas no <select>
async function carregarContasSelect() {
    const select = document.getElementById("numeroConta");

    try {
        const cliente = JSON.parse(localStorage.getItem("clienteAutenticado"));

        if (!cliente) {
            alert("Erro: cliente não autenticado.");
            return;
        }

        const response = await fetch("http://localhost:8888/api/contas");
        const contas = await response.json();

        // Filtra apenas as contas do cliente atual
        const minhasContas = contas.filter(c => c.idCliente === cliente.id);

        select.innerHTML = "";

        minhasContas.forEach(conta => {
            const option = document.createElement("option");
            option.value = conta.id;
            option.textContent = conta.numero; // ex: JS-000001
            select.appendChild(option);
        });

        // Opcional: selecionar automaticamente a primeira conta
        if (minhasContas.length > 0) {
            select.value = minhasContas[0].id;
        }

    } catch (error) {
        console.error("Erro ao carregar contas:", error);
    }
}



// Carrega extrato da conta selecionada
async function carregarExtratoParaValorSelecionado() {
    const idConta = document.getElementById("numeroConta").value;
    const tabela = document.getElementById("listaExtrato");

    if (!idConta) {
        alert("Selecione uma conta!");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8888/api/lancamentos/conta/${idConta}`);
        const lancamentos = await response.json();

        tabela.innerHTML = "";

        if (lancamentos.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center">Nenhum lançamento encontrado</td>
                </tr>
            `;
            return;
        }

        lancamentos.forEach(l => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${formatarData(l.data)}</td>
                <td>${l.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                <td>${l.tipo}</td>
            `;

            tabela.appendChild(tr);
        });

    } catch (error) {
        console.error("Erro ao carregar extrato:", error);
    }
}


// Formata a data vinda da API (caso seja ISO)
function formatarData(dataISO) {
    if (!dataISO) return "-";
    const d = new Date(dataISO);
    return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR");
}
