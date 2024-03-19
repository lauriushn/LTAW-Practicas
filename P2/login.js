
document.addEventListener('DOMContentLoaded', function () {
    const togglePasswordButton = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Event listener para el botón de alternar la visibilidad de la contraseña
    togglePasswordButton.addEventListener('click', function () {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text'; // Cambiar el tipo de entrada a texto
        } else {
            passwordInput.type = 'password'; // Cambiar el tipo de entrada a contraseña
        }
    });
});
