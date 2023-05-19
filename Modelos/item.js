//CLASE ITEMS, DE PIEZAS DE COMPETICION PARA EL CARRO
//CON ATRIBUTOS DE TIPO DE PRODUCTO Y CANTIDAD
//SE INCLUYE CONSTRUCTOR

class Item {
    producto;
    cantidad; 

    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }
    
    precioTotal() {
        return this.cantidad * this.producto.precio;
    }
}