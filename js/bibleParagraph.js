// 헤더 모듈 가져오기
function checkIsLogined() {
    {
        const isLoggedIn = localStorage.getItem('로그인상태')
        console.log('로그인상태 :', isLoggedIn)
        document.body.insertAdjacentElement('afterbegin', headerModule(isLoggedIn))
    }
}
document.addEventListener('DOMContentLoaded', checkIsLogined)



// 구절 주제 부분
const createSubject = () => {
    const contents = document.querySelector('.contents')
    const subjectDiv = document.createElement('div')
    subjectDiv.className = 'subject'
    subjectDiv.innerHTML = `
    <div class='sub one'><h3>구원</h3></div>
    <div class='sub two'><h3>감사</h3></div>
    <div class='sub three'><h3>고난</h3></div>
    <div class='sub four'><h3>치유</h3></div>
    <div class='sub five'><h3>용기</h3></div>
    `
    contents.appendChild(subjectDiv)
}

createSubject()
const subOne = document.querySelector('.sub.one')
subOne.addEventListener('click', () => {
    subOne.style.backgroundColor = '#ff7f00'
    subOne.style.color = 'white'
})
// 모바일 버거버튼 클릭시
document.body.addEventListener('click', function (e) {
    if (e.target.className == 'material-symbols-outlined') {
        const navButtons = document.querySelector('.nav-btns')
        const mobileBackground = document.querySelector('.mobile-background')
        navButtons.classList.toggle('show')
        mobileBackground.classList.toggle('show')
    }
})
