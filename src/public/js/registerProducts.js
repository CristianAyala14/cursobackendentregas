let form = document.getElementById("form")
let avisoOk = document.getElementById("succesMessage")
function okMessage(){
    let span = document.createElement("span");
    span.textContent = "Producto cargado correctamente."
    avisoOk.appendChild(span)
}

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el envío del formulario por defecto
    const formData = new FormData(this); // Captura los datos del formulario
    const formData2 = new URLSearchParams(formData).toString();
    fetch('/api/products', {
        method: 'POST', // Asegúrate de especificar el método como POST
        body: formData2, // Envía los datos del formulario como body de la solicitud
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Establece el tipo de contenido adecuado
        }
    })
    .then(res => res.json())
    .then(data => {
        // Aquí puedes manejar la respuesta si es necesario
        okMessage();
        form.reset(); // Resetea el formulario después de un envío exitoso
    })
    .catch(error => {
        console.error('Error:', error);
    });
});



