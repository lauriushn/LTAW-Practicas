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
