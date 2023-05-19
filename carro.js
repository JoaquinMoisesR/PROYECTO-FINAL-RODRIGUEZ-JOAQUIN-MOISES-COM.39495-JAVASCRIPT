let carrito = [] //SITIO PARA PIEZAS DEL CARRO
let stock = [] //SITIO DE LOS PRODUCTOS
let productos = [] //ASINCRONIA DE PRODUCTOS.JSON

//SE TRAEN ELEMENTOS DEL DOM
const tabla = document.getElementById('items');
const selectProductos = document.getElementById('productos')
const btnAgregar = document.getElementById('agregar');
const btnOrdenar = document.getElementById('ordenar');
const btnVaciar = document.getElementById('vaciar');
const total = document.getElementById('total');


//CARGA DEL LOCALSTORAGE CON STOCK DE PIEZAS
stock.push(new Producto('Carburador Holley 40/40', 48000));
stock.push(new Producto('Leva Galetto 11.35', 35000));
stock.push(new Producto('Kit bujias iridium-platinum Ferrazzi', 28000));
stock.push(new Producto('Bobina RPC Competicion', 22000));
stock.push(new Producto('Kit Valvulas Edelbrook', 52000));
stock.push(new Producto('Kit Pistones Forjados RPC', 68000));
stock.push(new Producto('Aros L Italy', 15000));
stock.push(new Producto('Turbina T3 RPC', 145000));
stock.push(new Producto('Intercooler y mangueras Water', 125000));
stock.push(new Producto('Kit admision aire/combustible Masterpower', 89000));
stock.push(new Producto('Multiple Escape 4 a 1 RPC', 110000));
stock.push(new Producto('Inyectores Metanol RPC', 166000));

localStorage.setItem('stock',stock);




allEventListeners();

//EVENTLISTENER DEL EVENTO CUANDO EL DOM SE CARGA
function allEventListeners()
{
  window.addEventListener('DOMContentLoaded', traerItems);

  btnVaciar.addEventListener('click', vaciarCarrito);

///EVENTLISTENER DE AGREGAR UNA PIEZA AL CARRO Y PREVENTDEFAULT PARA EVITAR EL REFRESQUE DEL SITIO
  btnAgregar.addEventListener('submit', (e) =>
  {
    e.preventDefault(); 
    const productoSelected = stock[selectProductos.value];
    if (carrito.find((item) => {return item.producto.nombre === productoSelected.nombre}) === undefined)
    {
      const nuevoItem = new Item(productoSelected,1);
      carrito.push(nuevoItem);
      localStorage.setItem('carrito',JSON.stringify(carrito)); 
      newRow(nuevoItem);
    }

  });
}

//REVISION DEL CARRO POR SI TENIA PIEZAS AGREGADAS AL CARGARSE.
document.addEventListener('DOMContentLoaded', () =>{
  traerProductos(),
  carritoCompras = JSON.parse(localStorage.getItem('carrito')) || [];
})

//ASINCRONIA DE "productos.json" PARA SABER QUE ESTAN LOS PRODUCTOS Y A MODO DE BACK-END, SE PUEDEN VER EN CONSOLA YA QUE NO HAY CARDS...
//SE MOSTRARA EL ERROR CON TOASTIFY POR SI ALUGUN PRODUCTO NO SE CARGASE.
async function traerProductos() {
  productos = await fetch('./productos.json').then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Hubo un problema en el servidor, intente nuevamente');
    }
  }).catch((error) => {
    Toastify({
      text: error,
      className: "Error",
      style: {
        background: "linear-gradient(to rigth, #00b09b, #96c93d)",
      }
    }).showToast();
  });
  console.log(productos);
}

//DROPDOWN-SELECCION DE PIEZAS
function popularDropdown()
{
  stock.forEach((producto) => {
    const option = document.createElement('option');
    option.innerText = `${producto.nombre} : ${producto.precio}`;
    option.value = stock.indexOf(producto); 
    selectProductos.appendChild(option);
  });
}

//OBTENCION DE PRODUCTOS DEL LOCALSTORAGE Y DE NO HABER NADA, INICIALIZACION EN VACIO
function traerItems()
{
  stock = JSON.parse(localStorage.getItem('stock')) || []
  popularDropdown();
  carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  actualizarTablaCarrito();  

}


//ARRAY GUARDADO EN EL LOCALSTORAGE
localStorage.setItem('stock',JSON.stringify(stock)); 


function actualizarTablaCarrito()
{
  tabla.innerHTML = '';
  total.innerText = 0;
  carrito.forEach((item) => {
    newRow(item);
  });
}


//CREACION DE FILAS DE PIEZAS SELECCIONADAS
function newRow(item)
{
  const row = document.createElement('tr'); 
  let td = document.createElement('td');
  const posCarrito = carrito.indexOf(item);
  td.classList.add('font-white');
  td.textContent = item.producto.nombre;
  row.appendChild(td);
  
  td.classList.add('font-white');
  td = document.createElement('td');
  td.textContent = item.cantidad;
  row.appendChild(td);

  td.classList.add('font-white');
  td = document.createElement('td');
  td.textContent = item.producto.precio;

  row.appendChild(td);

  const btnEliminar = document.createElement('button');
  btnEliminar.className = 'btn btn-danger';
  btnEliminar.innerText = 'Eliminar';

  btnEliminar.onclick = () => 
  {
      carrito.splice(posCarrito,1); 
      actualizarTablaCarrito();
      localStorage.setItem('carrito',JSON.stringify(carrito));
  }

  td = document.createElement('td')
  td.appendChild(btnEliminar);
  row.appendChild(td);
  tabla.appendChild(row); 
  
//CALCULO DEL TOTAL ACTUALIZADO
  total.innerText = carrito.reduce((acumulador,item) => acumulador + item.producto.precio * item.cantidad,0);
}

//FUNCION DE VACIADO DEL CARRO
function vaciarCarrito()
{
      Swal.fire({
        title: 'Esta seguro de que desea vaciar el carrito?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => { 
        console.log(result);
        if (result.isConfirmed === true) { 
          carrito = [];
          localStorage.setItem('carrito',JSON.stringify(carrito));
          actualizarTablaCarrito();
          Swal.fire( {
            title:'Carrito vaciado!',
            icon: 'success'
          });
        }
    });
}

//ORDEN PARA EL PEDIDO DE PIEZAS UNA VEZ SELECCIONADAS
const botonOrdenar = document.getElementById('ordenar')

btnOrdenar.onclick = () => {
  Swal.fire({
    title: 'YA TENEMOS TU PEDIDO! EN MINUTOS ESTARA LISTO PARA ENVIAR, "CAT" LO ALCANZA :)!',
    width: 600,
    padding: '3em',
    color: '#716add',
    background: '#fff url(./images/trees.png)',
    backdrop:`
      rgba(0,0,123,0.4)
      url("./images/nyan-cat.gif")
      left top
      no-repeat
      `
  });
}

//BOTON DE GOOGLEAR CON EL OBJETIVO DE BUSCAR EL NOMBRE DE LA PIEZA QUE EL USUARIO NO SABE O NO RECUERDA
const botonToast = document.getElementById('boton-toast');

botonToast.onclick = () => {
  Toastify({
    text: "HACE CLICK Y VAMOS A GOOGLEAR LO QUE NECESITES!",
    duration: 3000,
    destination: "https://www.google.com.ar/webhp", 
    newWindow: true,
    close: true,
    gravity: "top", 
    position: "right", 
    stopOnFocus: true, 
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function(){} 
  }).showToast();
}