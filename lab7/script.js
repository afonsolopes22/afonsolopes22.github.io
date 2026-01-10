// Base da API e endpoints
const API_BASE = 'https://deisishop.pythonanywhere.com';
const urlP = `${API_BASE}/products`;
const urlC = `${API_BASE}/categories`;

// pega as seções onde vamos mostrar os produtos e o cesto de compras
const secaoProdutos = document.getElementById('produtos');
const secaoCesto = document.getElementById('cesto');

// elemento onde mostra o valor total da compra
const valorTotalP = document.querySelector('#vlr')

// arrays para guardar os produtos e categorias
let produtos = []
let produtosFiltrados = []
let valorTotal = 0.0;
let categorias = []
// controla se as imagens estão visíveis
let imagensVisiveis = true;

// objeto para guardar os filtros ativos
const filtros = {
    pesquisa: '',
    categoria: 'Todas as categorias',
    ordenacao: 'nome'
}
async function carregarProdutos() {
  try {
    const response = await fetch(urlP);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    produtos = await response.json();
  } catch (e) {
    console.warn("API falhou, a usar products.json local:", e);
    const localRes = await fetch("./products.json");
    produtos = await localRes.json();
  }

  produtosFiltrados = [...produtos];
  carregarCategorias();
  carregarLocalStorage();
  aplicarFiltros();
}

async function carregarProdutos() {
  try {
    const r = await fetch(urlP);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    produtos = await r.json();
  } catch (e) {
    console.warn("API bloqueada no Live Preview, a usar fallback local", e);

    // fallback mínimo para não ficar vazio
    produtos = [
      {
        id: 1,
        title: "Produto Exemplo",
        price: 10,
        description: "API bloqueada no Live Preview",
        category: "Exemplo",
        image: "",
        rating: { count: 0 }
      }
    ];
  }

  produtosFiltrados = [...produtos];
  carregarLocalStorage();
  aplicarFiltros();
}


// carrega as categorias dos produtos
function carregarCategorias() {
    fetch(urlC)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => categorias = data)
        .catch(error => console.error('Erro ao carregar categorias:', error));
}

// aplica os filtros de pesquisa, categoria e ordenação
function aplicarFiltros() {
    let produtosTemp = [...produtos]; // trabalha com cópia dos produtos

    // filtra por texto de pesquisa
    if (filtros.pesquisa) {
        produtosTemp = produtosTemp.filter(produto =>
            // verifica se o nome do produto contém o texto pesquisado
            produto.title.toLowerCase().includes(filtros.pesquisa.toLowerCase())
        );
    }

    // filtra por categoria
    if (filtros.categoria && filtros.categoria !== 'Todas as categorias') {
        produtosTemp = produtosTemp.filter(produto =>
            produto.category === filtros.categoria
        );
    }

    // ordena os produtos
    produtosTemp = ordenarProdutos(produtosTemp, filtros.ordenacao);

    produtosFiltrados = produtosTemp;
    renderizarProdutos(); // mostra os produtos filtrados
}

// ordena os produtos conforme o critério escolhido
function ordenarProdutos(arrayProdutos, crit) {
    return arrayProdutos.sort((a, b) => {
        switch (crit) {
            case 'nome':
                return a.title.localeCompare(b.title); // ordena por nome A-Z
            case 'preco':
                return a.price - b.price; // ordena por preço crescente
            case 'preco-desc':
                return b.price - a.price; // ordena por preço decrescente
            case 'avaliacoes':
                return (a.rating && a.rating.count ? a.rating.count : 0) - (b.rating && b.rating.count ? b.rating.count : 0);
            case 'avaliacoes-desc':
                return (b.rating && b.rating.count ? b.rating.count : 0) - (a.rating && a.rating.count ? a.rating.count : 0);
            default:
                return 0; // sem ordenação
        }
    })
}

// mostra os produtos na tela
function renderizarProdutos() {
    secaoProdutos.innerHTML = ''; // limpa a seção

    // cria um card para cada produto filtrado
    produtosFiltrados.forEach(produto => {
        const art = criarProduto(produto);
        secaoProdutos.appendChild(art);
    });

    // atualiza contador de produtos visíveis (filtrados/renderizados)
    const contEl = document.getElementById('contagemProdutos');
    if (contEl) {
        contEl.textContent = `Produtos visíveis: ${produtosFiltrados.length}`;
    }
}

// atualiza o valor total mostrado na tela
function attCesto() {
    if (valorTotalP) {
        valorTotalP.textContent = `${valorTotal.toFixed(2)}€`
    }
}

// guarda o cesto no localStorage do navegador
function guardarCestoLocalStorage() {
    const itensNoCesto = [];
    // pega os IDs de todos os produtos no cesto
    secaoCesto.querySelectorAll('article').forEach(produto => {
        itensNoCesto.push(String(produto.id));
    })
    localStorage.setItem('cesto', JSON.stringify(itensNoCesto));
    localStorage.setItem('valor', valorTotal.toString());
}

// carrega o cesto salvo no localStorage
function carregarLocalStorage() {
    secaoProdutos.innerHTML = '';
    secaoCesto.innerHTML = '';

    // pega os produtos e valor salvos
    const produtosNoCesto = JSON.parse(localStorage.getItem('cesto')) || [];
    const valorCesto = parseFloat(localStorage.getItem('valor') || 0.0);

    valorTotal = valorCesto;
    attCesto();

    if (!produtos || produtos.length === 0) {
        console.log('Nenhum produto carregado')
        return;
    }

    aplicarFiltros();

    // para cada produto, verifica se estava no cesto salvo
    produtos.forEach(produto => {
        if (produtosNoCesto.includes(String(produto.id))) {
            const art = criarProduto(produto);
            secaoCesto.appendChild(art);
            // muda o botão para "remover"
            art.querySelector('button').textContent = '- Remover do Cesto';
            art.querySelector('button').className = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded";
        }
    })
}

// cria o elemento HTML de um produto
function criarProduto(produto) {
    const art = document.createElement('article');
    art.id = produto.id;
    art.className = 'bg-white p-4 rounded-lg shadow-md flex flex-col w-full max-w-sm mx-auto';

    // título do produto
    const title = document.createElement("h3");
    title.textContent = produto.title
    title.className = "font-bold text-lg mb-2 h-12 overflow-hidden";
    art.appendChild(title);

    // container da imagem
    const imageContainer = document.createElement("section");
    imageContainer.className = "h-48 flex items-center justify-center bg-gray-50 rounded-lg mb-2 p-2";

    const im = document.createElement("img");
    // some product image paths are relative ("/media/...");
    // prefix with API base so the browser requests the correct host.
    if (produto.image && (produto.image.startsWith('http://') || produto.image.startsWith('https://'))) {
        im.src = produto.image;
    } else if (produto.image && produto.image.startsWith('/')) {
        im.src = API_BASE + produto.image;
    } else {
        im.src = produto.image || '';
    }
    im.className = "max-h-full max-w-full object-contain";
    // aplica estado atual de visibilidade de imagens
    im.style.display = imagensVisiveis ? '' : 'none';

    imageContainer.appendChild(im);
    art.appendChild(imageContainer);

    // preço do produto
    const valor = document.createElement("p");
    valor.textContent = `Custo total: ${produto.price}€`
    valor.className = "font-bold text-green-600 mb-2";
    art.appendChild(valor);

    // descrição do produto
    const desc = document.createElement("p");
    desc.textContent = produto.description;
    desc.className = "text-gray-600 text-sm mb-3";
    art.appendChild(desc);

    // botão de adicionar/remover do cesto
    const btn = document.createElement("button")
    btn.textContent = `+ Adicionar ao Cesto`
    btn.className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
    art.appendChild(btn);

    // evento de clique no botão
    btn.addEventListener("click", () => {
        if (art.parentElement != secaoCesto) {
            // se o produto não está no cesto, adiciona
            secaoCesto.appendChild(art);
            btn.textContent = "- Remover do Cesto"
            btn.className = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded";
            valorTotal += produto.price;
        } else {
            // se o produto está no cesto, remove
            if (produtosFiltrados.some(p => p.id === produto.id)) {
                secaoProdutos.appendChild(art);
            }
            btn.textContent = "+ Adicionar ao Cesto"
            btn.className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
            valorTotal -= produto.price;
        }
        attCesto();
        guardarCestoLocalStorage(); // salva as mudanças
    })

    return art;
}

// configura os eventos dos filtros
function setupFiltros() {

    // filtro de pesquisa por texto
    const inputPesquisa = document.getElementById('pesquisa');
    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', (e) => {
            filtros.pesquisa = e.target.value;
            aplicarFiltros();
        });
    }

    // filtro por categoria
    const selectTipo = document.getElementById('tipo');
    if (selectTipo) {
        selectTipo.addEventListener('change', function () {
            filtros.categoria = this.value;
            aplicarFiltros();
        });
    }

    // ordenação dos produtos
    const selectOrdenacao = document.getElementById('order');
    if (selectOrdenacao) {
        selectOrdenacao.addEventListener('change', function () {
            switch (this.value) {
                case 'Preço Crescente':
                    filtros.ordenacao = 'preco';
                    break;
                case 'Preço Decrescente':
                    filtros.ordenacao = 'preco-desc';
                    break;
                case 'Avaliações Crescente':
                    filtros.ordenacao = 'avaliacoes';
                    break;
                case 'Avaliações Decrescente':
                    filtros.ordenacao = 'avaliacoes-desc';
                    break;
                case 'Ordenar pelo preço':
                case 'Ordenar por nome':
                default:
                    filtros.ordenacao = 'nome';
                    break;
            }
            aplicarFiltros();
        });
    }
}

// quando a página carrega, configura tudo
document.addEventListener('DOMContentLoaded', function () {
    const limparCestoBtn = document.getElementById('limparCesto');
    const comprarBtn = document.getElementById('comprar');
    const estDeisi = document.getElementById('deisi');
    const cupom = document.getElementById('cupom');
    const msg = document.getElementById('res');
    const url = "https://deisishop.pythonanywhere.com/buy/";

    // botão para limpar o cesto
    if (limparCestoBtn) {
        limparCestoBtn.addEventListener('click', () => {
            localStorage.removeItem('cesto');
            localStorage.removeItem('valor');
            valorTotal = 0;
            attCesto();
            secaoCesto.innerHTML = '';
        });
    }

    // botão para remover todos os produtos do cesto e restaurar a UI
    const removerTodosBtn = document.getElementById('removerTodos');
    if (removerTodosBtn) {
        removerTodosBtn.addEventListener('click', () => {
            const artigos = Array.from(secaoCesto.querySelectorAll('article'));
            artigos.forEach(art => {
                const id = art.id;
                const produto = produtos.find(p => String(p.id) === String(id));
                const btn = art.querySelector('button');

                if (produto && produtosFiltrados.some(p => p.id === produto.id)) {
                    secaoProdutos.appendChild(art);
                } else {
                    // se o produto não estiver na lista filtrada, remove do DOM
                    art.remove();
                }

                if (btn) {
                    btn.textContent = "+ Adicionar ao Cesto";
                    btn.className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
                }
            });

            // limpa estado e atualiza UI/localStorage
            valorTotal = 0;
            attCesto();
            guardarCestoLocalStorage();
        });
    }

    // botão para finalizar a compra
    if (comprarBtn && secaoCesto) {
        comprarBtn.addEventListener('click', async () => {
            msg.textContent = "A processar compra...";
            msg.style.color = "black";

            // pega os IDs dos produtos no cesto
            const products = Array.from(secaoCesto.querySelectorAll('article'))
                .map(art => art.id)
                .filter(id => id);

            const student = estDeisi ? estDeisi.checked : false; // desconto de estudante
            const coupon = cupom ? cupom.value.trim() : ''; // cupom de desconto

            const dados = { products, student, coupon };

            try {
                // envia a compra para a API
                const resposta = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dados)
                });

                const data = await resposta.json();

                if (resposta.ok && data.totalCost !== undefined) {
                    msg.style.color = "black";
                    // mostra valor/ref e, por baixo, a mensagem retornada pela API (se existir)
                    msg.innerHTML = '';
                    const linhaRef = document.createElement('div');
                    linhaRef.textContent = `Valor final: ${data.totalCost}€ | Ref: ${data.reference}`;
                    msg.appendChild(linhaRef);
                    if (data.message) {
                        const linhaMsg = document.createElement('div');
                        linhaMsg.textContent = data.message;
                        linhaMsg.style.marginTop = '4px';
                        linhaMsg.style.fontSize = '0.95em';
                        msg.appendChild(linhaMsg);
                    }
                } else {
                    // tenta mostrar a mensagem de erro retornada pela API
                    msg.style.color = "red";
                    msg.textContent = data.error || data.message || "Erro do servidor";
                    throw new Error(data.error || data.message || "Erro do servidor");
                }
            } catch (erro) {
                console.error(erro);
                msg.style.color = "red";
                msg.textContent = "Erro ao efetuar compra!";
            }
        });
    }

    // botão para ocultar/mostrar imagens
    const toggleImagensBtn = document.getElementById('toggleImagens');
    if (toggleImagensBtn) {
        toggleImagensBtn.addEventListener('click', () => {
            imagensVisiveis = !imagensVisiveis;
            const imgs = document.querySelectorAll('#produtos img, #cesto img');
            imgs.forEach(img => img.style.display = imagensVisiveis ? '' : 'none');
            toggleImagensBtn.textContent = imagensVisiveis ? 'Ocultar imagens' : 'Mostrar imagens';
        });
    }

    // configura os filtros e carrega os produtos
    setupFiltros();
    carregarProdutos();
});