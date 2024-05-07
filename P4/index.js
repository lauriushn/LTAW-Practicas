const electron = require('electron');
const ip = require('ip');

const PUERTO = 9090;

const ipServer = ip.address();
console.log(ipServer);

//-- VERSIONES
const nodeVersion = document.getElementById('nodeVersion');
const electronVersion = document.getElementById('electronVersion');
const chromeVersion = document.getElementById('chromeVersion');


//-- Acceso a las API para obtener su info
nodeVersion.textContent = process.version;
electronVersion.textContent = process.versions.electron;
chromeVersion.textContent = process.versions.chrome;

//- IP
const ipAddress = document.getElementById('chat-ip');
ipAddress.textContent = ipServer;


//-- Evento de recepción de mensajes
socket.on("message", (msg) => {
    console.log("Mensaje Recibido!: ".blue + msg);
    const nickname = users[socket.id] || 'Anónimo'; // Obtener el apodo del usuario o establecerlo como "Anónimo" si no tiene apodo
    
    if (msg.startsWith('/')) {
        handleCommand(msg, socket, nickname);
    } else {
        //-- Si no es un comando especial, reenviarlo a todos los clientes conectados
        io.emit("message", `<strong>${nickname}:</strong> ${msg}`); // Enviar el mensaje con el apodo del usuario
        io.emit("serverMessage", msg); // Enviar el mensaje a la interfaz de servidor
    }
});
