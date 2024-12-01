const buttons = document.querySelectorAll('.Herramienta button, .selectores button');

buttons.forEach(button => {
  button.addEventListener('click', () => {

    buttons.forEach(btn => btn.classList.remove('active'));
    
    button.classList.add('active');
  });
});

let letras = [];

const Orden = document.getElementById('Orden');
Orden.addEventListener('input', function() {
  this.value = this.value.toUpperCase();
  this.value = this.value.replace(/[^A-Z]/g, '');
  this.value = this.value.split('').filter(letra => letras.includes(letra)).join('');
  let uniqueLetters = [];
  for (let i = 0; i < this.value.length; i++) {
    if (!uniqueLetters.includes(this.value[i])) {
      uniqueLetters.push(this.value[i]);
    }
  }
  
  this.value = uniqueLetters.join('');

});

Orden.addEventListener('click', function() {
  letras = [];
  document.querySelectorAll('.nodo').forEach((l) => {
    letras.push(l.innerText);
  });
  const raiz = document.querySelector('.raiz');
  if(Orden.value === null && raiz !== null){
    Orden.value = raiz.innerText;
  }
});

dGrafo.addEventListener('mouseenter', () => {
  if(creaNodo) 
  {
    circulo.style.display = 'block';
    dGrafo.style.cursor = 'none';
  }
});

dGrafo.addEventListener('mouseleave', () => {
  if(creaNodo) 
  {
    circulo.style.display = 'none';
    dGrafo.style.cursor = 'auto';
  }
});

dGrafo.addEventListener('mousemove', (e) => {
  if(creaNodo){
    const posX = e.offsetX + rect.left;
    const posY = e.offsetY + rect.top;
    
    circulo.style.left = `${posX}px`;
    circulo.style.top = `${posY}px`;
  }
  if(mueveNodo && nodoMov !== null)
  {
    const nMov = document.getElementById(nodoMov);
    const posX = e.offsetX + rect.left;
    const posY = e.offsetY + rect.top;
    
    nMov.style.left = `${posX}px`;
    nMov.style.top = `${posY}px`;

    aristas.forEach(a => {
      if(a.nodosID[0] === nodoMov || a.nodosID[1] === nodoMov)
      {
        actualizarArista(a.nodosID[0], a.nodosID[1]);
      }
    });
  }
});