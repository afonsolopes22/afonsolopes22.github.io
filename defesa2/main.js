const API_URL = "https://deisishop.pythonanywhere.com/products";
let numeroEncomendas = 0;

document.addEventListener("DOMContentLoaded", () => {
    const elementos = {
        productList: document.getElementById("product-list"),
        cartItems: document.getElementById("cart-items"),
        totalPrice: document.getElementById("total-price"),
        studentCheckbox: document.getElementById("student-checkbox"),
        buyButton: document.getElementById("buy-button"),
        finalPrice: document.getElementById("final-price"),
        searchInput: document.getElementById("search"),
        categoryFilter: document.getElementById("category-filter"),
        sortOptions: document.getElementById("sort-options"),
    };

    let produtos = [];
    let cesto = [];
    let produtosFiltrados = [];

    async function carregarProdutos() {
        try {
            const response = await fetch(API_URL);
            produtos = await response.json();
            produtosFiltrados = [...produtos];
            exibirProdutos(produtosFiltrados, elementos.productList);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        }
    }

    function exibirProdutos(lista, container) {
        container.innerHTML = lista.map(criarTemplateProduto).join("");
        container.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", () => {
                const id = parseInt(button.dataset.id);
                adicionarAoCesto(produtos.find(p => p.id === id));
            });
        });
    }

    function criarTemplateProduto(produto) {
        return `
            <article>
                <img src="${produto.image}" alt="${produto.title}">
                <h3>${produto.title}</h3>
                <p>Preço: ${produto.price}€</p>
                <button data-id="${produto.id}">+ Adicionar ao Cesto</button>
            </article>
        `;
    }

    function adicionarAoCesto(produto) {
        cesto.push(produto);
        atualizarCesto();
    }

    function removerDoCesto(id) {
        cesto = cesto.filter(produto => produto.id !== id);
        atualizarCesto();
    }

    function atualizarCesto() {
        elementos.cartItems.innerHTML = cesto
            .map(produto => criarTemplateCesto(produto))
            .join("");
        elementos.cartItems.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", () => {
                const id = parseInt(button.dataset.id);
                removerDoCesto(id);
            });
        });
        atualizarCustoTotal();
    }

    function criarTemplateCesto(produto) {
        return `
            <article>
                <img src="${produto.image}" alt="${produto.title}">
                <h3>${produto.title}</h3>
                <p>Preço: ${produto.price}€</p>
                <button data-id="${produto.id}">- Remover do Cesto</button>
            </article>
        `;
    }

    function atualizarCustoTotal() {
        const total = cesto.reduce((acc, produto) => acc + produto.price, 0);
        elementos.totalPrice.textContent = `Custo total: ${total.toFixed(2)}€`;
    }

    function aplicarDesconto(total) {
        const IVA = 0.23;
        return elementos.studentCheckbox.checked ? total * (1 - IVA) : total;
    }

    function gerarReferencia() {
        const hoje = new Date();
        const data = hoje.toISOString().split("T")[0].split("-").reverse().join("");
        numeroEncomendas += 1;
        return `${data}-${numeroEncomendas.toString().padStart(4, "0")}`;
    }

    function filtrarProdutos() {
        const termo = elementos.searchInput.value.toLowerCase();
        const categoria = elementos.categoryFilter.value;


        produtosFiltrados = produtos.filter(produto => {
            const tituloInclui = produto.title.toLowerCase().includes(termo);
            const categoriaInclui = categoria === "all" || produto.category === categoria;
            return tituloInclui && categoriaInclui;
        });

        ordenarProdutos();
    }

    function ordenarProdutos() {
        const ordem = elementos.sortOptions.value;

        if (ordem === "asc") {
            produtosFiltrados.sort((a, b) => a.rating - b.rating);
        } else if (ordem === "desc") {
            produtosFiltrados.sort((a, b) => b.rating - a.rating);
        }

        exibirProdutos(produtosFiltrados, elementos.productList);
    }

    function processarCompra() {
        const total = cesto.reduce((acc, produto) => acc + produto.price, 0);
        const totalComDesconto = aplicarDesconto(total);
        const referencia = gerarReferencia();
        const morada= document.getElementById("address").value.trim;


        if(!morada){
            alert("Insira a morada")
        return;
        }

        elementos.finalPrice.innerHTML = `
            <p>Valor final a pagar (com eventuais descontos): ${totalComDesconto.toFixed(2)}€</p>
            <p>Referência de pagamento: ${referencia}</p>
            <p>address:${morada}</p>
        `;

        cesto = [];
        atualizarCesto();
    }
    function adicionarTodos(){
        produtosFiltrados.forEach(produto=> {
            if(!cesto.name(item=> item.id=== produto.id)){
                cesto.push(produto)
            }
        })
        atualizarCesto()
    }
     
    elementos.buyButton.addEventListener("click", processarCompra);
    elementos.searchInput.addEventListener("input", filtrarProdutos);
    elementos.categoryFilter.addEventListener("change", filtrarProdutos);
    elementos.sortOptions.addEventListener("change", ordenarProdutos);

    carregarProdutos();
});
