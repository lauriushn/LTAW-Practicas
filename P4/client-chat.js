//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const serverMessages = document.getElementById("serverMessages"); // Agregado

//-- Pedir al usuario su apodo al cargar la página
const nickname = prompt("Por favor, introduce tu apodo:");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

//-- Enviar el apodo al servidor
socket.emit('nickname', nickname);

//-- Variable para controlar si el usuario está escribiendo
let typing = false;

//-- Manejar el evento de escribir en el input
msg_entry.addEventListener('input', () => {
    //-- Si el campo de entrada no está vacío y el usuario no está escribiendo
    if (msg_entry.value.trim() !== '' && !typing) {
        //-- Enviar mensaje al servidor indicando que el usuario está escribiendo
        socket.emit('typing');
        typing = true;
    } else if (msg_entry.value.trim() === '' && typing) {
        //-- Si el campo de entrada está vacío y el usuario estaba escribiendo, enviar mensaje al servidor indicando que dejó de escribir
        socket.emit('stop typing');
        typing = false;
    }
});

//-- Función para mostrar los mensajes del servidor del resto de usuarios
socket.on("message", (msg) => {
    display.innerHTML += '<p style="color:black">' + msg + '</p>';
});

//-- Función para mostrar los mensajes del servidor en la columna de la derecha
socket.on("serverMessage", (msg) => {
    serverMessages.innerHTML += '<p style="color:green">' + msg + '</p>';
});

//-- Al apretar el botón se envía un mensaje al servidor
function sendMessage() {
    const message = "Mensaje de Prueba enviado a todos los clientes"; // Mensaje que se enviará a todos los clientes
    socket.send(message);
}

//-- Escuchar el evento de "NICKNAME está escribiendo..."
socket.on('typing', (nickname) => {
    display.innerHTML += '<p style="color: gray">' + nickname + ' está escribiendo...</p>';
});

//-- Escuchar el evento de "NICKNAME dejó de escribir..."
socket.on('stop typing', (nickname) => {
    const paragraphs = display.getElementsByTagName('p');
    for (let i = 0; i < paragraphs.length; i++) {
        if (paragraphs[i].textContent.includes(nickname + ' está escribiendo...')) {
            display.removeChild(paragraphs[i]);
            break;
        }
    }
});

const userList = document.getElementById("user-list");

socket.on('userList', (users) => {
    userList.innerHTML = ''; // Limpiar la lista de usuarios antes de actualizarla
    users.forEach(user => {
        const div = document.createElement('div');
        div.classList.add('user-item');
        
        // Verificar si el usuario es el propio usuario y mostrar como "NICKNAME (Yo)"
        if (user === nickname) {
            div.textContent = user + ' (Tú)';
            div.style.color = 'fuchsia'; // Aplicar el color rosa al propio usuario
        } else {
            div.textContent = user;
        }
        userList.appendChild(div);
    });
});

//-- Obtener referencia al elemento de audio
const messageSound = document.getElementById("messageSound");

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
    if (msg_entry.value) {
        socket.send(msg_entry.value);
        //-- Reproducir el sonido de mensaje enviado
        messageSound.play();
        //-- Resetear el estado de escribir al enviar el mensaje
        typing = false;
        socket.emit('stop typing');
    }
    //-- Borrar el mensaje actual
    msg_entry.value = "";
}
