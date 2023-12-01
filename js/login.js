const userEmail = document.querySelector('.login-id input')
const userPw = document.querySelector('.login-pw input')
const loginButton = document.querySelector('.submit button')
async function getUserData(){
    const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

    if(userEmail.value === ''){
        alert('이메일을 입력해주세요')
        return
    } 
    else if (userEmail.value.match(regExp) === null){
        alert('이메일 형식이 올바르지 않습니다.')
        return
    } 
    else if(userPw.value === ''){
       alert('비밀번호를 입력해주세요')
       return
    }  
    try{
    const data = await fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/users/login', {
    // const data = await fetch('http://127.0.0.1:3300/api/users/login', {
        method: 'POST',
        credentials: 'include', // 브라우저 쿠키탭에 토큰이 저장되기 위해서는 credentials: 'include' 옵션을 추가해줘야 한다.
        headers: {
            "Content-Type": "application/json",   
        },
        body:JSON.stringify({
            email: userEmail.value,
            password: userPw.value
        })
     
    })
    const userData = await data.json()
    console.log(userData)
    if(userData.code === 400){
        alert(userData.message)
    }
    else if(userData.code === 200){
        alert('로그인이 완료되었습니다, 메인 페이지로 이동합니다.')
        checkIsLogined()
        window.location.href = 'https://midbar40.github.io/bible-front/index.html'
    }
}catch(error){
    console.log(error)
}
}


const checkIsLogined = async() => {
    fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/users/isLogin', {
        method: 'GET',
        credentials : 'include',
        headers: {
            "Content-Type": "application/json",   
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log('로그인상태data :', data)
    })
}


loginButton.addEventListener('click',getUserData)