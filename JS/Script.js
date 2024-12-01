const dGrafo = document.getElementById('DibujoGrafo');
const dArbol = document.getElementById('DibujoArbol');

const addNodo = document.getElementById('CrearNodo');
const addArista = document.getElementById('CrearArista');
const moverNodo = document.getElementById('MoverNodo');
const eliminarNodo = document.getElementById('EliminarNodo');
const cambiarPeso = document.getElementById('CambiarPeso');
const SelecRaiz = document.getElementById('SeleccionarRaiz');
const CrearArbol = document.getElementById('CrearArbol');

const rect = dGrafo.getBoundingClientRect(); 

const circulo = document.createElement('div');
circulo.classList.add('circulo');
dGrafo.appendChild(circulo);

function actualizarArbol()
{
    document.getElementById('DibujoArbol').replaceChildren();
}

let creaNodo = false;
let creaArista = false;
let mueveNodo = false;
let eliminaNodo = false;
let cambiaPeso = false;
let seleccionaRaiz = false;

let letra = [];
for(let i = 65; i <= 90; i++)
{
    letra.push({numero: i, usado: false});    
}

let aristas = [];

let mDeAdy = [];

let mArbol = [];

let nLetra;

let coords = {x: [0,0], y: [0,0]};
let dibujar = [false,false];
let pDibuj = 0;

let nNodos = 0;
let nAristas = 0;

 
let i = 0, j = 0;

let nodosSelec = [];

let isDragging = false;  
let offsetX = 0, offsetY = 0;

let nodoMov = null;

CrearArbol.addEventListener('click', (e) => {
    if(nAristas > 0)
    {
        actualizarArbol();
        mArbol = mDeAdy.map(fila => new Array(fila.length).fill(0));
        const Orden = document.getElementById('Orden');
        let letras = [];
        document.querySelectorAll('.nodo').forEach((l) => {
            letras.push(l.innerText);
        });
        const letrasIngresadas = Orden.value.split('');
        const faltantes = letras.filter(letra => !letrasIngresadas.includes(letra));
        Orden.value += faltantes.join('');
        
        let I = [], J = [];
        
        function bfsTree(matrix, startNode, preferenceOrder) {
            let queue = [];           
            let visited = new Set();   
            let parent = new Array(matrix.length).fill(null);
            let treeMatrix = [];
            
            let preferenceMap = {};
            for (let i = 0; i < preferenceOrder.length; i++) {
                preferenceMap[preferenceOrder[i]] = i;
            }

            queue.push(startNode);
            visited.add(startNode);
            
            for (let i = 0; i < matrix.length; i++) {
                treeMatrix[i] = new Array(matrix.length).fill(0);
            }

            while (queue.length > 0) {
                let currentNode = queue.shift(); 
                
                let neighbors = [];
                for (let i = 0; i < matrix.length; i++) {
                if (matrix[currentNode][i] === 1 && !visited.has(i)) {
                    neighbors.push(i);
                }
            }
            
            neighbors.sort((a, b) => preferenceMap[String.fromCharCode(65 + a)] - preferenceMap[String.fromCharCode(65 + b)]);
            
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];
                
                visited.add(neighbor);           
                parent[neighbor] = currentNode;  
                queue.push(neighbor);        
                
                
                treeMatrix[currentNode][neighbor] = 1;
              
                I.push(currentNode);
                J.push(neighbor);
            }
        }
        
        return treeMatrix;
    }

    function dfsTree(matrix, startNode, preferenceOrder) {
        
        let visited = new Set();
        let parent = new Array(matrix.length).fill(null);
        let treeMatrix = [];
        
        let preferenceMap = {};
        for (let i = 0; i < preferenceOrder.length; i++) {
            preferenceMap[preferenceOrder[i]] = i; 
        }
        
        for (let i = 0; i < matrix.length; i++) {
            treeMatrix[i] = new Array(matrix.length).fill(0);
        }
        
            function dfs(currentNode) {
                visited.add(currentNode);
                
                let neighbors = [];
                for (let i = 0; i < matrix.length; i++) {
                if (matrix[currentNode][i] === 1 && !visited.has(i)) {
                    neighbors.push(i);
                }
            }

                neighbors.sort((a, b) => {
                    return preferenceMap[String.fromCharCode(65 + a)] - preferenceMap[String.fromCharCode(65 + b)];
                });
                
                for (let i = 0; i < neighbors.length; i++) {
                    let neighbor = neighbors[i];
                    

                    if (!visited.has(neighbor)) {
                        parent[neighbor] = currentNode;
                        treeMatrix[currentNode][neighbor] = 1;
                        
                        I.push(currentNode); 
                        J.push(neighbor);     
                        
                        dfs(neighbor);
                    }
                }
            }
            
            dfs(startNode);
            
            return treeMatrix; 
        }
        
        function prim(w, n, s) {
            let v = Array(n).fill(0); 
            let E = [];  
            let adyacencia = Array.from({ length: n }, () => Array(n).fill(0));

            v[s] = 1; 

            for (let i = 0; i < n - 1; i++) {
                let min = Infinity;
                let a = -1;
                let b = -1;

                for (let j = 0; j < n; j++) {
                    if (v[j] === 1) { 
                        for (let k = 0; k < n; k++) {
                            if (v[k] === 0 && w[j][k] < min && w[j][k] !== 0) { 
                                min = w[j][k];
                                a = j;
                                b = k;
                            }
                        }
                    }
                }

                v[b] = 1;

                E.push([a, b]);

                adyacencia[a][b] = 1;

                I.push(a);
                J.push(b);

            }
        
            return adyacencia;
        }

        function matrizPesos(m)
        {
            let mPesos = m.map(fila => [...fila]);
            mPesos.forEach((fila, i, mpesos) => {
                fila.forEach((columna, j) =>{
                    if(columna === 1)
                    {
                        let a = String.fromCharCode(i+65);
                        let b = String.fromCharCode(j+65);
                        let arista = document.getElementById(`arista${a}${b}`);
                        if(arista === null) arista = document.getElementById(`arista${b}${a}`);
                        mpesos[i][j] = parseInt(arista.innerText);
                    }
                })
            });
            return mPesos;
        }
        
        function calcularPesos(mPesos) {
            let pesos = 0;
            for (let i = 0; i < mPesos.length; i++) {
                for (let j = 0; j < mPesos[i].length; j++) {
                    pesos += mPesos[i][j];
                }
            }
            
            return pesos;
        }
        
        let mPesos =  matrizPesos(mDeAdy);
        const busqueda = document.getElementById('Busqueda');
        if(busqueda.selectedIndex === 0) mArbol = bfsTree(mDeAdy, (Orden.value.charCodeAt(0) - 65), Orden.value.split(''));
        else if(busqueda.selectedIndex === 1) mArbol = dfsTree(mDeAdy, (Orden.value.charCodeAt(0) - 65), Orden.value.split(''));
        else if(busqueda.selectedIndex === 2) mArbol = prim(mPesos, Orden.value.length, (Orden.value.charCodeAt(0) - 65));
    
        
        mPesos =  matrizPesos(mArbol);
        document.getElementById('Pesos').value = calcularPesos(mPesos);

        let altNodo = [];
        altNodo.push(0);
        let nodo = [];
        nodo.push(Orden.value[0]);
        calcularAltura(Orden.value[0].charCodeAt(0) - 65, letras.length, 1, altNodo,  Array(letras.length).fill(false), nodo);
        let altura = Math.max(...altNodo);
        
        let ancNodo = [];
        calcularAncho(altura, ancNodo, altNodo);

        for (let i = 0; i <= altura; i++) {
            const nuevoDiv = document.createElement('div');
            nuevoDiv.classList.add('altura');
            nuevoDiv.id = `altura${String.fromCharCode(i+65)}`;
            nuevoDiv.style.height = `${100 / altura+1}%`;
            dArbol.appendChild(nuevoDiv);
        }

        const Div = document.querySelectorAll('.altura');
        Div.forEach((div, index)=>{
            for(let i = 0; i < ancNodo[index]; i++)
            {
                const nuevoDiv = document.createElement('div');
                nuevoDiv.classList.add(`ancho${String.fromCharCode(index+65)}`);
                nuevoDiv.id = `ancho${String.fromCharCode(index+65)}${String.fromCharCode(i+65)}`;
                nuevoDiv.style.width = `${100 / ancNodo[index]}%`;
                div.appendChild(nuevoDiv);
            }
        });

        crearNodoArbol(altura, ancNodo, altNodo, nodo);

        for(let i = 0; i < nodo.length-1; i++)
        {
            let a = String.fromCharCode(I[i] + 65);
            let b = String.fromCharCode(J[i] + 65);
            let arista = document.getElementById(`arista${a}${b}`);
            if(arista === null) arista =  document.getElementById(`arista${b}${a}`);
            let nod1 = document.getElementById(`aNodo${a}`).getBoundingClientRect();
            let nod2 = document.getElementById(`aNodo${b}`).getBoundingClientRect();
            let x1 = nod1.left + (nod1.width / 2);
            let x2 = nod2.left + (nod2.width / 2);
            let y1 = nod1.top + (nod1.height / 2);
            let y2 = nod2.top + (nod2.height / 2);
            crearAristaArbol(x1, x2, y1, y2, arista.innerText, a, b, 'a', dArbol);
        }

    }
});

function crearNodoArbol(altura, ancNodo, altNodo, nodo)
{
    let aNodos = [];
    let m = Math.max(...ancNodo);
    let k = new Array(ancNodo.length).fill(0)
    for (let i = 0; i <= altura; i++) {
        let fila = new Array(ancNodo[i]).fill(null);
        aNodos.push(fila);
    }
    nodo.forEach((c, index) => {
        aNodos[altNodo[index]][k[altNodo[index]]] = c;
        k[altNodo[index]]++;
    });

    const Div = document.querySelectorAll('[class^="ancho"]');
    Div.forEach((div) => {
        let i = div.id.slice(-2, -1);
        let j = div.id.slice(-1);
        const nuevoNodo = document.createElement('button');


        nuevoNodo.id =`aNodo${aNodos[i.charCodeAt(0)-65][j.charCodeAt(0)-65]}`;
        nuevoNodo.classList.add('nodoArbol');
        nuevoNodo.innerText = aNodos[i.charCodeAt(0)-65][j.charCodeAt(0)-65];
        
        div.appendChild(nuevoNodo);
    });
}

function crearAristaArbol(x1, x2, y1, y2, peso, a, b, prefijo, contenedor) {

    const dx = x2 - x1;
    const dy = y2 - y1;
    const distancia = Math.sqrt(dx * dx + dy * dy);
    const angulo = Math.atan2(dy, dx);

    const arista = document.createElement('button');
    arista.classList.add(`${prefijo}Arista`);
    arista.id = (`${prefijo}Arista${a}${b}`);

    arista.style.width = `${distancia}px`;
    
    const xMedio = (x1 + x2) / 2;
    const yMedio = (y1 + y2) / 2;
    arista.style.left = `${xMedio - distancia / 2}px`;
    arista.style.top = `${yMedio - 2.5}px`;

    arista.style.transform = `rotate(${angulo}rad)`;

    arista.innerText = peso;

    contenedor.appendChild(arista);
}

function calcularAncho(m, ancNodo, altNodo)
{
    for(let i = 0; i <= m; i++)
    {
        ancNodo.push(altNodo.filter(element => element === i).length);
    }
}

function calcularAltura(n, m, j, altNodo, visitado, nodo)
{
    if(visitado.every(v => v === true)) return;
    visitado[n] = true;
    for(let i = 0; i < m; i++)
    {
        if(mArbol[n][i] === 1 && !visitado[i])
        {
            altNodo.push(j);
            nodo.push(String.fromCharCode(i+65));
            calcularAltura(i, m, j+1, altNodo, visitado, nodo);
        }
    }
}

function verificarColumna(index)
{
    for(let i = 0; i < mArbol.length; i++)
    {
        if(mArbol[i][index] === 1)
        {
            return false;
        }
    }
    return true;
}

dGrafo.addEventListener('click', function(event) {
    if(creaNodo){
        const nuevoBoton = document.createElement('button');

        const x = event.offsetX + rect.left; 
        const y = event.offsetY + rect.top;
        for(let element of letra)
        {
            if(element.usado ===  false) 
            {
                nLetra = element.numero;
                element.usado = true;
                break;
            }
        }

        nuevoBoton.id =`nodo${String.fromCharCode(nLetra)}`;
        nuevoBoton.classList.add('nodo');
        nuevoBoton.innerText = String.fromCharCode(nLetra);
        
        nuevoBoton.style.left = `${x}px`; 
        nuevoBoton.style.top = `${y}px`;
    
        dGrafo.appendChild(nuevoBoton);
        nNodos++;

        expandMatriz();

        nuevoBoton.addEventListener('click', function() {
            if(eliminaNodo) {
                for(let element of letra)
                {
                    if(this.innerText === String.fromCharCode(element.numero)) {
                        element.usado = false;
                        break;
                    }
                }
                for(let item of aristas)
                {
                    if(this.id.slice(-1).charCodeAt(0) === item.ID.slice(-2,-1).charCodeAt(0) || this.id.slice(-1).charCodeAt(0) === item.ID.slice(-1).charCodeAt(0))
                    {
                        const nd = document.getElementById(item.ID);
                        nd.remove();
                    }
                }
                aristas = aristas.filter(item => item.ID.slice(-2,-1).charCodeAt(0) !== this.id.slice(-1).charCodeAt(0) && item.ID.slice(-1).charCodeAt(0) !== this.id.slice(-1).charCodeAt(0));
                this.remove();
                nodosSelec = [];
                pDibuj = 0;
                let i = parseInt(this.id.slice(-1).charCodeAt(0)) - 65;
                for(let j = 0; j < mDeAdy.length; j++)
                {
                    borrarMatriz(i,j);
                }
                nNodos--;
            }
            else if(creaArista) {
                dibujar[pDibuj] = true;
                
                const c = this.getBoundingClientRect();
                coords.x[pDibuj] = c.x + c.width / 2;
                coords.y[pDibuj] = c.y + c.height / 2;

                nodosSelec.push(this.id);
                const nodo = document.getElementById(nodosSelec[0]);
                nodo.classList.add('ActNodo');
                pDibuj++;
                if (dibujar[1]) {
                    let i = parseInt(nodosSelec[0].slice(-1).charCodeAt(0)) - 65;
                    let j = parseInt(nodosSelec[1].slice(-1).charCodeAt(0)) - 65;
                    if(mDeAdy[i][j] === 0 && mDeAdy[j][i] === 0)
                    {
                        if((coords.x[0] === coords.x[1]) && (coords.y[0] == coords.y[1])) crearBotonLazo();
                        else crearBotonLinea();
                        nAristas++;
                        llenarMatriz(i,j);
                    }
                    else pDibuj = 2;
                    const nod = document.getElementById(nodosSelec[0]);
                    nod.classList.remove('ActNodo');
                }
                if (pDibuj >= 2){
                    pDibuj = 0;
                    dibujar[1] = false;
                    dibujar[0] = false;
                    nodosSelec = [];
                }
            }
            else if(mueveNodo)
            {
                if(!this.classList.contains('mueveNodo')) {
                    this.classList.add('mueveNodo');
                    this.classList.add('actNodo');
                    nodoMov = this.id;
                    dGrafo.style.cursor = 'none';
                }
            }
            else if(seleccionaRaiz)
            {
                if(this.classList.contains('raiz'))
                {
                    this.classList.remove('raiz');
                }
                else
                {
                    const raiz = document.querySelector('.raiz');
                    if(raiz !== null)
                    {
                        raiz.classList.remove('raiz');
                        this.classList.add('raiz');
                        document.getElementById('Orden').value = this.innerText;
                    }
                    else {
                        this.classList.add('raiz');
                        document.getElementById('Orden').value = this.innerText;
                    }                
                }
            }
        });
    }
});

dGrafo.addEventListener('dblclick', function(e)
{
    if(mueveNodo && nodoMov !== null)
    {
        const mNodo = document.getElementById(nodoMov);
        if(mNodo.classList.contains('mueveNodo')) {
            mNodo.classList.remove('mueveNodo');
            mNodo.classList.remove('actNodo');
            nodoMov = null;
            dGrafo.style.cursor = 'auto';
        }
    }
});

function actualizarArista(ID1, ID2)
{
    const arista = aristas.find(a => a.ID === `arista${ID1.slice(-1)}${ID2.slice(-1)}`);
    const ars = document.getElementById(arista.ID);
    if(ID1 !== ID2)
    {
        const nodo1 = document.getElementById(ID1)
        const nodo2 = document.getElementById(ID2)
        const c1 = nodo1.getBoundingClientRect();
        const c2 = nodo2.getBoundingClientRect();

        const dx = c2.x - c1.x;
        const dy = c2.y - c1.y;
        
        const distancia = Math.sqrt(dx * dx + dy * dy);
        const angulo = Math.atan2(dy, dx);
        
        ars.style.width = `${distancia}px`;

        const xMedio = (c1.x + c2.x) / 2;
        const yMedio = (c1.y + c2.y) / 2;
        ars.style.left = `${xMedio - distancia / 2 + 10}px`;
        ars.style.top = `${yMedio + 10}px`;
        
        ars.style.transform = `rotate(${angulo}rad)`;
        
        arista.x = [c1.x, c2.x];
        arista.y = [c1.y, c2.y];
    }
    else{
        const nodo = document.getElementById(ID1)
        const c = nodo.getBoundingClientRect();
        
        const xCentro = c.x + c.width / 2;
        const yCentro = c.y + c.height / 2;
    
        ars.style.left = `${xCentro}px`;
        ars.style.top = `${yCentro}px`;
    }

}

function crearBotonLinea() {

    const dx = coords.x[1] - coords.x[0];
    const dy = coords.y[1] - coords.y[0];
    const distancia = Math.sqrt(dx * dx + dy * dy);
    const angulo = Math.atan2(dy, dx);

    const linea = document.createElement('button');
    linea.classList.add('arista');
    linea.id = (`arista${nodosSelec[0].slice(-1)}${nodosSelec[1].slice(-1)}`);

    linea.style.width = `${distancia}px`;
    
    const xMedio = (coords.x[0] + coords.x[1]) / 2;
    const yMedio = (coords.y[0] + coords.y[1]) / 2;
    linea.style.left = `${xMedio - distancia / 2}px`;
    linea.style.top = `${yMedio - 2.5}px`;

    linea.style.transform = `rotate(${angulo}rad)`;

    linea.innerText = "1";

    linea.addEventListener('click', function() {
        if(eliminaNodo) {
            aristas = aristas.filter(item => item.ID !== this.id);
            let i = parseInt(this.id.slice(-2,-1).charCodeAt(0)) - 65;
            let j = parseInt(this.id.slice(-1).charCodeAt(0)) - 65;
            borrarMatriz(i,j);
            this.remove();
            nAristas--;
        }
        else if(cambiaPeso)
        {
            const nuevoPeso = prompt("Ingresa el nuevo peso:");

            if (/^[1-9]\d*$/.test(nuevoPeso)) {
                this.innerText = nuevoPeso;
            } else {
                this.innerText = '1';
            }
        }
    });


    dGrafo.appendChild(linea);

    aristas.push({
        ID: linea.id, 
        x: [coords.x[0], coords.x[1]], 
        y: [coords.y[0], coords.y[1]],
        nodosID: [nodosSelec[0], nodosSelec[1]],
        peso: linea.innerText
    });
}

function crearBotonLazo() {

     const nodo = document.getElementById(nodosSelec[0]);
     const c = nodo.getBoundingClientRect();

     const xCentro = c.x + c.width / 2;
     const yCentro = c.y + c.height / 2;
 
     const lazo = document.createElement('div');
     lazo.classList.add('lazo');
     lazo.id = (`arista${nodosSelec[0].slice(-1)}${nodosSelec[1].slice(-1)}`);
 
     lazo.style.left = `${xCentro}px`;
     lazo.style.top = `${yCentro}px`;

     lazo.innerText = "1";
    
     lazo.addEventListener('click', function() {
        if(eliminaNodo) {
            aristas = aristas.filter(item => item.ID !== this.id);
            let i = parseInt(this.id.slice(-2,-1).charCodeAt(0)) - 65;
            let j = parseInt(this.id.slice(-1).charCodeAt(0)) - 65;
            borrarMatriz(i,j);
            this.remove();
        }
        else if(cambiaPeso)
        {
            const nuevoPeso = prompt("Ingresa el nuevo peso:");

            if (/^[1-9]\d*$/.test(nuevoPeso)) {
                this.innerText = nuevoPeso;
            } else {
                this.innerText = '1';
            }
        }
    });

    dGrafo.appendChild(lazo);
    aristas.push({
        ID: lazo.id, 
        x: [coords.x[0], coords.x[1]], 
        y: [coords.y[0], coords.y[1]],
        nodosID: [nodosSelec[0], nodosSelec[1]],
        peso: lazo.innerText 
    });
}

addNodo.addEventListener('click', function() {
    creaNodo = activar();
});

addArista.addEventListener('click', function() {
    creaArista = activar();
});

moverNodo.addEventListener('click', function() {
    mueveNodo = activar();
});

eliminarNodo.addEventListener('click', function() {
    eliminaNodo = activar();
});

cambiarPeso.addEventListener('click', function() {
    cambiaPeso = activar();
});

SelecRaiz.addEventListener('click', function() {
    seleccionaRaiz = activar();
});

function activar(){
    creaNodo = false;
    creaArista = false;
    mueveNodo = false;
    eliminaNodo = false;
    cambiaPeso = false;
    seleccionaRaiz = false;

    return true;
}

function expandMatriz() {
    let size = mDeAdy.length;
    
    let newRow = new Array(size + 1).fill(0);
    mDeAdy.push(newRow);
    
    for (let i = 0; i < size; i++) {
        mDeAdy[i].push(0);
    }
    
}

function llenarMatriz(i,j)
{
    mDeAdy[i][j]++;
    mDeAdy[j][i]++;
}

function borrarMatriz(i,j)
{
    mDeAdy[i][j]--;
    mDeAdy[j][i]--;
    if(mDeAdy[i][j] < 0) mDeAdy[i][j] = 0;
    if(mDeAdy[j][i] < 0) mDeAdy[j][i] = 0;
}