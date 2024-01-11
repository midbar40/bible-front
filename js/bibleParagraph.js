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


async function getSavationData() {
    try{
        const response = await fetch('http://127.0.0.1:3300/api/bibleParagraphs/salvation')
        const data = await response.json()
        return data
    }catch(error){
        console.log(error)
    }
}

async function renderData() {
    const serverData = await getSavationData()
    console.log(serverData)
    // 화면에 렌더링
    const contents = document.querySelector('.contents')
    const subjectContents = document.createElement('div')
    subjectContents.className = 'subject-contents'
    subjectContents.innerHTML = `
     ${serverData.bibleParagraphs && serverData.bibleParagraphs.map(para => 
       ` <div>
            <h3>${para.title}</h3>
            <p>${para.detail}</p>
        </div>`
        ).join(' ')}
    `
    contents.appendChild(subjectContents)
}

const btns = document.querySelectorAll('.sub');
btns[0].classList.add('btnActive'); // 첫번째 버튼은 처음부터 클릭되어 있도록

btns.forEach((btn) => {
    if(btn.classList.contains('one')) {
        renderData()
    }
    // 클릭시 버튼 스타일 변경
    btn.addEventListener('click', (e) => {
        btns.forEach((btn) => {
            if (btn.classList.contains('btnActive')) {
                btn.classList.remove('btnActive');
            }
        });
        e.currentTarget.classList.add('btnActive');
    });
});


// 모바일 버거버튼 클릭시
document.body.addEventListener('click', function (e) {
    if (e.target.className == 'material-symbols-outlined') {
        const navButtons = document.querySelector('.nav-btns')
        const mobileBackground = document.querySelector('.mobile-background')
        navButtons.classList.toggle('show')
        mobileBackground.classList.toggle('show')
    }
})

