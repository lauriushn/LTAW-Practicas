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
});


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