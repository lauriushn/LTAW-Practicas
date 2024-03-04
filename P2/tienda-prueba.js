// PRÁCTICA 2. TIENDA.

//-- Importamos los módulos necesarios
const http = require('http');
const fs = require('fs');

//-- Definimos las constantes
const port = 9092;  //http://127.0.0.1:9090/
const tienda = "index.html";
const pag_error = "error.html"

const pag_404 = fs.readFileSync(pag_error);

const fichero_json = fs.readFileSync('tienda.json');
const tienda_json = JSON.parse(fichero_json)

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

    } else {
        recursos += url.pathname.substring(1);
    }



    if (recursos.endsWith('.css')) {   //-- .endsWith sirve para ver si la url acaba en '.css'
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
        // Lectura de otros recursos (HTML, JSON)
        const recursos_data = tienda_json[recursos];
        if (recursos_data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(JSON.stringify(recursos_data));
            res.end();
        } else {
            console.log("Error!! Solicitud de recurso no válido!");
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.write(pag_404);
            res.end();
        }
    }
});

//-- Activar el servidor. A la escucha de peticiones
//-- en el puerto definido
server.listen(port);
console.log("Servidor arrancado. Escuchando en puerto " + port);


