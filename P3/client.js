//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");

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

socket.on("message", (msg) => {
    display.innerHTML += '<p style="color:black">' + msg + '</p>';
});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
    if (msg_entry.value) {
        socket.send(msg_entry.value);
        //-- Resetear el estado de escribir al enviar el mensaje
        typing = false;
        socket.emit('stop typing');
    }
    //-- Borrar el mensaje actual
    msg_entry.value = "";
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
        const li = document.createElement('li');
        li.textContent = user;
        userList.appendChild(li);
    });
});
