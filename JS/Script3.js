const Normal = document.getElementById('Normal');
const Binario = document.getElementById('Binario');
const dBinario = document.getElementById('DibujoABinario');
const addAltura = document.getElementById('addAltura');
const deleteAltura = document.getElementById('deleteAltura');
const arbol = document.getElementById('Arbol');
const busqueda = document.getElementById('busqueda_contenedor');
const mPesos = document.getElementById('mostrarPesos');

let modoNormal =  true;
let modoBinario = false;
let alturaActual = 0;

const nodoAA = document.getElementById('addNodoAA');
nodoAA.addEventListener('click',(e) => {
    if(nodoAA.id === `addNodo${nodoAA.id.slice(-2)}`)
    {
        nodoAA.id = `nBinario${nodoAA.id.slice(-2)}`;
        nodoAA.innerText = ' ';
    }
    else if(nodoAA.id === `nBinario${nodoAA.id.slice(-2)}`)
    {
        const txt = prompt("Ingrese el texto:");
        nodoAA.innerText = txt;
    }
});

nodoAA.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if(nodoAA.id === `nBinario${nodoAA.id.slice(-2)}`)
    {
        let i = nodoAA.id.slice(-2,-1).charCodeAt(0) - 64;
        let j = nodoAA.id.slice(-1).charCodeAt(0) - 64;
        eliminarNBinario(i, j);
    } 
});

Normal.addEventListener('click', () =>{
    if(modoBinario)
    {
        modoBinario = false;
        modoNormal = true;
        dGrafo.classList.remove('desactivado');
        dArbol.classList.remove('desactivado');
        dBinario.classList.add('desactivado');
        addArista.classList.remove('desactivado');
        addNodo.classList.remove('desactivado');
        moverNodo.classList.remove('desactivado');
        eliminarNodo.classList.remove('desactivado');
        cambiarPeso.classList.remove('desactivado');
        SelecRaiz.classList.remove('desactivado');
        CrearArbol.classList.remove('desactivado');
        busqueda.classList.remove('desactivado');
        mPesos.classList.remove('desactivado');
    }
});

Binario.addEventListener('click', () =>{
    if(modoNormal)
    {
        modoBinario = true;
        modoNormal = false;
        dGrafo.classList.add('desactivado');
        dArbol.classList.add('desactivado');
        dBinario.classList.remove('desactivado');
        addArista.classList.add('desactivado');
        addNodo.classList.add('desactivado');
        moverNodo.classList.add('desactivado');
        eliminarNodo.classList.add('desactivado');
        cambiarPeso.classList.add('desactivado');
        SelecRaiz.classList.add('desactivado');
        CrearArbol.classList.add('desactivado');
        busqueda.classList.add('desactivado');
        mPesos.classList.add('desactivado');
    }
});

function sumarAltura()
{
    alturaActual++;
    let a = Math.pow(2,alturaActual);
    let altura = 100/(alturaActual+1);
    let ancho = 100/a;
    arbol.style.gridTemplateColumns = `repeat(${a}, ${ancho}%)`;
    arbol.style.gridTemplateRows = `repeat(${alturaActual+1}, ${altura}%)`;
    return a;
}

addAltura.addEventListener('click', () => {
    let a = sumarAltura();
    for(let i  = 0; i < a; i++){
        const contenedor = document.createElement('div');
        contenedor.id = `contenedor${String.fromCharCode(alturaActual + 65)}${String.fromCharCode(i + 65)}`;
        const addNodo = document.createElement('button');
        addNodo.innerText = '+';
        addNodo.id = `addNodo${contenedor.id.slice(-2)}`;
        addNodo.addEventListener('click',() => {
            if(addNodo.id === `addNodo${addNodo.id.slice(-2)}`)
            {
                addNodo.id = `nBinario${addNodo.id.slice(-2)}`;
                addNodo.innerText = ' ';
                let a, b;
                
                i = parseInt(addNodo.id.slice(-2,-1).charCodeAt(0)-64);
                a = addNodo.getBoundingClientRect();
                if(i > 1)
                {
                    let j = parseInt(addNodo.id.slice(-1).charCodeAt(0)-64);
                    for(i; i > 1; i--)
                    {
                        let I = String.fromCharCode((i-1)+64);
                        let J = String.fromCharCode((j % 2 === 0 ? j/2 : (j+1)/2)+64);
                        const aNodo = document.getElementById(`addNodo${I}${J}`);
                        if(aNodo === null) {
                            b = document.getElementById(`nBinario${I}${J}`).getBoundingClientRect();
                            crearAristaBinario(a,b,I,J,String.fromCharCode(i+64),String.fromCharCode(j+64));
                            break;
                        }
                        else {''
                            aNodo.id = `nBinario${aNodo.id.slice(-2)}`;
                            aNodo.innerText = ' ';
                            b = aNodo.getBoundingClientRect();         
                            crearAristaBinario(a,b,I,J,String.fromCharCode(i+64),String.fromCharCode(j+64));
                            a = aNodo.getBoundingClientRect();
                            j = parseInt(aNodo.id.slice(-1).charCodeAt(0)-64);
                        }
                    }
                }
            }
            else if(addNodo.id === `nBinario${addNodo.id.slice(-2)}`)
            {
                const txt = prompt("Ingrese el texto:");
                addNodo.innerText = txt;
            }
        });

        addNodo.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if(addNodo.id === `nBinario${addNodo.id.slice(-2)}`)
            {
                let i = addNodo.id.slice(-2,-1).charCodeAt(0) - 64;
                let j = addNodo.id.slice(-1).charCodeAt(0) - 64;
                eliminarNBinario(i, j);
            } 
        });

        contenedor.appendChild(addNodo);
        arbol.appendChild(contenedor);
    }

    const contenedores = document.querySelectorAll('[id^="contenedor"]');
    contenedores.forEach(element => {
        let id = element.id;
        let i = [id.slice(-2,-1).charCodeAt(0) - 64, id.slice(-1).charCodeAt(0) - 64];
        let r = Math.pow(2,i[0]-1)
        let m = (a*i[1])/(r) + 1;
        let n = (m)-(a/r);
        element.style.gridColumn = `${n} / ${m}`;
        element.style.gridRow = `${i[0]} / ${i[0]+1}`;
    });

    ActualizarAristaBinario();

});

function eliminarNBinario(i, j){
    let I = String.fromCharCode((i-1)+64);
    let J = String.fromCharCode((j % 2 === 0 ? j/2 : (j+1)/2)+64);
    let aNodo =  document.getElementById(`nBinario${I}${J}`);
    if(aNodo !== null)
    {
        document.getElementById(`bArista${I}${J}-${String.fromCharCode(i+64)}${String.fromCharCode(j+64)}`).remove();
    }
    I = String.fromCharCode((i+1)+64);
    J = String.fromCharCode((j*2-1)+64);
    aNodo =  document.getElementById(`nBinario${I}${J}`);
    if(aNodo !== null) eliminarNBinario(I.charCodeAt(0) - 64, J.charCodeAt(0) - 64);
    J = String.fromCharCode((j*2)+64);
    aNodo =  document.getElementById(`nBinario${I}${J}`);
    if(aNodo !== null) eliminarNBinario(I.charCodeAt(0) - 64, J.charCodeAt(0) - 64);

    aNodo = document.getElementById(`nBinario${String.fromCharCode(i+64)}${String.fromCharCode(j+64)}`);
    aNodo.id = `addNodo${aNodo.id.slice(-2)}`;
    aNodo.innerText = '+';
}

function crearAristaBinario(a,b,I,J,i,j){
    let x1 = a.left + (a.width / 2);
    let x2 = b.left + (b.width / 2);
    let y1 = a.top + (a.height / 2);
    let y2 = b.top + (b.height / 2);
    crearAristaArbol(x1, x2, y1, y2, ' ', I+''+J, '-'+i+''+j, 'b', arbol);
}

function ActualizarAristaBinario(){
    const aristas = document.querySelectorAll('[class^="bArista"]');
    aristas.forEach(arista => {
        const I = arista.id.slice(-5,-3);
        const J = arista.id.slice(-2);
        const A1 = document.getElementById(`nBinario${I}`);
        const A2 = document.getElementById(`nBinario${J}`);
        if(A1 === null || A2 === null)
        {
            arista.remove();
        }
        else{
            const c1 = A1.getBoundingClientRect();
            const c2 = A2.getBoundingClientRect();
            const dx = c2.x - c1.x;
            const dy = c2.y - c1.y;
            
            const distancia = Math.sqrt(dx * dx + dy * dy);
            const angulo = Math.atan2(dy, dx);
            
            arista.style.width = `${distancia}px`;
    
            
            const xMedio = (c1.x + c2.x) / 2;
            const yMedio = (c1.y + c2.y) / 2;
            arista.style.left = `${xMedio - distancia / 2 + 10}px`;
            arista.style.top = `${yMedio + 10}px`;
            
            arista.style.transform = `rotate(${angulo}rad)`;
        }

    });
}

deleteAltura.addEventListener('click', () => {
    
    let h = Math.pow(2,alturaActual);
    for(let i = 0; i < h; i++){
        const contenedor = document.getElementById(`contenedor${String.fromCharCode(alturaActual + 65)}${String.fromCharCode(i + 65)}`);
        arbol.removeChild(contenedor);
    }
    
    alturaActual--;
    let a = Math.pow(2,alturaActual);
    let altura = 100/(alturaActual+1);
    let ancho = 100/a;
    arbol.style.gridTemplateColumns = `repeat(${a}, ${ancho}%)`;
    arbol.style.gridTemplateRows = `repeat(${alturaActual+1}, ${altura}%)`;
    const contenedores = document.querySelectorAll('[id^="contenedor"]');
    contenedores.forEach(element => {
        let id = element.id;
        let i = [id.slice(-2,-1).charCodeAt(0) - 64, id.slice(-1).charCodeAt(0) - 64];
        let r = Math.pow(2,i[0]-1)
        let m = (a*i[1])/(r);
        let n = (m+1)-(a/r);
        element.style.gridColumn = `${n} / ${m+1}`;
        element.style.gridRow = `${i[0]} / ${i[0]+1}`;
    });

    ActualizarAristaBinario();
});