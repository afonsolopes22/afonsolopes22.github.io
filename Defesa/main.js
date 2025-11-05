const API_URL = "https://deisishop.pythonanywhere.com/products";
let numeroEncomendas = 0;

document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const cartItems = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const studentCheckbox = document.getElementById("student-checkbox");
    const buyButton = document.getElementById("buy-button");
    const finalPriceElement = document.getElementById("final-price");
    const searchInput = document.getElementById("search");
    const categoryFilter = document.getElementById("category-filter");
    const sortOptions = document.getElementById("sort-options");
    const addAllButton = document.getElementById("add-all-button");
    const toggleDescriptionsButton = document.getElementById("toggle-descriptions");
    const addressInput = document.getElementById("address");

    let produtos = [];
    let cesto = [];
    let produtosFiltrados = [];

    async function carregarProdutos() {
        try {
            const response = await fetch(API_URL);
            produtos = await response.json();
            produtosFiltrados = [...produtos]; 
            exibirProdutos(produtosFiltrados);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        }
    }

    function exibirProdutos(lista) {
        productList.innerHTML = "";
        lista.forEach(produto => {
            const artigo = criarProduto(produto);
            productList.appendChild(artigo);
        });
    }

    function criarProduto(produto) {
        const article = document.createElement("article");

        const img = document.createElement("img");
        img.src = produto.image;

        const title = document.createElement("h3");
        title.textContent = produto.title;

        const price = document.createElement("p");
        price.textContent = `Preço: ${produto.price}€`;

        const description = document.createElement("p");
        description.classList.add("description");
        description.textContent = produto.description;

        const button = document.createElement("button");
        button.textContent = "+ Adicionar ao Cesto";
        button.addEventListener("click", () => adicionarAoCesto(produto));

        article.append(img, title, price, description, button);
        return article;
    }

    function adicionarAoCesto(produto) {
        cesto.push(produto);
        atualizarCesto();
    }

    function removerDoCesto(produto) {
        cesto = cesto.filter(p => p.id !== produto.id);
        atualizarCesto();
    }

    function atualizarCesto() {
        cartItems.innerHTML = "";
        let total = 0;

        cesto.forEach(produto => {
            const article = document.createElement("article");

            const title = document.createElement("h3");
            title.textContent = produto.title;

            const price = document.createElement("p");
            price.textContent = `Preço: ${produto.price}€`;

            const button = document.createElement("button");
            button.textContent = "- Remover do Cesto";
            button.addEventListener("click", () => removerDoCesto(produto));

            article.append(title, price, button);
            cartItems.appendChild(article);

            total += produto.price;
        });

        totalPriceElement.textContent = `Custo total: ${total.toFixed(2)}€`;
    }

    function aplicarDesconto(total) {
        const IVA = 0.23; // IVA de 23%
        return studentCheckbox.checked ? total * (1 - IVA) : total;
    }

    function gerarReferencia() {
        const hoje = new Date();
        const data = hoje.toISOString().split("T")[0].split("-").reverse().join("");
        numeroEncomendas += 1;
        return `${data}-${numeroEncomendas.toString().padStart(4, "0")}`;
    }

    function filtrarProdutos() {
        const termo = searchInput.value.toLowerCase();
        const categoria = categoryFilter.value;

        produtosFiltrados = produtos.filter(produto => {
            const tituloInclui = produto.title.toLowerCase().includes(termo);
            const descricaoInclui = produto.description.toLowerCase().includes(termo);
            const categoriaInclui = categoria === "all" || produto.category === categoria;
            return (tituloInclui || descricaoInclui) && categoriaInclui;
        });

        ordenarProdutos();
    }

    function ordenarProdutos() {
        const ordem = sortOptions.value;

        if (ordem === "asc") {
            produtosFiltrados.sort((a, b) => a.price - b.price);
        } else if (ordem === "desc") {
            produtosFiltrados.sort((a, b) => b.price - a.price);
        } else if (ordem === "rating-asc") {
            produtosFiltrados.sort((a, b) => a.rating.rate - b.rating.rate);
        } else if (ordem === "rating-desc") {
            produtosFiltrados.sort((a, b) => b.rating.rate - a.rating.rate);
        }

        exibirProdutos(produtosFiltrados);
    }

    addAllButton.addEventListener("click", () => {
        cesto = [...produtosFiltrados];
        atualizarCesto();
    });

    toggleDescriptionsButton.addEventListener("click", () => {
        const descriptions = document.querySelectorAll(".description");
        descriptions.forEach(desc => {
            if (desc.style.display === "none") {
                desc.style.display = "block"; 
                toggleDescriptionsButton.textContent = "Menos Info"; 
            } else {
                desc.style.display = "none";
                toggleDescriptionsButton.textContent = "Mais Info"; 
            }
        });
    });
    

    buyButton.addEventListener("click", () => {
        const total = cesto.reduce((acc, produto) => acc + produto.price, 0);
        const totalComDesconto = aplicarDesconto(total);
        const referencia = gerarReferencia();
        const address = addressInput.value;

        finalPriceElement.innerHTML = `
            <p>Valor final a pagar (com eventuais descontos): ${totalComDesconto.toFixed(2)}€</p>
            <p>Referência de pagamento: ${referencia}</p>
            <p>Endereço: ${address || "Não fornecido"}</p>
        `;

        cesto = [];
        atualizarCesto();
    });

    searchInput.addEventListener("input", filtrarProdutos);
    categoryFilter.addEventListener("change", filtrarProdutos);
    sortOptions.addEventListener("change", ordenarProdutos);

    carregarProdutos();
});
