if (!localStorage.getItem("produtos-selecionados")) {
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
}

document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos(produtos); 
    atualizaCesto(); 
});

function carregarProdutos(produtos) {
    const listaProdutos = document.getElementById("lista-produtos");

    produtos.forEach((produto) => {
        const artigoProduto = criarProduto(produto);
        listaProdutos.appendChild(artigoProduto);
    });
}

function criarProduto(produto) {
    const artigo = document.createElement("article");
    artigo.className = "produto";

    const titulo = document.createElement("h3");
    titulo.textContent = produto.title;

    const imagem = document.createElement("img");
    imagem.src = produto.image;
    imagem.alt = produto.title;

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

function adicionarAoCesto(produto) {
    const cestoAtual = JSON.parse(localStorage.getItem("produtos-selecionados"));
    cestoAtual.push(produto); 
    localStorage.setItem("produtos-selecionados", JSON.stringify(cestoAtual)); e
    atualizaCesto(); 
}

function atualizaCesto() {
    const produtosEscolhidos = document.getElementById("produtos-escolhidos");
    const valorTotal = document.getElementById("valor-total");

    const cestoAtual = JSON.parse(localStorage.getItem("produtos-selecionados"));

    produtosEscolhidos.innerHTML = "";

    cestoAtual.forEach((produto) => {
        const artigoCesto = criaProdutoCesto(produto);
        produtosEscolhidos.appendChild(artigoCesto);
    });

    const total = cestoAtual.reduce((soma, produto) => soma + produto.price, 0);
    valorTotal.textContent = total.toFixed(2) + " €";
}

function criaProdutoCesto(produto) {
    const artigo = document.createElement("article");
    artigo.className = "produto-cesto";

    const imagem = document.createElement("img");
    imagem.src = produto.image;
    imagem.alt = produto.title;

    const titulo = document.createElement("h4");
    titulo.textContent = produto.title;

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

function removerDoCesto(produto) {
    let cestoAtual = JSON.parse(localStorage.getItem("produtos-selecionados"));

    cestoAtual = cestoAtual.filter((item) => item.id !== produto.id);

    localStorage.setItem("produtos-selecionados", JSON.stringify(cestoAtual));

    atualizaCesto();
}
