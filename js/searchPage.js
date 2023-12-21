// 전역변수
const searchWord = localStorage.getItem('inputWord')

// 헤더 모듈 가져오기
function checkIsLogined() {
    {
        const isLoggedIn = localStorage.getItem('로그인상태')
        console.log(isLoggedIn)
        document.body.insertAdjacentElement('afterbegin', headerModule(isLoggedIn))
    }
}
document.addEventListener('DOMContentLoaded', checkIsLogined)

// 서버데이터 가져오기
async function getBibleData(searchWord) {
    try {
        const data = await fetch(`http://127.0.0.1:3300/api/bible/search?query=${searchWord}`)
        const bibleData = await data.json()
        return bibleData
    } catch (error) {
        console.log(error)
    }
}


/* 검색 결과 보여주기 */
// 검색 content 표시하기
async function displayContent(updateResults, searchWord) {
    for (let i = 0; i < updateResults.length; i++) {
        const bookChapter = document.createElement('h4')
        const searchContent = document.createElement('p')

        bookChapter.innerHTML = `${JSON.stringify(updateResults[i].title).replace(/"/g, '')}&nbsp${JSON.stringify(updateResults[i].chapter).replace(/"/g, '')}장&nbsp${JSON.stringify(updateResults[i].verse).replace(/"/g, '')}절`
        searchContent.innerHTML = `${JSON.stringify(updateResults[i].content).replace(/"/g, '')}`


        contents.append(bookChapter, searchContent)

        // 검색단어 하이라이트 적용하기
        if (searchContent.innerText.includes(searchWord)) {
            searchContent.innerHTML = searchContent.innerHTML.split(searchWord).join(`<span class='highlight'>${searchWord}</span>`)
        }
    }
}


// 검색결과 가져오기
async function showSearchBible() {
    displayLoadingImg() // 로딩화면 보여주기
    const searchedResults = await getBibleData(searchWord) // 서버데이터 가져오기
    // 로딩화면 가리고 리스트 보여주기 (데이터 다 가져왔으니)
    const loadingPhrases = document.querySelector('.loading-Phrases')
    loadingPhrases.remove()

    const updateResults = await searchedResults.bibles.filter(bibles => {
        if (searchWord) {
            return bibles.content.includes(searchWord)
        } 
    })
    // 로딩화면 문구 만드는 함수      
    function displayLoadingImg() {
        const loading = document.createElement('h2')
        loading.innerText = '검색결과를 가져오고 있습니다'
        loading.className = 'loading-Phrases'
        contents.appendChild(loading)
    }
    // 검색결과 유무에 따른 문구 표시
     if(updateResults.length > 0) displayContent(updateResults, searchWord)
     else {
         const noResult = document.createElement('h2')
         noResult.innerText = '검색결과가 없습니다'
         contents.appendChild(noResult)
     }
}

showSearchBible()

// 모바일 버거버튼 클릭시
document.body.addEventListener('click', function (e) {
    if (e.target.className == 'material-symbols-outlined') {
        const navButtons = document.querySelector('.nav-btns')
        const mobileBackground = document.querySelector('.mobile-background')
        navButtons.classList.toggle('show')
        mobileBackground.classList.toggle('show')
    }
})

