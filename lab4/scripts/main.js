let totalInteracoes = 0;

function atualizarContador(mensagem) {
  totalInteracoes += 1;
  document.getElementById("contador-valor").textContent = totalInteracoes;
  document.getElementById("mensagem").textContent = mensagem;
}

function contarClique() {
  atualizarContador("Boa! O clique foi registado.");
}

function duploClique(cartao) {
  atualizarContador("Dois cliques seguidos: encontraste o evento secreto.");
  cartao.classList.toggle("ativo");
  cartao.querySelector("h3").textContent = "Duplo clique!";
}

function entrouNoCartao(cartao) {
  cartao.style.transform = "rotate(-2deg) translateY(-8px)";
  cartao.querySelector(".pista").textContent = "estás por cima";
}

function saiuDoCartao(cartao) {
  cartao.style.transform = "";
  cartao.querySelector(".pista").textContent = "volta quando quiseres";
}

function moverRato(evento, cartao) {
  const area = cartao.getBoundingClientRect();
  const x = Math.round(evento.clientX - area.left);
  const y = Math.round(evento.clientY - area.top);
  document.getElementById("coordenadas").textContent = `Posição: ${x}px à esquerda, ${y}px acima.`;
  cartao.style.background = `radial-gradient(circle at ${x}px ${y}px, #f7c948, #d7cdf2 45%)`;
}
