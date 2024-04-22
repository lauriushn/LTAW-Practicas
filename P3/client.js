//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");

//-- Pedir al usuario su apodo al cargar la página
const nickname = prompt("Por favor, introduce tu apodo:");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

//-- Enviar el apodo al servidor
socket.emit('nickname', nickname);

socket.on("message", (msg) => {
    display.innerHTML += '<p style="color:black">' + msg + '</p>';
});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
    if (msg_entry.value)
        socket.send(msg_entry.value);

    //-- Borrar el mensaje actual
    msg_entry.value = "";
}
