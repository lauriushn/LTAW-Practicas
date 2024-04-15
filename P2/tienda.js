// PRÁCTICA 2. TIENDA.

//-- Importamos los módulos necesarios
const http = require('http');
const fs = require('fs');

const PUERTO = 9090;
const tienda = "index.html";
const pag_error = "error.html";
const tienda_json = JSON.parse(fs.readFileSync('tienda.json'));

const pag_404 = fs.readFileSync(pag_error);

function get_user(req) {
    const cookie = req.headers.cookie;
    if (cookie) {
        let pares = cookie.split(";");
        let user;
        pares.forEach((element, index) => {
            let [nombre, valor] = element.split('=');
            if (nombre.trim() === 'user') {
                user = valor;
            }
        });
        return user || null;
    }
}

const server = http.createServer((req, res) => {
    console.log("Petición recibida!");

    let url = new URL(req.url, 'http://' + req.headers['host']);
    console.log("La URL del recurso es: " + url.href);
    console.log(" *Ruta: " + url.pathname);

    let recursos = "";

    if (url.pathname == '/' || url.pathname == '/index.html') {
        recursos += tienda;
        console.log("Recurso: " + recursos);

        fs.readFile(tienda, (err, data) => {
            if (err) {
                console.log("Error!!");
                console.log(err.message);
                res.write(pag_404);
                res.end();
            } else {
                let content = data.toString();
                let user = get_user(req);
                if (user) {
                    content = content.replace('<h3></h3>', `<h3>Bienvenid@ ${user}</h3>`);
                }
                res.setHeader('Content-Type', 'text/html');
                res.write(content);
                res.end();
            }
        });
    } else if (url.pathname == '/login') {
        if (req.method == 'GET') {
            const username = url.searchParams.get('username');
            const password = url.searchParams.get('password');
            
            console.log("Formulario GET:");
            console.log("Nombre usuario:", username);
            console.log("Contraseña:", password);

            const fichero_json = fs.readFileSync('tienda.json');
            const tienda_json = JSON.parse(fichero_json);

            const userExists = tienda_json.usuarios.find(user => user.nombre_usuario === username && user.password === password);
            if (userExists) {
                res.setHeader('Set-Cookie', `user=${username}; Path=/`);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<h1>Bienvenido ' + username + '</h1>');
                res.write('<a href="/">Pagina Principal</a>'); // Agregar enlace de regreso
                res.end();
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.write('<h1>Error 404: Usuario no encontrado</h1>');
                res.write('<a href="/login.html">Volver a intentarlo</a>'); // Agregar enlace de regreso
                res.end();
            }
        }
    } else if (url.pathname == '/addToCart' && req.method == 'POST') {
        // Manejar solicitud para añadir al carrito
        let user = get_user(req); // Obtener el usuario de la cookie
        if (user) {
            // Actualizar la cookie del carrito (aquí debes implementar la lógica para agregar el producto al carrito)
            // Por ahora, simplemente estableceremos una cookie de carrito vacía como ejemplo
            res.setHeader('Set-Cookie', `cart=${url.pathname}`); // Establecer la cookie del carrito
            res.writeHead(200, { 'Content-Type': 'application/json' }); // Establecer el tipo de contenido de la respuesta
            res.write(JSON.stringify({ message: 'Producto añadido al carrito.' })); // Enviar un mensaje de respuesta
            res.end(); // Finalizar la respuesta
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' }); // Establecer el código de estado 401 (No autorizado)
            res.write(JSON.stringify({ message: 'Inicie sesión para agregar productos al carrito.' })); // Enviar un mensaje de error
            res.end(); // Finalizar la respuesta
        }
    } else if (url.pathname == '/verCarrito' && req.method == 'GET') {
        // Manejar solicitud para ver el contenido del carrito
        let user = get_user(req); // Obtener el usuario de la cookie
        if (user) {
            // Aquí debes implementar la lógica para obtener y devolver el contenido del carrito del usuario
            // Por ahora, simplemente enviaremos un mensaje de ejemplo
            res.writeHead(200, { 'Content-Type': 'application/json' }); // Establecer el tipo de contenido de la respuesta
            res.write(JSON.stringify({ message: 'Contenido del carrito: Producto 1, Producto 2, Producto 3' })); // Enviar un mensaje de respuesta
            res.end(); // Finalizar la respuesta
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' }); // Establecer el código de estado 401 (No autorizado)
            res.write(JSON.stringify({ message: 'Inicie sesión para ver el contenido del carrito.' })); // Enviar un mensaje de error
            res.end(); // Finalizar la respuesta
        }
    } else if (url.pathname.endsWith('.css')) {
        recursos += url.pathname.substring(1);
        console.log("Recurso-css: " + recursos);
        fs.readFile(recursos, (err, data) => {
            if (err) {
                console.log("Error!! Solicitud de recurso no válido!");
                console.log(err.message);
                res.write(pag_404);
                res.end();
            } else {
                res.setHeader('Content-Type', 'text/css');
                res.write(data);
                res.end();
            }
        });
    } else if (url.pathname == '/search') {
        const query = url.searchParams.get('query');
        const results = tienda_json.productos.filter(product =>
            product.nombre.toLowerCase().includes(query.toLowerCase())
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
    } else {
        recursos += url.pathname.substring(1);
        console.log("Recurso-producto: " + recursos);
        fs.readFile(recursos, (err, data) => {
            if (err) {
                console.log("Error!! Solicitud de recurso no válido!");
                console.log(err.message);
                res.write(pag_404);
                res.end();
            } else {
                res.setHeader('Content-Type', 'text/html');
                res.write(data);
                res.end();
            }
        });
    }
});

server.listen(PUERTO);
console.log("Servidor arrancado. Escuchando en puerto " + PUERTO);
