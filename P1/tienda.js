// PRÁCTICA 1. TIENDA.

//-- Importamos los módulos necesarios
const http = require('http');
const fs = require('fs');

//-- Definimos las constantes
const port = 9090;  //http://127.0.0.1:9090/
const tienda = "index.html";
const pag_error = "error.html"

const pag_404 = fs.readFileSync(pag_error);

//-- Creamos el servidor
const server = http.createServer((req, res) => {
    console.log("Petición recibida!");

    let url = new URL(req.url, 'http://' + req.headers['host']);
    console.log("La URL del recurso es: " + url.href);
    console.log("  Ruta: " + url.pathname);

    if (url.pathname == '/' | url.pathname == '/index.html') {

        //-- Leemos el fichero index.html
        fs.readFile(tienda, (err, data) => {
            if (err) {  //-- Si hay error
                console.log("Error!!")
                console.log(err.message);
                
                res.write(pag_404);
                res.end();
            }
            else {  //-- Lectura normal
                res.setHeader('Content-Type','text/html');
                res.write(data);
                res.end();
            }
        });
    }
    else if (url.pathname == "/producto1.html" | url.pathname == "/producto2.html"){
        //-- Leemos el fichero productoX.html
        const producto = url.pathname.split('/')[1];  //-- Me quedo con el nombre del fichero

        fs.readFile(producto, (err, data) => {
            if (err) {  //-- Si hay error
                console.log("Error!!")
                console.log(err.message);
                
                res.write(pag_404);
                res.end();
            }
            else {  //-- Lectura normal
                res.setHeader('Content-Type','text/html');
                res.write(data);
                res.end();
            }
        });
    }

    else {
        console.log("Solicitud de un recurso no válido");
        res.write(pag_404);
        res.end();
    }   
});

//-- Activar el servidor. A la escucha de peticiones
//-- en el puerto definido
server.listen(port);
console.log("Servidor arrancado. Escuchando en puerto " + port);


