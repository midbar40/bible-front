
// 아이디 찾기 화면 뿌려주기
const createFindUserIdDom = () => {
    const findUserId = document.querySelector('.findUserId')
    findUserId.addEventListener('click', () => {
        const main = document.querySelector('main')
        main.innerHTML = ''
        const findUserIdField = document.createElement('div')
        findUserIdField.className = 'findUserIdField'
        findUserIdField.innerHTML = `
                <form class="findUserId-section">
                    <div class="name">
                        <h4>이름</h4>
                        <input type="text" class="userName" placeholder="이름을 입력하세요" required />
                    </div>
                    <div class="mobile">
                        <h4>휴대폰번호</h4>
                       <div class="mobile-number"> 
                        <input type="mobile" class="userMobile" placeholder="휴대폰번호를 입력해주세요" required />
                        <button type="submit" class='authNumber'>인증번호</button>
                        </div>
                    </div>
                    <div class="findId-btn">
                        <button type="submit">아이디 찾기</button>
                    </div>
                    <div class="bottom-btns">
                    <a href="./login.html" >로그인하기</a>
                    <a href="#" class="findUserPw">비밀번호찾기</a>
                    <a href="./register.html">회원가입</a>
                  </div>
            </form>
            ` 
        main.appendChild(findUserIdField)
    })
}

(function(){
    console.log('실행되니?')
    createFindUserIdDom()
})()


// 인증번호 버튼 클릭시 인증번호 입력창 생성
const createAuthNumberDom = () => {
    const userName = document.querySelector('.userName')
    const userMobile = document.querySelector('.userMobile')
    const userNameValue = userName.value
    const userMobileValue = userMobile.value
        if(userNameValue === '' ){
            alert('이름을 입력해주세요')
            return
        }
        else if (userNameValue.lenth > 1){
            alert('이름을 올바르게 입력해주세요')
            return
        }
        if(userMobileValue === ''){
            alert('휴대폰번호를 입력해주세요')
            return
        }
        else if (userMobileValue.length < 10 || userMobileValue.length > 11) {
            alert('휴대폰번호를 올바르게 입력해주세요')
            return
        }
        console.log('71번줄',userNameValue, userMobileValue)

        return {userNameValue, userMobileValue}
}

// 인증번호 클릭시 인증번호 유저핸드폰으로 전송
const receiveOtp = async(userNameValue, userMobileValue) => {
    const receiveOtp = await fetch('http://127.0.0.1:3300/api/otp/generateOtp', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name : userNameValue,
            mobile: userMobileValue,
            count : 1
        })
    })
    const otpNumber = await receiveOtp.json()
    console.log(otpNumber)
    if(otpNumber.code === 400){
        alert('등록된 회원이 아닙니다.')
    } 
    if(otpNumber.code === 200) {
        const mobileNumber = document.querySelector('.mobile-number')
        mobileNumber.innerHTML = `
        <input type="mobile" class='otpNum' placeholder="인증번호를 입력해주세요" required />
        <button type="submit" class='authNumber-confirm'>확인</button>
        <a href="#" class="authNumber-reSend">인증번호가 오지 않았나요?</a>
        `
    }
}

// 인증번호 서버로 전송
const confirmOtp = async() => {
    const userName = document.querySelector('.userName')
    const userMobile = document.querySelector('.userMobile')
    const otpNumber = document.querySelector('.otpNum')
    try{
        const sendOtpToServer = await fetch('http://127.0.0.1:3300/api/otp/checkOtp', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name : userName.value,
                mobile: userMobile.value,
                otp: otpNumber.value
            })
        })
        const otpResult = await sendOtpToServer.json()
        console.log(otpResult)
    }catch{
        alert ('인증번호가 일치하지 않습니다.')
        console.log('인증번호가 일치하지 않습니다.')
    }
}



document.body.addEventListener('click', function (e) {
    if (e.target.className == 'authNumber' || e.target.className == 'authNumber-reSend') {
        const {userNameValue, userMobileValue} = createAuthNumberDom()
        console.log(userNameValue, userMobileValue)
        receiveOtp(userNameValue, userMobileValue) // 여기에 인증번호가 오게 하는 함수를 호출해야 한다
    }
    if(e.target.className == 'authNumber-confirm'){
        confirmOtp()
    }
})
