const form = document.getElementById("restartPasswordForm")
form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    fetch("/api/sessions/restartPassword", {
        method: "POST",
        body: JSON.stringify(obj),
        headers:{
            "Content-Type": "application/json"
        }
    }).then(res=>{
        if(res.status === 200){
            console.log("Contraseña restaurada");
        }else{
            console.log("error");
            console.log(res)
        }
    })
})