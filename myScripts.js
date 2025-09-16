//Declaracion de Variables
let myColeccion= document.getElementById("coleccion");
let myFaltantes= document.getElementById("faltantes");
let todas=document.getElementById("allPaints");
let boton = document.getElementById('buscar');
let lista= document.getElementById("listaPinturas");
let selector = document.getElementById('miSelector');
let input = document.getElementById("buscador");

let archivo="allPaints.json";

//Metodos

const mostrarTodas = () => {
    lista.innerHTML = "";
    fetch(archivo)
        .then(respuesta => respuesta.json())
        .then(salida => {
            lista.innerHTML = '';
            for (let item of salida.data) {
                mostrarElementos(item);
            }
        })
        .catch(error => console.log(error));
};

//Cambio de color de boton
function reaccionarColor() {
    this.style.backgroundColor="#7a7a7a";
    this.style.color="#e7e7e7ff";
}

//Mostrar en coleccion
const mostrarColeccion = () => {
    lista.innerHTML = "";
    let tipoSeleccionado = selector.value;
    
    fetch(archivo)
    .then(respuesta => respuesta.json())
    .then(salida=> {
        lista.innerHTML = ''; 
        for(let item of salida.data){
            if(item.obtenido && (tipoSeleccionado === "Todas" || item.type === tipoSeleccionado)){
                mostrarElementos(item);
            }
        }
    })
    .catch(error => console.log(error));
    };

//Mostar pinturas faltantes
const mostrarFaltantes = () => {
    lista.innerHTML = "";
    const tipoSeleccionado = selector.value;
    
    fetch(archivo)
    .then(respuesta => respuesta.json())
    .then(salida=> {
        lista.innerHTML = ''; 
        for(let item of salida.data){
            if(!item.obtenido && (tipoSeleccionado === "Todas" || item.type === tipoSeleccionado)){
                mostrarElementos(item);
            }                
        }
    })
    .catch(error => console.log(error));
}

//Resetear Estilos de los botones
function regresarEstilos(){
    todas.style.background=null;
    todas.style.color=null;
    myFaltantes.style.background=null;
    myFaltantes.style.color=null;
    myColeccion.style.background=null;
    myColeccion.style.color=null;
}

//Mostrar elemento de Lista
function mostrarElementos(item){
    const li = document.createElement('li');
                li.innerHTML = item.nombre; 
                lista.appendChild(li);

                const tipo=document.createElement("h4");
                tipo.innerText=item.type;
                li.appendChild(tipo);

                const imagenBuscar = document.createElement('img');
                imagenBuscar.classList.add("imagenLista")
                imagenBuscar.src = item.imagen; 
                imagenBuscar.width = 100;
                li.appendChild(imagenBuscar);
                
                const botonAgregar=document.createElement("button");
                botonAgregar.innerText="+";
                botonAgregar.classList.add("botonLista")
                botonAgregar.addEventListener("click", function () {
                    modObtenido(item, botonAgregar, paintCole);
                });
                li.appendChild(botonAgregar);
                if(item.obtenido){
                botonAgregar.style.backgroundColor="#dfc11cff";
                }
                
                const paintCole=document.createElement("p");
                paintCole.classList.add("enColeccion");
                if(item.obtenido){
                    paintCole.innerText= "Pintura Obtenida";
                    li.appendChild(paintCole);
                }else{
                    paintCole.innerText= "Pintura Faltante";
                    li.appendChild(paintCole);
                }
}

//Cambio de archivo
const cambiarArchivo = () => {
    const tipoSeleccionado = selector.value; // "Todas", "Layer" o "Base"
    selector.dispatchEvent(new CustomEvent('cambioModo'));

    fetch(archivo)
        .then(respuesta => respuesta.json())
        .then(salida=> {
            lista.innerHTML = ''; 

            for (let item of salida.data) {
                if (tipoSeleccionado === "Todas" || item.type === tipoSeleccionado) {
                    mostrarElementos(item);
                }
            }
        })
        .catch(error => console.log(error));
}

//Buscar por Nombre
const buscar=()=> {
    lista.innerHTML = "";

    fetch(archivo)
    .then(respuesta => respuesta.json())
    .then(salida=> {
        for(let item of salida.data){
            if(item.nombre.startsWith(input.value)) {
                mostrarElementos(item);
            }
        }
    })
    .catch(error => console.log(error));
}

//Modificar Variable Obtenido y actualizar Boton
const modObtenido=(item, boton, etiqueta)=> {
    fetch('/modificar', {
        method: 'PATCH',//Estudiar para Cambiar por un "PATCH"
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nombre: item.nombre })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            item.obtenido = data.nuevoValor;
            // Actualiza interfaz
            if (item.obtenido) {
                boton.style.backgroundColor = "#dfc11cff";
                etiqueta.innerText = "Pintura Obtenida";
            } else {
                boton.style.backgroundColor = "";
                etiqueta.innerText = "Pintura Faltante";
            }
        }
    })
    .catch(error => console.error('Error al modificar:', error));
}

// Delegación de eventos usando mapa de acciones

const accionesBotones = {
    allPaints: [mostrarTodas, regresarEstilos, (el) => reaccionarColor.call(el)],
    coleccion: [mostrarColeccion, regresarEstilos, (el) => reaccionarColor.call(el)],
    faltantes: [mostrarFaltantes, regresarEstilos, (el) => reaccionarColor.call(el)]
};

document.getElementById("contenedor").addEventListener("click", (event) => {
    const acciones = accionesBotones[event.target.id];
    if (acciones) acciones.forEach(fn => fn(event.target));
});

//Escuchadores

boton.addEventListener('click', buscar);
selector.addEventListener('change', cambiarArchivo);
