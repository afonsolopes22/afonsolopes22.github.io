// Verifica se existe um cesto inicial no localStorage, caso contrário, inicializa um cesto vazio.
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

    // Adiciona o evento para adicionar o produto ao cesto
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
    let cestoAtual = JSON.parse(localStorage.getItem("produtos-selecionados"));

    // Verifica se o produto já está no cesto
    const index = cestoAtual.findIndex((item) => item.id === produto.id);

    if (index === -1) {
        // Se não estiver, adiciona o produto com quantidade 1
        cestoAtual.push({ ...produto, quantidade: 1 });
    } else {
        // Se já estiver, incrementa a quantidade
        cestoAtual[index].quantidade++;
    }

    localStorage.setItem("produtos-selecionados", JSON.stringify(cestoAtual));
    atualizaCesto();
}

function atualizaCesto() {
    console.log("Atualizando o cesto...");
    const produtosEscolhidos = document.getElementById("produtos-escolhidos");
    const valorTotal = document.getElementById("valor-total");

    const cestoAtual = JSON.parse(localStorage.getItem("produtos-selecionados"));

    // Limpa a interface do cesto antes de atualizá-la
    produtosEscolhidos.innerHTML = "";

    cestoAtual.forEach((produto) => {
        const artigoCesto = criaProdutoCesto(produto);
        produtosEscolhidos.appendChild(artigoCesto);
    });

    // Calcula o valor total
    const total = cestoAtual.reduce((soma, produto) => soma + produto.price * produto.quantidade, 0);
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

    const quantidade = document.createElement("p");
    quantidade.textContent = `Quantidade: ${produto.quantidade}`;

    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "- Remover do Cesto";

    // Adiciona o evento para remover o produto do cesto
    botaoRemover.addEventListener("click", () => {
        removerDoCesto(produto);
    });

    artigo.appendChild(imagem);
    artigo.appendChild(titulo);
    artigo.appendChild(preco);
    artigo.appendChild(quantidade);
    artigo.appendChild(botaoRemover);

    return artigo;
}

function removerDoCesto(produto) {
    let cestoAtual = JSON.parse(localStorage.getItem("produtos-selecionados"));

    const index = cestoAtual.findIndex((item) => item.id === produto.id);

    if (index !== -1) {
        if (cestoAtual[index].quantidade > 1) {
            // Decrementa a quantidade se for maior que 1
            cestoAtual[index].quantidade--;
        } else {
            // Remove o produto se a quantidade for 1
            cestoAtual.splice(index, 1);
        }
    }

    localStorage.setItem("produtos-selecionados", JSON.stringify(cestoAtual));
    atualizaCesto();
}
