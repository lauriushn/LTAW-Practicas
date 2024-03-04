// Seleccionar todas las imágenes con la clase 'nike'
const imagenes = document.querySelectorAll('.puma');

// Iterar sobre cada imagen y añadir un evento de clic
imagenes.forEach((imagen) => {
    imagen.addEventListener('click', () => {
        // Remover la clase 'img-seleccionada' de todas las imágenes
        imagenes.forEach((img) => {
            img.classList.remove('img-seleccionada');
            img.style.transform = 'scale(1)'; // Restablecer el tamaño de la imagen
        });
        // Añadir la clase 'img-seleccionada' a la imagen seleccionada
        imagen.classList.add('img-seleccionada');
        // Aplicar un aumento de tamaño a la imagen seleccionada
        imagen.style.transform = 'scale(1.2)';
    });
});
