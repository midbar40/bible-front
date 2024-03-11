// 헤더 모듈 가져오기
function checkIsLogined() {
    {
        const isLoggedIn = localStorage.getItem('로그인상태')
        console.log(isLoggedIn)
        document.body.insertAdjacentElement('afterbegin', headerModule(isLoggedIn))
    }
}
document.addEventListener('DOMContentLoaded', checkIsLogined)

// 유저 정보 가져오기
const getUserData = async () => {
    try {
        const userEmail = localStorage.getItem('유저이름')
        console.log('마이페이지 userEmail :',userEmail)
        const data = await fetch('http://127.0.0.1:3300/api/users/myPage', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: userEmail,
            })
        })
        const userData = await data.json()
        console.log(userData)
        return userData
    }
    catch (error){
        console.log('myPage 조회 에러 :',error)

    }
}


// 유저정보 DOM 그리기
const createUserDataDom = async () => {
    const userData = await getUserData()
    
    const userInfo = userData.userInfo

    const nameSpan = document.createElement('span')
    const emailSpan = document.createElement('span')
    const mobileSpan = document.createElement('span')

    nameSpan.className = 'nameSpan'
    emailSpan.className = 'emailSpan'
    mobileSpan.className = 'mobileSpan'

    nameSpan.innerHTML = `${userInfo[0]}`
    emailSpan.innerHTML = `${userInfo[1]}`
    mobileSpan.innerHTML = `${userInfo[2]}`

    const nameDiv = document.querySelector('.name')
    const emailDiv = document.querySelector('.email')
    const mobileDiv = document.querySelector('.mobile')

    nameDiv.appendChild(nameSpan)
    emailDiv.appendChild(emailSpan)
    mobileDiv.appendChild(mobileSpan)
}

createUserDataDom()

// 비밀번호 수정하기(변경)


// 회원탈퇴하기


// 모바일 버거버튼 클릭시
document.body.addEventListener('click', function (e) {
    if (e.target.className == 'material-symbols-outlined') {
        const navButtons = document.querySelector('.nav-btns')
        const mobileBackground = document.querySelector('.mobile-background')
        navButtons.classList.toggle('show')
        mobileBackground.classList.toggle('show')
    }
})


