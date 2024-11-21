// URL da API para obter os produtos
const API_URL = "https://deisishop.pythonanywhere.com/shop/getProducts";

// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener("DOMContentLoaded", () => {
    fazerRequisicaoAJAX(); // Faz a requisição AJAX à API
    atualizaCesto(); // Atualiza o cesto com os produtos do Local Storage
});

// Função para fazer a requisição AJAX usando fetch
function fazerRequisicaoAJAX() {
    const xhr = new XMLHttpRequest(); // Cria o objeto XMLHttpRequest

    xhr.open("GET", API_URL, true); // Configura a requisição: método GET e URL
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Converte a resposta JSON para um objeto JavaScript
            const produtos = JSON.parse(xhr.responseText);
            carregarProdutos(produtos); // Renderiza os produtos na página
        } else {
            console.error(`Erro na requisição: ${xhr.status} - ${xhr.statusText}`);
        }
    };

    xhr.onerror = function () {
        console.error("Erro de rede durante a requisição AJAX.");
    };

    xhr.send(); // Envia a requisição
}

// Função para carregar e renderizar os produtos na página
function carregarProdutos(produtos) {
    const listaProdutos = document.getElementById("lista-produtos");

    produtos.forEach((produto) => {
        const artigoProduto = criarProduto(produto);
        listaProdutos.appendChild(artigoProduto);
    });
}

// Função para criar um elemento <article> com as informações de um produto
function criarProduto(produto) {
    const artigo = document.createElement("article");
    artigo.className = "produto";

    const titulo = document.createElement("h3");
    titulo.textContent = produto.name;

    const imagem = document.createElement("img");
    imagem.src = produto.image;
    imagem.alt = produto.name;

    const descricao = document.createElement("p");
    descricao.textContent = produto.description;

    const preco = document.createElement("p");
    preco.innerHTML = `<strong>${produto.price.toFixed(2)} €</strong>`;

    const botaoAdicionar = document.createElement("button");
    botaoAdicionar.textContent = "+ Adicionar ao Cesto";

    botaoAdicionar.addEventListener("click", () => {
        adicionarAoCesto(produto);
    });

    artigo.appendChild(imagem);
    artigo.appendChild(titulo);
    artigo.appendChild(descricao);
    artigo.appendChild(preco);
    artigo.appendChild(botaoAdicionar);

    return artigo;
}

// Função para adicionar um produto ao cesto
function adicionarAoCesto(produto) {
    const cestoAtual = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
    cestoAtual.push(produto);
    localStorage.setItem("produtos-selecionados", JSON.stringify(cestoAtual));
    atualizaCesto();
}

// Função para atualizar o cesto com os produtos do Local Storage
function atualizaCesto() {
    const produtosEscolhidos = document.getElementById("produtos-escolhidos");
    const valorTotal = document.getElementById("valor-total");

    const cestoAtual = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];

    produtosEscolhidos.innerHTML = "";

    cestoAtual.forEach((produto) => {
        const artigoCesto = criaProdutoCesto(produto);
        produtosEscolhidos.appendChild(artigoCesto);
    });

    const total = cestoAtual.reduce((soma, produto) => soma + produto.price, 0);
    valorTotal.textContent = total.toFixed(2) + " €";
}

// Função para criar o elemento <article> no cesto
function criaProdutoCesto(produto) {
    const artigo = document.createElement("article");
    artigo.className = "produto-cesto";

    const imagem = document.createElement("img");
    imagem.src = produto.image;
    imagem.alt = produto.name;

    const titulo = document.createElement("h4");
    titulo.textContent = produto.name;

    const preco = document.createElement("p");
    preco.innerHTML = `<strong>${produto.price.toFixed(2)} €</strong>`;

    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "- Remover do Cesto";

    botaoRemover.addEventListener("click", () => {
        removerDoCesto(produto);
    });

    artigo.appendChild(imagem);
    artigo.appendChild(titulo);
    artigo.appendChild(preco);
    artigo.appendChild(botaoRemover);

    return artigo;
}

// Função para remover um produto do cesto
function removerDoCesto(produto) {
    let cestoAtual = JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
    cestoAtual = cestoAtual.filter((item) => item.id !== produto.id);
    localStorage.setItem("produtos-selecionados", JSON.stringify(cestoAtual));
    atualizaCesto();
}
