let form =  document.getElementById('searchForm');
let productContainer = document.getElementById("productContainer");
function actualizarVista (res, formData2) {
    // Limpia el contenido actual del contenedor
    productContainer.innerHTML = "";
    // Verifica si hay productos en la respuesta
    if (res) {
        //creamos la lista ul y li de productos y agregamos al productContainer
        let ul = document.createElement("ul");
        // Agrega cada producto a la lista
        res.message.docs.forEach((product) => {
            let li = document.createElement("li");
            li.textContent = `${product.title} $${product.price}`;
        
            // Agregar botón para agregar al carrito
            let addButton = document.createElement("button");
            addButton.textContent = "Agregar al carrito";
            addButton.addEventListener ("click", async  function() {
                // Lógica para agregar el producto al carrito
                // try {
                //     // Crear un nuevo carrito
                //     const newCartResponse = await fetch("api/carts", {
                //         method: 'POST'
                //     }); 
                //     if (newCartResponse) {
                //         const newCartData = await newCartResponse.json();
                //         console.log(newCartData)
                //     } else {      
                //         console.error('Error al crear el carrito:', newCartResponse.statusText);
                //     }
                // } catch (error) {      
                //     console.error('Error:', error);
                // }
            });
        
            li.appendChild(addButton);
            ul.appendChild(li);
        });
        // Agrega la lista al contenedor
        productContainer.appendChild(ul);


        // Agrega los enlaces de paginación si es necesario
        let paginationDiv = document.createElement("div");
        let span = document.createElement("span");
        let params = formData2

        //boton prev
        if (res.message.hasPrevPage) {
            let prevLink = document.createElement("a");
            prevLink.href = `/api/products?page=${res.message.prevPage}&${params}`;
            prevLink.textContent = "Anterior";
            paginationDiv.appendChild(prevLink);

            prevLink.addEventListener("click", function(event) {
                event.preventDefault();
                fetch(prevLink.href)
                    .then(res => res.json())
                    .then(res => {
                        actualizarVista(res, formData2);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            });
        }
        //en el medio el span
        span.textContent = `Página ${res.message.page} de ${res.message.totalPages}`;
        paginationDiv.appendChild(span);

        //boton next
        if (res.message.hasNextPage) {
            let nextLink = document.createElement("a");
            nextLink.href = `/api/products?page=${res.message.nextPage}&${params}`;
            nextLink.textContent = "Siguiente";
            paginationDiv.appendChild(nextLink);
            /*Hasta aca los votones prev y next te enviarian a la api, con su respuesta, pero vos necesitas
            que se actualice la vista, entonces volves a llamar a la funcion actualizar vista, qcon la misma res y formdata del comienzo*/
            nextLink.addEventListener("click", function(event) {
                event.preventDefault();
                fetch(nextLink.href)
                    .then(res => res.json())
                    .then(res => {
                        actualizarVista(res, formData2);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            });
        }

        // Agrega el div con la paginación al productContainer
        productContainer.appendChild(paginationDiv);
    } else {
        // Si no hay productos, muestra un mensaje
        productContainer.innerHTML = "<p>No se encontraron productos.</p>";
    }
}




form.addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el envío del formulario por defecto
    const formData = new FormData(this); // Captura los datos del formulario
    const formData2 = new URLSearchParams(formData).toString()
    fetch('/api/products?' + formData2 )
    .then(res => res.json())  // Convertir respuesta a JSON
        .then(res => {
            actualizarVista(res, formData2);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
