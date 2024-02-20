// PRÁCTICA 1. TIENDA.

//-- Importamos los módulos necesarios
const http = require('http');
const fs = require('fs');

//-- Definimos las constantes
const port = 9090;  // http://127.0.0.1:9090/
const tienda = "index.html";


//-- Creamos el servidor
const server = http.createServer((req, res) => {
    console.log("Petición recibida!");

    //-- Leemos el archivo index.html
    fs.readFile(tienda, (err, data) => {
        if (err) {
            console.log("Error!!");
            console.log(err.message);

        } else {  //-- Lectura normal
            res.setHeader('Content-Type', 'text/html');
            res.write(data);
            res.end();
        }
    });
});

//-- Activar el servidor. A la escucha de peticiones
//-- en el puerto definido
server.listen(port);
console.log("Servidor arrancado. Escuchando en puerto " + port);


