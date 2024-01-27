let avisoOk = document.getElementById("succesMessage");

function okMessage() {
    let span = document.createElement("span");
    span.textContent = "Contraseña restaurada.";
    avisoOk.appendChild(span);

    // Limpia el mensaje después de 5 segundos
    setTimeout(function () {
        avisoOk.innerHTML = "";
    }, 1000);
}
function redirectLogin(){
    setTimeout(function () {
        window.location.replace("http://localhost:8080/login")
    }, 1000);
}

const form = document.getElementById("restartPasswordForm")
form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    fetch("/api/sessions/resetpassword", {
        method: "POST",
        body: JSON.stringify(obj),
        headers:{
            "Content-Type": "application/json"
        }
    }).then(res=>{
        if(res.status === 200){
            console.log("Contraseña restaurada");
            okMessage();
            form.reset(); // Resetea el formulario después de un envío exitoso
            redirectLogin()
        }else{
            console.log("error");
            console.log(res)
        }
    })
})