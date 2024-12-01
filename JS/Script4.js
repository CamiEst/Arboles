const bToTxt = document.getElementById('ConvertirDe');
const bToTree = document.getElementById('ConvertirA');
const Order = document.getElementById('Order');
const Mode = document.getElementById('Modo');
const ShowToTxt = document.getElementById('MostrarConvertir');
const ShowToTree = document.getElementById('TextoConvertir');

bToTxt.addEventListener('click', () => {
    if(Order.selectedIndex === 0)
    {
        ShowToTxt.value = preOrderTree(1,1);
    }
    else if(Order.selectedIndex === 1)
    {
        ShowToTxt.value = betweenOrderTree(1,1);
    }
    else if(Order.selectedIndex === 2)
    {
        ShowToTxt.value = postOrderTree(1,1);
    }
});

bToTree.addEventListener('click', () => {
    if(Mode.selectedIndex === 0)
    {
        if(operatorVerify(String(ShowToTree.value)))
        {
            arbol.replaceChildren();
            alturaActual = -1;
            OrderEquation(1, 1, String(ShowToTree.value));
        }
    }
    if(Mode.selectedIndex === 1)
    {
        arbol.replaceChildren();
        alturaActual = -1;
        lessGreater(splitString(String(ShowToTree.value).trim()));
    }
});

function operatorVerify(str)
{
    const rex = /^[\(\)\w\+\-\*/\.0-9\s]+$/;
    return rex.test(str);
}

function splitString(str) {
    if (str.includes(' ')) {
        return str.split(' ');
    } else {
        return str.split('');
    }
}

function verify(i,j,str){
    let I = String.fromCharCode(i+64);
    let J = String.fromCharCode(j+64);
    let aNodo = document.getElementById(`nBinario${I}${J}`);
    if(aNodo === null)
    {
        aNodo = document.getElementById(`addNodo${I}${J}`);
        if(aNodo === null){
            addAltura.click();
            aNodo = document.getElementById(`addNodo${I}${J}`);
        } 
        aNodo.click();
        aNodo = document.getElementById(`nBinario${I}${J}`);
    }

    if(aNodo.innerText.trim() === '')
    {
        aNodo.innerText = str;
        aNodo.classList.add('txt');
        return;
    }
    else
    {
        let esMayor = false;
        for(let k = 0; k < aNodo.innerText.trim().length; k++)
        {
            let a = aNodo.innerText.trim().charCodeAt(k);
            let b = str.charCodeAt(k);
            if(b > a) 
            {
                esMayor = true;
                break;
            }
            else if(a > b)
            {
                esMayor = false;
                break;
            }
            if(k === str.length-1 && a === b && k < aNodo.innerText.trim().length-1) 
            {
                esMayor = false;
                break;
            }
            if(k === aNodo.innerText.trim().length-1 && a === b && k < str.length-1) 
            {
                esMayor = true;
                break;
            }
        }
        if(esMayor) verify(i+1, j*2, str);
        else verify(i+1, (j*2)-1, str);
    }
}

function lessGreater(str){
    for(let l = 0;  l < str.length; l++)
    {
        verify(1,1,str[l]);
    }
}

const operatorsPrecedence = { '*': 2, '/': 2, '+': 1, '-': 1 };

function deleteBrackets(str) {
    if (typeof str === 'string' && str.trim() !== '') {
        return str.replace(/^\((.*)\)$/, '$1');
    }
    else return str;
}

let division = new Array(3);
function OrderEquation(i, j, str)
{
    str = deleteBrackets(str);
    let I = String.fromCharCode(i+64);
    let J = String.fromCharCode(j+64);
    let aNodo = document.getElementById(`addNodo${I}${J}`);
    if(aNodo === null){
        addAltura.click();
        aNodo = document.getElementById(`addNodo${I}${J}`);
    }
    if(str.length === 1 || checkString(str)) {
        aNodo.click();
        aNodo.innerText = str;
        return;
    }
    dividirStr(str);
    aNodo.click();
    aNodo.innerText = division[1];
    let d1 = division[0];
    let d3 = division[2];
    OrderEquation(i+1, (j*2)-1, d1);
    OrderEquation(i+1, (j*2), d3);
    
}

function checkString(str) {
    const rex = /^[A-Za-z0-9]+$/;
    return rex.test(str);
}

function dividirStr(str)
{
    let Brackets = 0;
    for(let precedence = 1; precedence <= 2; precedence++)
    {
        for(let i = 0; i < str.length; i++)
        {
            if(str[i] === '(')
            {
                Brackets++;
            }
            else if(str[i] === ')')
            {
                Brackets--;
            }
            if(Brackets === 0)
            {
                if(str[i] === '+' || str[i] === '-' || str[i] === '*' || str[i] === '/'){
                    if(operatorsPrecedence[str[i]] === precedence)
                    {
                        division[0] = (str.substring(0, i));
                        division[1] = (str.charAt(i)); 
                        division[2] = (str.substring(i + 1));
                        precedence = 3;
                        break;
                    }
                }
            }
        } 
    }
}

function preOrderTree(i, j){
    let I = String.fromCharCode(i+64);
    let J = String.fromCharCode(j+64);
    const bNode = document.getElementById(`nBinario${I}${J}`);
    if(bNode === null) return '';
    else
    { 
        return bNode.innerText + preOrderTree(i+1, (j*2)-1) + preOrderTree(i+1, j*2);
    }
}

function betweenOrderTree(i, j){
    let I = String.fromCharCode(i+64);
    let J = String.fromCharCode(j+64);
    const bNode = document.getElementById(`nBinario${I}${J}`);
    if(bNode === null) return '';
    else
    { 
        return  betweenOrderTree(i+1, (j*2)-1) + bNode.innerText + betweenOrderTree(i+1, j*2);
    }
}

function postOrderTree(i, j){
    let I = String.fromCharCode(i+64);
    let J = String.fromCharCode(j+64);
    const bNode = document.getElementById(`nBinario${I}${J}`);
    if(bNode === null) return '';
    else
    { 
        return postOrderTree(i+1, (j*2)-1) + postOrderTree(i+1, j*2) + bNode.innerText;
    }
}