/*
=========================================
CONST (REQUISITO)
=========================================
*/

const formulario = document.getElementById("empresaForm");
const mensagem = document.getElementById("mensagem");
const listaEmpresas = document.getElementById("listaEmpresas");

/*
=========================================
CARREGAR EMPRESAS
=========================================
*/

async function carregarEmpresas() {

    const resposta = await fetch("/empresas");
    const empresas = await resposta.json();

    listaEmpresas.innerHTML = "";

    /*
    =========================================
    FOR...OF (REQUISITO)
    =========================================
    */

    for (const empresa of empresas) {

        const card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
            <h3>${empresa.nome}</h3>

            <p><strong>ID:</strong> ${empresa.id}</p>

            <p><strong>Tipo:</strong> ${empresa.tipo}</p>

            <p><strong>Frete:</strong>
            R$ ${empresa.frete.toFixed(2)}</p>

            <p><strong>Telefone:</strong>
            ${empresa.telefone}</p>

            <p><strong>Endereço:</strong>
            ${empresa.endereco}</p>

            <p><strong>Horário:</strong>
            ${empresa.horario}</p>
        `;

        listaEmpresas.appendChild(card);
    }
}

/*
=========================================
CADASTRAR EMPRESA
=========================================
*/

formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    const empresa = {

        nome: document.getElementById("nome").value,

        tipo: document.getElementById("tipo").value,

        frete: document.getElementById("frete").value,

        endereco: document.getElementById("endereco").value,

        telefone: document.getElementById("telefone").value,

        horario: document.getElementById("horario").value
    };

    const resposta = await fetch("/empresa", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(empresa)
    });

    const dados = await resposta.json();

    mensagem.className = "sucesso";

    mensagem.innerHTML = `
        Empresa cadastrada com sucesso!
        <br>
        ID Gerado:
        <strong>${dados.empresa.id}</strong>
    `;

    formulario.reset();

    carregarEmpresas();
});

/*
=========================================
INICIAR
=========================================
*/

carregarEmpresas();