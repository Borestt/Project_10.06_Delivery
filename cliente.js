/*
=========================================
CONST (REQUISITO)
=========================================
*/

const empresasContainer =
    document.getElementById("empresasContainer");

const listaCarrinho =
    document.getElementById("listaCarrinho");

const quantidadeElemento =
    document.getElementById("quantidade");

const subtotalElemento =
    document.getElementById("subtotal");

const freteElemento =
    document.getElementById("frete");

const totalElemento =
    document.getElementById("total");

/*
=========================================
ARRAY (REQUISITO)
=========================================
*/

const carrinho = [];

/*
=========================================
CARREGAR DADOS
=========================================
*/

const btnFinalizar =
    document.getElementById("btnFinalizar");

const reciboDiv =
    document.getElementById("recibo");

/*
=========================================
FINALIZAR COMPRA
=========================================
*/

btnFinalizar.addEventListener("click", () => {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio!");

        return;
    }

    /*
    =========================================
    MAP (REQUISITO)
    Criar lista dos produtos
    =========================================
    */

    const itens =
        carrinho.map(produto =>
            `<li>
                ${produto.nome}
                - R$ ${produto.preco.toFixed(2)}
            </li>`
        ).join("");

    /*
    =========================================
    REDUCE (REQUISITO)
    Soma total
    =========================================
    */

    const subtotal =
        carrinho.reduce(
            (soma, produto) =>
                soma + produto.preco,
            0
        );

    const freteTexto =
        freteElemento.textContent
            .replace("Frete: R$ ", "");

    const frete =
        parseFloat(
            freteTexto.replace(",", ".")
        );

    const total = subtotal + frete;

    const numeroPedido =
        Math.floor(
            Math.random() * 9000
        ) + 1000;

    const data =
        new Date().toLocaleString("pt-BR");

    reciboDiv.innerHTML = `
        <h3>🧾 RECIBO</h3>

        <p>
            Pedido #${numeroPedido}
        </p>

        <p>
            Data: ${data}
        </p>

        <hr>

        <ul>
            ${itens}
        </ul>

        <hr>

        <p>
            Subtotal:
            R$ ${subtotal.toFixed(2)}
        </p>

        <p>
            Frete:
            R$ ${frete.toFixed(2)}
        </p>

        <h4>
            Total:
            R$ ${total.toFixed(2)}
        </h4>
    `;
});

async function carregarSistema() {

    const respostaEmpresas =
        await fetch("/empresas");

    const empresas =
        await respostaEmpresas.json();

    const respostaProdutos =
        await fetch("/produtos");

    const produtos =
        await respostaProdutos.json();

    renderizarEmpresas(empresas, produtos);
}

/*
=========================================
MOSTRAR EMPRESAS
=========================================
*/

function renderizarEmpresas(empresas, produtos) {

    empresasContainer.innerHTML = "";

    /*
    =========================================
    FOR...OF (REQUISITO)
    =========================================
    */

    for (const empresa of empresas) {

        const card = document.createElement("div");

        card.classList.add("card");

        /*
        =========================================
        FILTER (REQUISITO)
        Produtos da empresa atual
        =========================================
        */

        const produtosEmpresa =
            produtos.filter(
                produto =>
                    produto.empresaId === empresa.id
            );

        let htmlProdutos = "";

        /*
        =========================================
        FOR...OF
        =========================================
        */

        for (const produto of produtosEmpresa) {

            htmlProdutos += `
                <div style="
                    border-top:1px solid #ddd;
                    margin-top:10px;
                    padding-top:10px;
                ">
                    <h4>${produto.nome}</h4>

                    <p>
                        ${produto.descricao}
                    </p>

                    <p>
                        Categoria:
                        ${produto.categoria}
                    </p>

                    <p>
                        R$ ${produto.preco.toFixed(2)}
                    </p>

                    <button
                        onclick="adicionarCarrinho(
                            ${produto.id}
                        )"
                    >
                        Adicionar ao Carrinho
                    </button>
                </div>
            `;
        }

        card.innerHTML = `
            <h2>${empresa.nome}</h2>

            <p>
                Tipo:
                ${empresa.tipo}
            </p>

            <p>
                Frete:
                R$ ${empresa.frete.toFixed(2)}
            </p>

            <p>
                Horário:
                ${empresa.horario}
            </p>

            ${htmlProdutos}
        `;

        empresasContainer.appendChild(card);
    }
}

/*
=========================================
ADICIONAR PRODUTO
=========================================
*/

async function adicionarCarrinho(idProduto) {

    const respostaProdutos =
        await fetch("/produtos");

    const produtos =
        await respostaProdutos.json();

    /*
    =========================================
    FILTER (REQUISITO)
    =========================================
    */

    const produto =
        produtos.filter(
            item => item.id === idProduto
        )[0];

    carrinho.push(produto);

    atualizarCarrinho();
}

/*
=========================================
REMOVER PRODUTO
=========================================
*/

function removerCarrinho(indice) {

    carrinho.splice(indice, 1);

    atualizarCarrinho();
}

/*
=========================================
ATUALIZAR CARRINHO
=========================================
*/

async function atualizarCarrinho() {

    listaCarrinho.innerHTML = "";

    /*
    =========================================
    MAP (REQUISITO)
    Cria elementos visuais
    =========================================
    */

    carrinho.map((produto, indice) => {

        const li = document.createElement("li");

        li.innerHTML = `
            ${produto.nome}
            - R$ ${produto.preco.toFixed(2)}

            <button
                onclick="
                    removerCarrinho(${indice})
                "
            >
                X
            </button>
        `;

        listaCarrinho.appendChild(li);
    });

    /*
    =========================================
    REDUCE (REQUISITO)
    Soma subtotal
    =========================================
    */

    const subtotal =
        carrinho.reduce(
            (soma, produto) =>
                soma + produto.preco,
            0
        );

    quantidadeElemento.textContent =
        `Quantidade: ${carrinho.length}`;

    subtotalElemento.textContent =
        `Subtotal: R$ ${subtotal.toFixed(2)}`;

    let frete = 0;

    if (carrinho.length > 0) {

        const respostaEmpresas =
            await fetch("/empresas");

        const empresas =
            await respostaEmpresas.json();

        const empresaProduto =
            empresas.filter(
                empresa =>
                    empresa.id ===
                    carrinho[0].empresaId
            )[0];

        if (empresaProduto) {
            frete = empresaProduto.frete;
        }
    }

    freteElemento.textContent =
        `Frete: R$ ${frete.toFixed(2)}`;

    totalElemento.textContent =
        `Total: R$ ${(subtotal + frete).toFixed(2)}`;
}

/*
=========================================
INICIAR SISTEMA
=========================================
*/

carregarSistema();