const loginButton = document.querySelector('.submit button')

async function getUserData(){
    try{
    const data = await fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/users/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
    })
    const userData = await data.json()
    console.log(userData)
}catch(error){
    console.log(error)
}
}

loginButton.addEventListener('click',getUserData)