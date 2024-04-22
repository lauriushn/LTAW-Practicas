//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');

const PUERTO = 9090;

//-- Crear una nueva aplicación web
const app = express();

//-- Crear un servidor, asociado a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor HTTP
const io = socket(server);

//-- Creamos constante para usuarios en línea
let users_conected = 0;

const users = {}; // Objeto para almacenar los apodos de los usuarios conectados

//-------- PUNTOS DE ENTRADA DE LA APLICACIÓN WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname + '/'));

//-- El directorio público contiene ficheros estáticos
app.use(express.static('public'));

//------------------- GESTIÓN DE SOCKETS IO
//-- Evento: Nueva conexión recibida
io.on('connect', (socket) => {

    console.log('** NUEVA CONEXIÓN **'.yellow);

    //-- Incrementar el contador de usuarios conectados
    users_conected++;

    //-- Evento de recepción del apodo del usuario
    socket.on('nickname', (nickname) => {
        users[socket.id] = nickname; // Almacenar el apodo del usuario en el objeto users
        socket.broadcast.emit('message', `<span style="color: blue;">${nickname} se ha unido al chat.</span>`);
    });

    //-- Enviar mensaje de bienvenida al nuevo usuario (verde)
    socket.emit('message', '<span style="color: green;">¡Bienvenido al chat!</span>');

    //-- Evento de desconexión
    socket.on('disconnect', function () {
        console.log('** CONEXIÓN TERMINADA **'.red);

        //-- Decrementar el contador de usuarios conectados
        users_conected--;

        const nickname = users[socket.id] || 'Anónimo'; // Obtener el apodo del usuario o establecerlo como "Anónimo" si no tiene apodo
        //-- Notificar a todos los clientes que alguien se ha desconectado (rojo)
        socket.broadcast.emit('message', `<span style="color: red;">${nickname} se ha desconectado del chat.</span>`);
    });

    //-- Evento de recepción de mensajes
    socket.on("message", (msg) => {
        console.log("Mensaje Recibido!: ".blue + msg);
        const nickname = users[socket.id] || 'Anónimo'; // Obtener el apodo del usuario o establecerlo como "Anónimo" si no tiene apodo
        
        if (msg.startsWith('/')) {
            handleCommand(msg, socket, nickname);
        } else {
            //-- Si no es un comando especial, reenviarlo a todos los clientes conectados
            io.emit("message", `<strong>${nickname}:</strong> ${msg}`); // Enviar el mensaje con el apodo del usuario
        }
    });

    //-- Evento de recepción de "typing"
    socket.on('typing', () => {
        const nickname = users[socket.id] || 'Anónimo';
        socket.broadcast.emit('typing', nickname);
    });

    //-- Evento de recepción de "stop typing"
    socket.on('stop typing', () => {
        const nickname = users[socket.id] || 'Anónimo';
        socket.broadcast.emit('stop typing', nickname);
    });
});

//-- Función para manejar los comandos especiales
function handleCommand(msg, socket, nickname) {
    const command = msg.substring(1); // Eliminar el '/' del comando
    switch (command) {
        case 'help':
            sendToClient(socket, 'Lista de comandos soportados: /help, /list, /hello, /date');
            break;
        case 'list':
            sendToClient(socket, `Número de usuarios en línea: ${users_conected}`);
            break;
        case 'hello':
            sendToClient(socket, 'Buenas, espero que todo le vaya bien');
            break;
        case 'date':
            sendToClient(socket, `La fecha actual es: ${new Date().toLocaleDateString()}`);
            break;
        default:
            sendToClient(socket, `Comando desconocido: ${command}`);
    }
}

//-- Función para enviar un mensaje solo al cliente que lo solicitó
function sendToClient(socket, message) {
    socket.emit('message', message);
}

//-- Lanzar el servidor HTTP
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
