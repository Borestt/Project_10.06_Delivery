const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos da pasta public
app.use(express.static(path.join(__dirname, "public")));

/*
=========================================
ARRAYS (REQUISITO)
=========================================
*/

// Lista de objetos (REQUISITO)
const empresas = [];

const produtos = [];

/*
=========================================
FUNÇÃO GERAR ID
=========================================
*/

function gerarIdEmpresa() {
    const id = empresas.length + 1;

    return String(id).padStart(2, "0");
}

/*
=========================================
EMPRESAS
=========================================
*/

// GET EMPRESAS
app.get("/empresas", (req, res) => {
    res.json(empresas);
});

// POST EMPRESA
app.post("/empresa", (req, res) => {

    const {
        nome,
        tipo,
        frete,
        endereco,
        telefone,
        horario
    } = req.body;

    const novaEmpresa = {
        id: gerarIdEmpresa(),
        nome,
        tipo,
        frete: Number(frete),
        endereco,
        telefone,
        horario
    };

    empresas.push(novaEmpresa);

    res.status(201).json({
        mensagem: "Empresa cadastrada com sucesso",
        empresa: novaEmpresa
    });
});

/*
=========================================
PRODUTOS
=========================================
*/

// GET PRODUTOS
app.get("/produtos", (req, res) => {
    res.json(produtos);
});

// POST PRODUTO
app.post("/produto", (req, res) => {

    const {
        empresaId,
        nome,
        categoria,
        descricao,
        preco
    } = req.body;

    /*
    =========================================
    FILTER (REQUISITO)
    =========================================
    */

    const empresaExiste =
        empresas.filter(
            empresa => empresa.id === empresaId
        );

    if (empresaExiste.length === 0) {
        return res.status(404).json({
            erro: "Empresa não encontrada"
        });
    }

    const novoProduto = {
        id: produtos.length + 1,
        empresaId,
        nome,
        categoria,
        descricao,
        preco: Number(preco)
    };

    produtos.push(novoProduto);

    res.status(201).json({
        mensagem: "Produto cadastrado com sucesso",
        produto: novoProduto
    });
});

/*
=========================================
EXEMPLOS DE DADOS INICIAIS
=========================================
*/

empresas.push({
    id: "01",
    nome: "Pizzaria Itália",
    tipo: "Pizzaria",
    frete: 5,
    endereco: "Rua Central",
    telefone: "(81) 99999-9999",
    horario: "18h às 23h"
});

produtos.push({
    id: 1,
    empresaId: "01",
    nome: "Pizza Calabresa",
    categoria: "Pizza",
    descricao: "Calabresa com queijo",
    preco: 45
});

produtos.push({
    id: 2,
    empresaId: "01",
    nome: "Pizza Frango",
    categoria: "Pizza",
    descricao: "Frango com catupiry",
    preco: 42
});

/*
=========================================
INICIAR SERVIDOR
=========================================
*/

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});