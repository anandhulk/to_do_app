document.addEventListener("click",(e)=>{

    if(e.target.classList.contains("delete-me")){
        if(confirm("are you sure to delete?")){
            console.log(e.target.getAttribute("data-id"))
            axios.post("/delete-task",{name:"delete",id : e.target.getAttribute("data-id")})
            .then(()=>{
                e.target.parentElement.parentElement.remove()
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }

    if (e.target.classList.contains("edit-me")){
        let inputText=prompt("enter the new task",e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        if(inputText){
            axios.post("/edit-task",{item:inputText, id:e.target.getAttribute("data-id")})
            .then(()=>{
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML=inputText
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }
})