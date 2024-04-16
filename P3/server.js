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

  //-- Enviar mensaje de bienvenida al nuevo usuario (verde)
  socket.emit('message', '<span style="color: green;">¡Bienvenido al chat!</span>');

  //-- Notificar a todos los clientes que alguien se ha conectado (azul)
  socket.broadcast.emit('message', '<span style="color: blue;">¡Se ha unido un nuevo participante al chat!</span>');

  //-- Evento de desconexión
  socket.on('disconnect', function () {
    console.log('** CONEXIÓN TERMINADA **'.red);

    //-- Decrementar el contador de usuarios conectados
    users_conected--;

    //-- Notificar a todos los clientes que alguien se ha desconectado (rojo)
    socket.broadcast.emit('message', '<span style="color: red;">¡Un participante se ha desconectado del chat!</span>');
  });

  //-- Evento de recepción de mensajes
  socket.on("message", (msg) => {
    console.log("Mensaje Recibido!: ".blue + msg);

    //-- Verificar si el mensaje es un comando especial
    if (msg.startsWith('/')) {
      handleCommand(msg, socket);
    } else {
      //-- Si no es un comando especial, reenviarlo a todos los clientes conectados
      io.emit("message", msg);
    }
  });
});

//-- Función para manejar los comandos especiales
function handleCommand(msg, socket) {
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
