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
    console.log(" *Ruta: " + url.pathname);

    //-- Creamos una variable vacía para ir almacenando los recursos solicitados
    let recursos = "";

    if (url.pathname == '/' || url.pathname == '/index.html') {
        
        recursos += tienda;
        console.log("Recurso: " + recursos);

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
        })
    }
    else if (url.pathname.endsWith('.css')) {   //-- .endsWith sirve para ver si la url acaba en '.css'
        recursos += url.pathname.substring(1)  //-- Eliminamos el primer caracter del recurso, el '/'
        console.log("Recurso-css: " + recursos);
        
        fs.readFile(recursos, (err, data) => {
            if (err) { //-- Si hay error
                console.log("Error!! Solicitud de recurso no válido!");
                console.log(err.message);

                res.write(pag_404);
                res.end();
            }
            else {  //-- Lectura normal
                res.setHeader('Content-Type', 'text/css');
                res.write(data);
                res.end();
            }
        })
    }
    else {
        recursos += url.pathname.substring(1)  //-- Eliminamos el primer caracter del recurso, el '/'
        console.log("Recurso-prodcuto: " + recursos);

        fs.readFile(recursos, (err, data) => {
            if (err) { //-- Si hay error
                console.log("Error!! Solicitud de recurso no válido!");
                console.log(err.message);

                res.write(pag_404);
                res.end();
            }
            else {  //-- Lectura normal
                res.setHeader('Content-Type', 'text/html');
                res.write(data);
                res.end();
            }
        })
    } 
});

//-- Activar el servidor. A la escucha de peticiones
//-- en el puerto definido
server.listen(port);
console.log("Servidor arrancado. Escuchando en puerto " + port);


