// Seleccionar todas las imágenes con la clase 'puma'
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

//-- Función para coger informacion del JSON
document.addEventListener("DOMContentLoaded", function() {
    fetch("tienda.json")
        .then(response => response.json())
        .then(data => {
            // Busca el producto en el archivo JSON por su nombre
            const producto = data.productos.find(producto => producto.nombre === "Nike Shox");
            
            // Actualiza el nombre del producto
            document.getElementById("name_producto").textContent = producto.nombre;
  
            // Actualiza la descripción del producto
            document.getElementById("descripcion_producto").textContent = producto.descripcion;
  
            // Actualiza el precio del producto
            document.getElementById("precio_producto").textContent = producto.precio;
        })
        .catch(error => console.error("Error al cargar el archivo JSON:", error));
  });