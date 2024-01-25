let form = document.getElementById("form");
let avisoOk = document.getElementById("succesMessage");

function okMessage() {
    let span = document.createElement("span");
    span.textContent = "Producto cargado correctamente.";
    avisoOk.appendChild(span);

    // Limpia el mensaje después de 5 segundos
    setTimeout(function () {
        avisoOk.innerHTML = "";
    }, 1000);
}

form.addEventListener('submit', function (event) {
    event.preventDefault(); // Previene el envío del formulario por defecto
    const formData = new FormData(this); // Captura los datos del formulario
    const formData2 = new URLSearchParams(formData).toString();

    fetch('/api/products/registerproducts', {
        method: 'POST',
        body: formData2,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('La solicitud no pudo completarse correctamente.');
            }
            return res.json();
        })
        .then(data => {
            okMessage();
            form.reset(); // Resetea el formulario después de un envío exitoso
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al conectar con el servidor.');
        });
});