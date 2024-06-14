// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
    // Comprueba si hay un usuario guardado en localStorage
    if (localStorage.getItem("username")) {
        // Si hay un usuario, muestra el mensaje de bienvenida
        showWelcomeMessage(localStorage.getItem("username"));
    }
});

/// Función para iniciar sesión
function login() {
    // Obtiene los valores de los campos de texto
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Comprueba que ambos campos no estén vacíos
    if (username && password) {
        // Guarda el nombre de usuario y la contraseña en localStorage
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);

        // Redirige a la página index.html
        window.location.href = "index.html";
    } else {
        alert("Por favor, ingrese usuario y contraseña.");
    }
}


// Función para mostrar el mensaje de bienvenida
function showWelcomeMessage(username) {
    // Oculta el formulario de inicio de sesión
    document.getElementById("login-form").style.display = "none";
    
    // Muestra el mensaje de bienvenida
    document.getElementById("welcome-text").textContent = "Bienvenido, " + username + "!";
    document.getElementById("welcome-message").style.display = "block";
}

// Función para cerrar sesión
function logout() {
    // Elimina los datos del usuario del localStorage
    localStorage.removeItem("username");
    localStorage.removeItem("password");

    // Muestra el formulario de inicio de sesión
    document.getElementById("login-form").style.display = "block";

    // Oculta el mensaje de bienvenida
    document.getElementById("welcome-message").style.display = "none";

    // Limpia los campos de entrada del formulario de inicio de sesión
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}








