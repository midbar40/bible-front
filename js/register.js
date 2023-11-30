const userName = document.querySelector('.name input')
const userEmail = document.querySelector('.email input')
const userId = document.querySelector('.userId input')
const userPw = document.querySelector('.userPw input')


const registerButton = document.querySelector('.register-btn')
console.log(registerButton)
async function getUserData(){
    const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if(userName.value === ''){
        alert('이름을 입력해주세요')
        return
    } 
    else if (userName.value.length < 2){
        alert('이름은 2글자 이상 입력해주세요')
        return
    }
    else if(userEmail.value === ''){
        alert('이메일을 입력해주세요')
        return
    } 
    else if (userEmail.value.match(regExp) === null){
        alert('이메일 형식이 올바르지 않습니다.')
        return
    } 
    else if(userId.value === ''){
       alert('아이디를 입력해주세요')
       return
    }  
    else if(userId.value.length < 6 || userId.value.length > 12){
        alert('아이디는 6자리 이상 12자리 미만으로 설정해주세요')
        return
     } 
    else if(userPw.value === ''){
       alert('비밀번호를 입력해주세요')
       return
    } else if (userPw.value.length < 6 || userPw.value.length > 12){
        alert('비밀번호는 6자리 이상 12자리 미만으로 설정해주세요')
        return
    }  
    else {
    try{
    const data = await fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/users/register', 
    {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({
            name: userName.value,
            email: userEmail.value,
            userId: userId.value,
            password: userPw.value
        })
    })
    const userData = await data.json()    
    }
catch(error){
    console.log('회원가입 실패 :', error)
}
}
}

registerButton.addEventListener('click',getUserData)