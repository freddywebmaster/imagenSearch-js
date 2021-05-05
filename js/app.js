const resultado = document.querySelector("#resultado");
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");
const registrosPorPagina = 40;
var paginaActual = 1;
let totalPaginas;
let iterador;

window.onload = () => {
  formulario.addEventListener("submit", validarFormulario);
};

const validarFormulario = (e) => {
  e.preventDefault();
  const terminoBusqueda = document.querySelector("#termino").value;
  if (terminoBusqueda === "") {
    mostrarAlerta("Agrega un termino a la busqueda");
    return;
  }
  buscarImagenes();
};

const mostrarAlerta = (mensaje) => {
  const ExisteAlerta = document.querySelector(".alerta");

  if (!ExisteAlerta) {
    var alerta = document.createElement("p");
    alerta.classList.add(
      "alerta",
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center"
    );

    alerta.innerHTML = `
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline">${mensaje}</span>
      `;
    formulario.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
};

const buscarImagenes = () => {
  showLoader();
  const termino = document.querySelector("#termino").value;
  let page = paginaActual;
  const key = "21386703-d99c2529e56f0ace1c6b0edfa";
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${page}`;

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      totalPaginas = calcularPaginas(datos.totalHits);
      mostrarImagenes(datos.hits);
      console.log(datos);
    });
};

//GENERADOR

function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

const calcularPaginas = (total) => {
  return parseInt(Math.ceil(total / registrosPorPagina));
};

const mostrarImagenes = (imagenes) => {

  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }

  imagenes.forEach((imagen) => {
    const { previewURL, views, likes, largeImageURL, downloads } = imagen;
    resultado.innerHTML += `
    <div class="cajita w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
      <div class="bg-oscuro">
        <img class="w-full" src="${previewURL}">

        <div class="info-img p-4">
          <p>${likes} <i class="far fa-heart"></i></p>
          <p>${views} <i class="far fa-eye"></i></p>
          <p>${downloads} <i class="far fa-arrow-alt-circle-down"></i></p>
        </div>
        <a class="block w-100 bg-yellow-400 hover:bg-yellow-500 text-black uppercase font-bold text-center mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Descargar</a>

      </div>
    </div>    
    `;
  });
  impPaginador();
};

const impPaginador = () => {
  iterador = crearPaginador(totalPaginas);
  paginacionDiv.innerHTML = "";

  while (true) {
    const { value, done } = iterador.next();
    if (done) return;
    //caso contrario
    const boton = document.createElement("a");
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add(
      "siguiente",
      "hover:bg-yellow-500",
      "bg-yellow-400",
      "px-4",
      "py-1",
      "mr-2",
      "font-bold",
      "mb-4",
      "rounded"
    );
    boton.onclick = () => {
      paginaActual = value;
      resultado.innerHTML = "";
      buscarImagenes();
    };
    paginacionDiv.appendChild(boton);
  }
};

const showLoader = () => {
  resultado.innerHTML = `
  <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
  `;
};
