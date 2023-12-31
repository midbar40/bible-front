
export function headerModule(isLoggedIn) {

    const header = document.createElement('header');
    const nav = document.createElement('nav');
    if (isLoggedIn) {

        nav.innerHTML =
            `
        <h1><a href="../index.html">Sola Scriptura</a></h1>
        <div class="nav-btns">
          <div class="menu-btn">
            <a href="./readbible.html">성경읽기</a>
            <a href="./game.html">시편필사</a>
            <a href="./prayNote.html">기도노트</a>
          </div>
          <div class="login-btn">
            <a id='logout-link' href="#">로그아웃</a>
            <a href="./register.html">회원가입</a>
          </div>
        </div>
        <span class="material-symbols-outlined"> menu </span>
        `
        header.appendChild(nav)
        document.body.addEventListener('click', function (e) {
            e.stopPropagation()
            if (e.target.id === 'logout-link') {
                logout(e)
                // window.location.href = 'https://midbar40.github.io/bible-front/index.html'
            }
        })
    } else if (isLoggedIn === null || isLoggedIn === undefined) {
        nav.innerHTML =
            `
        <h1><a href="../index.html">Sola Scriptura</a></h1>
        <div class="nav-btns">
          <div class="menu-btn">
            <a href="./readbible.html">성경읽기</a>
            <a href="./game.html">시편필사</a>
            <a href="./login.html">기도노트</a>
          </div>
          <div class="login-btn">
            <a href="./login.html">로그인</a>
            <a href="./register.html">회원가입</a>
          </div>
        </div>
        <span class="material-symbols-outlined"> menu </span>
        `
        header.appendChild(nav)
        if (document.querySelector('.login-btn')) {
            document.querySelector('.login-btn').addEventListener('click', () => {
                window.location.href = 'http://127.0.0.1:5500/bible-front/html/login.html'
                // window.location.href = 'https://midbar40.github.io/bible-front/html/login.html'
            })
        }
        document.addEventListener('click', function (e) {
            if (e.target.innerText === '기도노트') {
                alert('로그인이 필요한 서비스입니다.')
            }
        })
    }
    return header
}

export async function logout(e) {
    if (e.target.innerText == '로그아웃') {
        await fetch('http://127.0.0.1:3300/api/users/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (!data.token) {
                    localStorage.removeItem('로그인상태')
                    localStorage.removeItem('유저이름')
                    window.location.href = 'http://127.0.0.1:5500/index.html'
                }
            })
    }
}

window.headerModule = headerModule;
