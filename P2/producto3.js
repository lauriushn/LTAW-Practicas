document.addEventListener("DOMContentLoaded", function() {
    // Seleccionar todas las imágenes con la clase 'adidas'
    const imagenes = document.querySelectorAll('.puma');

    // Iterar sobre cada imagen y añadir un evento de clic
    imagenes.forEach((imagen) => {
        imagen.addEventListener('click', () => {
            // Verificar si la imagen ya está seleccionada
            const estaSeleccionada = imagen.classList.contains('img-seleccionada');
            
            // Remover la clase 'img-seleccionada' y restaurar el tamaño de la imagen
            imagenes.forEach((img) => {
                img.classList.remove('img-seleccionada');
                img.style.transform = 'scale(1)'; // Restablecer el tamaño de la imagen
            });
            
            // Si la imagen no estaba seleccionada, se selecciona y se aumenta su tamaño
            if (!estaSeleccionada) {
                imagen.classList.add('img-seleccionada');
                imagen.style.transform = 'scale(1.2)';
            }
        });
    });

    // Función para coger información del JSON
    fetch("tienda.json")
        .then(response => response.json())
        .then(data => {
            // Busca el producto en el archivo JSON por su nombre
            const producto = data.productos.find(producto => producto.nombre === "Puma-180");
            
            // Actualiza el nombre del producto
            document.getElementById("name_producto").textContent = producto.nombre;

            // Actualiza la descripción del producto
            document.getElementById("descripcion_producto").textContent = producto.descripcion;

            // Actualiza el precio del producto
            document.getElementById("precio_producto").textContent = producto.precio;

            // Obtener el botón "Agregar al carrito"
            const botonAgregarCarrito = document.getElementById("agregarcarrito");

            // Agregar un evento de clic al botón "Agregar al carrito"
            botonAgregarCarrito.addEventListener("click", function() {
                addToCart(producto.nombre); // Llama a la función addToCart() al hacer clic en el botón, pasando el nombre del producto como argumento
            });
        })
        .catch(error => console.error("Error al cargar el archivo JSON:", error));
});

// Función para agregar el producto al carrito
function addToCart(productName) {
    fetch('/addToCart', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ producto: productName }) // Envía el nombre del producto al servidor en el cuerpo de la solicitud
    }) 
    .then(response => response.json()) // Parsea la respuesta JSON del servidor
    .then(data => {
        alert(data.message); // Muestra un mensaje de respuesta del servidor
    })
    .catch(error => {
        console.error('Error:', error); // Muestra cualquier error que ocurra
    });
}
