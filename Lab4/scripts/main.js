document.getElementById('header-text').addEventListener('mouseover', function() {
    this.textContent = '1. Obrigado por passares!';
});
document.getElementById('header-text').addEventListener('mouseout', function() {
    this.textContent = '1. Passa por aqui!';  // Retorna ao texto original quando o mouse sai
});


document.getElementById('red-btn').addEventListener('click', function () {
  document.getElementById('color-change-text').style.color = 'red';
});

document.getElementById('green-btn').addEventListener('click', function () {
  document.getElementById('color-change-text').style.color = 'green';
});

document.getElementById('blue-btn').addEventListener('click', function () {
  document.getElementById('color-change-text').style.color = 'blue';
});

document.getElementById('submit-color').addEventListener('click', function () {
  const color = document.getElementById('color-input').value;
  document.body.style.backgroundColor = color;
});

let count = 0;
document.getElementById('count-btn').addEventListener('click', function () {
  count++;
  document.getElementById('count').textContent = count;
});

const inputBox = document.getElementById('text-input');
const colors = ['#d3d3d3', '#add8e6', '#90ee90'];
let colorIndex = 0;

inputBox.addEventListener('input', () => {
  colorIndex = (colorIndex + 1) % colors.length;
  inputBox.style.backgroundColor = colors[colorIndex];
});
