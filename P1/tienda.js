// PRÁCTICA 1. TIENDA.

//-- Importamos los módulos necesarios
const http = require('http');
const fs = require('fs');

//-- Definimos las constantes
const port = 9090;  //http://127.0.0.1:9090/
const tienda = "index.html";

//-- Creamos el servidor
const server = http.createServer((req, res) => {
    console.log("Peticion recibida!");

    //-- Analizar el recurso
    //-- Construir el objeto url con la url de la solicitud
    const url = new URL(req.url, 'http://' + req.headers['host']);
    console.log(url.pathname);
})

//-- Activar el servidor. A la escucha de peitciones
//-- en el puerto definido
server.listen(port);
console.log("Servidor arrancado. Escuchando en puerto " + port);
