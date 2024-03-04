// PRÁCTICA 2. TIENDA.

//-- Importamos los módulos necesarios
const http = require('http');
const fs = require('fs');
const path = require('path');

//-- Definimos las constantes
const port = 9092;
const pag_error = "error.html";
const pag_404 = fs.readFileSync(pag_error);

//-- Creamos el servidor
const server = http.createServer((req, res) => {
    console.log("Petición recibida!");

    let url = new URL(req.url, 'http://' + req.headers['host']);
    console.log("La URL del recurso es: " + url.href);
    console.log(" *Ruta: " + url.pathname);

    //-- Creamos una variable para almacenar los recursos solicitados
    let recurso = "";

    if (url.pathname == '/' || url.pathname == '/index.html') {
        recurso = "index.html";
    } else {
        recurso = url.pathname.substring(1); // Eliminamos el primer caracter del recurso, el '/'
    }

    // Obtenemos la extensión del archivo solicitado
    const extension = path.extname(recurso);

    // Definimos el tipo de contenido según la extensión del archivo
    let contentType = '';
    switch (extension) {
        case '.html':
            contentType = 'text/html';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        default:
            contentType = 'text/plain';
    }

    // Leemos el archivo solicitado
    fs.readFile(recurso, (err, data) => {
        if (err) {
            console.log("Error!! Solicitud de recurso no válido!");
            console.log(err.message);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.write(pag_404);
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(data);
            res.end();
        }
    });
});

//-- Activar el servidor para escuchar peticiones en el puerto definido
server.listen(port);
console.log("Servidor arrancado. Escuchando en puerto " + port);
