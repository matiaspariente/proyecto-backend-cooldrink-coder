let agregarBtn =document.getElementById('agregarBtn');

agregarBtn.addEventListener('click',(evt)=>{ // Boton para obtener productos al azar de la api-test
    evt.preventDefault();
    fetch('/api/carts/9/products',{
        method:'POST',
        body: {id:"<%= product.title %>",quantity:1},
        headers:{
            "Content-Type":"application/json"
        }
    }).then(response => response.text()
    ).then(data=>{console.log(data)})    
})