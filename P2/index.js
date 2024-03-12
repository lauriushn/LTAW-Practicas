//-- FUNCIÓN PARA INICIAR SESIÓN
function loginUser() {
    var username = document.getElementById("username").value;
    var foundUser = false;

    // Realizar una solicitud fetch para obtener la base de datos de usuarios desde el archivo JSON externo
    fetch('tienda.json')
        .then(response => response.json())
        .then(data => {
            // Recorre la lista de usuarios en la base de datos JSON obtenida
            data.usuarios.forEach(user => {
                if (user.nombre_usuario === username) {
                    // Si se encuentra el usuario, almacena el nombre de usuario en sessionStorage
                    sessionStorage.setItem('usuarioConectado', username);
                    foundUser = true;
                    // Ocultar el formulario de inicio de sesión y mostrar la información del usuario
                    document.getElementById("loginSection").style.display = "none";
                    document.getElementById("userInfoSection").style.display = "block";
                }
            });

            // Si no se encuentra el usuario, muestra un mensaje de error
            if (!foundUser) {
                document.getElementById("loginMessage").innerText = "Nombre de usuario incorrecto.";
            }
        })
        .catch(error => {
            console.error('Error al obtener la base de datos de usuarios:', error);
            document.getElementById("loginMessage").innerText = "Error al obtener la base de datos de usuarios.";
        });

    return false; // Evita que el formulario se envíe
}

//-- FUNCIÓN PARA CERRAR SESIÓN 
function logoutUser() {
    // Eliminar el nombre de usuario de sessionStorage
    sessionStorage.removeItem('usuarioConectado');
    // Mostrar el formulario de inicio de sesión y ocultar la información del usuario
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("userInfoSection").style.display = "none";
}
