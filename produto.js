/*
=========================================
CONST (REQUISITO)
=========================================
*/

const formulario = document.getElementById("produtoForm");
const mensagem = document.getElementById("mensagem");
const listaProdutos = document.getElementById("listaProdutos");

/*
=========================================
LISTAR PRODUTOS
=========================================
*/

async function carregarProdutos() {

    const respostaProdutos = await fetch("/produtos");
    const produtos = await respostaProdutos.json();

    const respostaEmpresas = await fetch("/empresas");
    const empresas = await respostaEmpresas.json();

    listaProdutos.innerHTML = "";

    /*
    =========================================
    FOR...OF (REQUISITO)
    =========================================
    */

    for (const produto of produtos) {

        /*
        =========================================
        FILTER (REQUISITO)
        Encontrar empresa do produto
        =========================================
        */

        const empresa =
            empresas.filter(
                emp => emp.id === produto.empresaId
            )[0];

        const card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
            <h3>${produto.nome}</h3>

            <p>
                <strong>Empresa:</strong>
                ${empresa ? empresa.nome : "Não encontrada"}
            </p>

            <p>
                <strong>Categoria:</strong>
                ${produto.categoria}
            </p>

            <p>
                <strong>Descrição:</strong>
                ${produto.descricao}
            </p>

            <p>
                <strong>Preço:</strong>
                R$ ${produto.preco.toFixed(2)}
            </p>
        `;

        listaProdutos.appendChild(card);
    }
}

/*
=========================================
CADASTRAR PRODUTO
=========================================
*/

formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    const produto = {

        empresaId:
            document.getElementById("empresaId").value,

        nome:
            document.getElementById("nome").value,

        categoria:
            document.getElementById("categoria").value,

        descricao:
            document.getElementById("descricao").value,

        preco:
            document.getElementById("preco").value
    };

    const resposta = await fetch("/produto", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(produto)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {

        mensagem.className = "erro";

        mensagem.textContent = dados.erro;

        return;
    }

    mensagem.className = "sucesso";

    mensagem.textContent =
        "Produto cadastrado com sucesso!";

    formulario.reset();

    carregarProdutos();
});

/*
=========================================
INICIAR
=========================================
*/

carregarProdutos();