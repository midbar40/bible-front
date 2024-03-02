import { createFindUserIdDom } from './findUserId.js'


// 비밀번호 찾기 Dom 생성
export const createFindUserPwDom = () => {
    const main = document.querySelector('main')
        main.innerHTML = ''
        const findUserPwField = document.createElement('div')
        findUserPwField.className = 'findUserPwField'
        findUserPwField.innerHTML = `
                <form class="findUserPw-section">
                    <h2>Sola-Scriptura</h2>
                    <div class="userId">
                        <h4>아이디</h4>
                        <input type="text" class="userIdInput" placeholder="아이디를 입력하세요" required />
                    </div>
                    <div class="findPw-btn">
                        <button type="submit" class='findUserPwSubmit' disabled>비밀번호 찾기</button>
                    </div>
                    <div class="bottom-btns">
                    <a href="./login.html" >로그인하기</a>
                    <a href="#" class="findUserPw">비밀번호찾기</a>
                    <a href="./register.html">회원가입</a>
                  </div>
            </form>
            ` 
        main.appendChild(findUserPwField)
}

// 새로운 비밀번호를 가입시 핸드폰 번호로 문자전송한다.
const sendNewPw = async () => {
    const userIdInput = document.querySelector('.userIdInput')
    try {
        const data = await fetch('http://127.0.0.1:3300/api/users/findPw', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userIdInput.value
            })
        })
        const userData = await data.json()
        console.log('userData :', userData)
        return userData
    } catch (error) {
        console.log('비밀번호 찾기 실패 :', error)
    }
}

// 새로운 비밀번호 전송을 알려주는 화면 DOM 만들기
const createSendNewPwDom = (userPhoneNum) => {
    const encryptedPhoneNum = userPhoneNum.slice(0, 3) + '****' + userPhoneNum.slice(7, 11)
    const main = document.querySelector('main')
    main.innerHTML = ''
    const sendNewPwField = document.createElement('div')
    sendNewPwField.className = 'sendNewPwField'
    sendNewPwField.innerHTML = `
            <form class="sendNewPw-section">
                <h2>Sola-Scriptura</h2>
                <div class="userId">
                    <h4>가입시 입력하신 전화번호${encryptedPhoneNum}로 새로운 비밀번호를 전송했습니다. 
                    로그인 후 비밀번호를 변경해주세요.</h4>
                </div>
                <div class="bottom-btns">
                <a href="./login.html" >로그인하기</a>
              </div>
            </form>
                `
}

// 클릭이벤트 모음
document.body.addEventListener('click', function (e) {
    if(e.target.className == 'findUserId'){
        e.preventDefault()
        console.log('findUserId 버튼 클릭')
        history.pushState(null, null, '?page=findUserId')
        createFindUserIdDom()
    }else if(e.target.className == 'findUserPw'){
        e.preventDefault()
        console.log('findUserPw 버튼 클릭')
        history.pushState(null, null, '?page=findUserPw')
        createFindUserPwDom()
    }else if(e.target.className == 'findUserPwSubmit'){ // 비밀번호 찾기 버튼 클릭시
        e.preventDefault()
        console.log('findUserPwSubmit 버튼 클릭')
        // 가입시 입력한 핸드폰 번호로 새로운 비밀번호를 전송합니다.
        // 여기에 비밀번호 생성 및 전송하는 코드를 작성합니다.
        const { userData } = sendNewPw()
        // 해당 안내문이 나오는 DOM을 생성합니다.
        // 여기에 전화번호로 비밀번호를 보냈음을 안내하는 DOM을 생성하는 코드를 작성합니다.
        createSendNewPwDom(userData)
    }
})


