// -- Función para cargar la información del JSON
document.addEventListener("DOMContentLoaded", function() {
    fetch("tienda.json")
        .then(response => response.json())
        .then(data => {
            // Actualizar el nombre de los productos
            document.getElementById("name_producto1").textContent = data.productos[0].nombre;
            document.getElementById("name_producto2").textContent = data.productos[1].nombre;
            document.getElementById("name_producto3").textContent = data.productos[2].nombre;
        })
        .catch(error => console.error("Error al cargar el archivo JSON:", error));
    
    // Obtener el botón para ver el carrito
    const verCarritoBtn = document.getElementById("vercarrito");

    // Agregar un evento de clic al botón para ver el carrito
    verCarritoBtn.addEventListener("click", function() {
        verCarrito(); // Llama a la función verCarrito() al hacer clic en el botón
    });
    const eliminarCarritoBtn = document.getElementById("eliminarcarrito");

    eliminarCarritoBtn.addEventListener("click", function() {
        eliminarCarrito();
    });
});

function eliminarCarrito() {
    fetch('/eliminarCarrito', { method: 'DELETE' }) // Realiza una solicitud DELETE para eliminar el carrito
        .then(response => response.json())
        .then(data => {
            alert(data.message); // Muestra un mensaje de alerta con la respuesta del servidor
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
// Función para ver el contenido del carrito
function verCarrito() {
    fetch('/verCarrito') // Hacer una solicitud para obtener el contenido del carrito
        .then(response => response.json())
        .then(data => {
            if (data.productos) {
                const nombresProductos = data.productos.join(', '); // Concatenar los nombres de los productos
                alert('Contenido del carrito: ' + nombresProductos); // Mostrar los nombres de los productos en un mensaje de alerta
            } else {
                alert(data.message); // Mostrar mensaje de carrito vacío o de inicio de sesión
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Función para abrir la ventana de inicio de sesión
function openLoginWindow() {
    // Abre una nueva ventana con el formulario de inicio de sesión
    window.open("login.html", "_blank", "width=400,height=400");
}


// Función para obtener el nombre de usuario de la cookie
function getCookieValue(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

function logout() {
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Elimina la cookie de usuario
    document.querySelector('h3').textContent = ''; // Actualiza el mensaje de conexión
}

//-- PETICIONES AJAX
document.addEventListener("DOMContentLoaded", function() {
    // Cargar la información del JSON como lo estabas haciendo antes

    const searchInput = document.getElementById('search-input');

    // Manejar evento keyup en el campo de búsqueda
    searchInput.addEventListener('keyup', function(event) {
        const searchTerm = event.target.value.trim(); // Obtener el término de búsqueda

        if (searchTerm === '') {
            clearSearchResults(); // Limpiar los resultados si la barra de búsqueda está vacía
            return;
        }

        // Realizar una solicitud AJAX al servidor para buscar productos
        fetch(`/search?query=${encodeURIComponent(searchTerm)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al buscar productos');
                }
                return response.json();
            })
            .then(data => {
                displaySearchResults(data); // Mostrar los resultados de búsqueda
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});

function clearSearchResults() {
    const searchResultsDiv = document.getElementById('search-results');
    searchResultsDiv.innerHTML = ''; // Limpiar los resultados de búsqueda
}

function displaySearchResults(products) {
    const searchResultsDiv = document.getElementById('search-results');
    searchResultsDiv.innerHTML = ''; // Limpiar resultados anteriores

    if (products.length === 0) {
        searchResultsDiv.innerHTML = 'No se encontraron productos.';
        return;
    }

    const ul = document.createElement('ul');
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = product.nombre;
        li.dataset.productUrl = product.url; // Agrega el URL del producto como atributo de datos
        li.addEventListener('click', function() {
            window.location.href = this.dataset.productUrl; // Redirecciona al URL del producto al hacer clic en el resultado
        });
        li.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#a0a0a0'; // Cambia el color de fondo al pasar el cursor sobre el resultado
        });
        li.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'transparent'; // Restaura el color de fondo al quitar el cursor del resultado
        });
        ul.appendChild(li);
    });
    searchResultsDiv.appendChild(ul);
}
