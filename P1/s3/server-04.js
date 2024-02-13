const http = require('http');

//-- Definir el puerto a utilizar
const PUERTO = 8087;

//-- Crear el servidor
const server = http.createServer((req, res) => {
    
  //-- Indicamos que se ha recibido una petición
  console.log("Petición recibida!");

  //-- Cabecera que indica el tipo de datos del
  //-- cuerpo de la respuesta: Texto HTML
  res.setHeader('Content-Type', 'text/html');

  //-- Mensaje del cuerpo
  res.write(`
    <!DOCTYPE html>
  <html>
      <title>Prueba</title>
      <body>
          <p>Probandoooo.....</p>
          <b>Negrita!!</b>
      </body>
  </html>
  `);

  //-- Terminar la respuesta y enviarla
  res.end();
});

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);

console.log("Happy server activado!. Escuchando en puerto: " + PUERTO);