document.addEventListener("DOMContentLoaded", async () => {
    let cliente = JSON.parse(localStorage.getItem("clienteAutenticado"));
    if (!cliente) return;

    // Mostra nome
    if (document.getElementById("nome")) {
        document.getElementById("nome").textContent = cliente.nome;
    }

    // Mostra saldo total atualizado
    if (document.getElementById("saldo")) {
        document.getElementById("saldo").textContent =
            cliente.saldoTotal.toFixed(2).replace(".", ",");
    }
});

