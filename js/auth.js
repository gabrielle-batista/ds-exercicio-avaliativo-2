// RF-07: Controle de Acesso

function verificarSessao() {
    const cliente = JSON.parse(localStorage.getItem("clienteAutenticado"));

    if (!cliente) {
        alert("Sessão expirada! Faça login novamente.");
        window.location.href = "login.html";
        return;
    }

    localStorage.setItem("ultimaAcao", Date.now());
}

document.addEventListener("DOMContentLoaded", verificarSessao);

// RF-07: Logout automático por inatividade (1 minuto)
const TEMPO_INATIVIDADE = 60 * 1000; // 1 minuto

function verificarInatividade() {
    const ultimaAcao = localStorage.getItem("ultimaAcao");

    if (!ultimaAcao) return;

    const agora = Date.now();
    const diferenca = agora - Number(ultimaAcao);

    if (diferenca > TEMPO_INATIVIDADE) {
        alert("Sessão encerrada por inatividade.");
        localStorage.removeItem("clienteAutenticado");
        localStorage.removeItem("ultimaAcao");
        window.location.href = "login.html";
    }
}

setInterval(verificarInatividade, 5000);

document.addEventListener("mousemove", () => {
    localStorage.setItem("ultimaAcao", Date.now());
});

document.addEventListener("keydown", () => {
    localStorage.setItem("ultimaAcao", Date.now());
});
