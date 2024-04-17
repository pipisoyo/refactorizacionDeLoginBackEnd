const form = document.getElementById('registerForm');
form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => {
        if (response.status === 201) {
            // Si el registro es exitoso, muestra una alerta y redirige
            alert("Usuario registrado exitosamente.");
            window.location.replace("/login");
        } else {
            // Si hay un error, convierte la respuesta a JSON para manejar el mensaje de error
            return response.json();
        }
    })
    .then((data) => {
        if (data && data.error) {
            // Antes de mostrar un nuevo mensaje de error, elimina los anteriores
            const existingErrorMessage = document.querySelector('#emailError .error-message');
            if (existingErrorMessage) {
                existingErrorMessage.remove();
            }

            // Muestra el mensaje de error debajo del campo de email
            const errorMessage = document.createElement('div');
            errorMessage.textContent = data.message; // Mensaje de error del servidor
            errorMessage.style.color = 'red';
            errorMessage.classList.add('error-message'); // Asegúrate de agregar esta clase en tu nuevo elemento de mensaje de error
            const emailErrorContainer = document.querySelector('#emailError');
            emailErrorContainer.appendChild(errorMessage);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});