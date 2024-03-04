// Seleccionar todas las imágenes con la clase 'adidas'
const imagenes = document.querySelectorAll('.adidas');

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