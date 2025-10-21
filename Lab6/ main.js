document.addEventListener("DOMContentLoaded", function() {
  carregarProdutos(produtos); // Verifica se a função é chamada quando a página carrega
});

function carregarProdutos(produtos) {
  console.log(produtos); // Verifique no console se os dados dos produtos estão sendo carregados
  const container = document.querySelector(".produto-container");

  produtos.forEach(produto => {
    const produtoElemento = criarProduto(produto);
    container.appendChild(produtoElemento);
  });
}

function criarProduto(produto) {
  const artigo = document.createElement("article");

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;
  artigo.appendChild(titulo);

  const imagem = document.createElement("img");
  imagem.src = produto.image;
  imagem.alt = produto.title;
  artigo.appendChild(imagem);

  const descricao = document.createElement("p");
  descricao.textContent = `Custo total: €${produto.price.toFixed(2)}`;
  artigo.appendChild(descricao);

  const descricaoDetalhada = document.createElement("p");
  descricaoDetalhada.textContent = produto.description;
  artigo.appendChild(descricaoDetalhada);

  const botao = document.createElement("button");
  botao.textContent = "+ Adicionar ao Cesto";
  artigo.appendChild(botao);

  return artigo;
}
