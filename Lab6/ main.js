/*
 * Arquivo: main.js
 * Carrega os dados do array 'produtos' (do produtos.js) e insere na página.
 */

document.addEventListener('DOMContentLoaded', () => {
    // A variável 'produtos' é carregada via produtos.js
    if (typeof produtos === 'undefined' || produtos.length === 0) {
        console.error("O array 'produtos' não foi encontrado ou está vazio.");
        document.getElementById('products-list').innerHTML = '<p>Não foi possível carregar os produtos.</p>';
        return;
    }

    const productsListElement = document.getElementById('products-list');

    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-id', produto.id);

        // Formata o preço para o formato local (ex: 22,50 €)
        const priceFormatted = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(produto.price);
        
        // Limita a descrição para caber melhor no cartão (aproximadamente 100 caracteres)
        const descriptionSnippet = produto.description.length > 100 
            ? produto.description.substring(0, 100) + '...' 
            : produto.description;

        card.innerHTML = `
            <img src="${produto.image}" alt="${produto.title}">
            
            <div class="content-wrapper">
                <h3>${produto.title}</h3>
                <p class="description">${descriptionSnippet}</p>
            </div>
            
            <div class="bottom-info">
                <div class="price">Custo total: ${priceFormatted}</div>
                <button class="add-to-cart" data-product-id="${produto.id}">
                    + Adicionar ao Cesto
                </button>
            </div>
        `;

        productsListElement.appendChild(card);
    });
});