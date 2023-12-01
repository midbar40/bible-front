
const checkIsLogined = async() => {
    console.log('페이지가 이동되었습니다')
    // fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/users/isLogin', {
    await fetch('http://127.0.0.1:3300/api/users/isLogin', {
        method: 'GET',
        credentials : 'include',
        headers: {
            "Content-Type": "application/json",   
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        if(data.token){
            document.querySelector('.login-btn').innerHTML = `<a href="./html/login.html">로그아웃</a>`
            document.querySelector('.login-btn').addEventListener('click',logout)
        }
    })
}


async function logout(e){
    if(e.target.innerText == '로그아웃'){
        fetch('http://127.0.0.1:3300/api/users/logout', {
            method: 'POST',
            credentials : 'include',
            headers: {
                "Content-Type": "application/json",   
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)

            if(!data.token){
                window.location.reload()
                // document.querySelector('.login-btn').innerText = '로그인'
            }
        })
    }
}
document.addEventListener('DOMContentLoaded', checkIsLogined)