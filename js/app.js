

// 전역변수

const inputWindow = document.getElementById('serachbible')
const searchBtn = document.querySelector('.input-btn')
const ramdomPargraph = document.querySelector('.random-paragraph')
const main = document.querySelector('main')
const footer = document.querySelector('footer')
const contents = document.querySelector('.contents')
const moreViewBtn = document.querySelector('.moreview-btn')
const form = document.querySelector('form')

let randomData = []
let updateResults = []

// 헤더 모듈 가져오기
function checkIsLogined(){
    {
        const isLoggedIn = localStorage.getItem('로그인상태')
        console.log(isLoggedIn)
         document.body.insertAdjacentElement('afterbegin',indexHeaderModule(isLoggedIn))
    }
}
document.addEventListener('DOMContentLoaded', checkIsLogined)

// 성경 전문 가져오기
async function getSearchedBibleData(searchWord){
    try{
    const data = await fetch(`https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/bible/search?query=${searchWord}`)
    const bibleData = await data.json()
    console.log('검색bibletest', bibleData)
    updateResults.push(bibleData)
    return bibleData
}catch(error){
    console.log(error)
}
} 

// 성경 서버데이터 랜덤 가져오기 -> 개선필요, 업로드가 너무 느림 -> 23.11.28 서버에서 랜덤으로 가져오도록 변경함 
async function getBibleRandomData(){
    try{
    const data = await fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/bible/random')
    const bibleData = await data.json()
    randomData.push(bibleData)
    console.log('랜덤bibletest', randomData[0].bibles[0])
}catch(error){
    console.log(error)
}
} 

// 랜덤 이미지 배경데이터 가져오기 -> 개선필요, 업로드가 너무 느림
async function getImageData(){
    try{
    const data = await fetch(`https://api.unsplash.com/search/photos?query=background img&page=${Math.floor(Math.random()*150)}&per_page=35&client_id=NNmNL2OOluBZlE9VpvVPQKXW7p0vm0dCkz2n8dFIAUA&;`) // page랜덤설정 총페이지수 334페이지 -> 150으로 축소
    const imgData = await data.json()
    if(imgData.results.length == 0){ // 이미지 없을때 문구 띄워주기
        ramdomPargraph.style.backgroundColor = 'white'
        ramdomPargraph.innerHTML = `<h3>랜덤 성경 구절을 가져오고 있습니다</h3>`
    } else {
        for(let i = 0; i < imgData.results.length; i++){
        ramdomPargraph.style.backgroundImage = `url(${imgData.results[Math.floor(Math.random() * i)]?.urls.regular})`
    }

    }   
}catch(error){
    console.log(error)
}
}

// 성경 랜덤 구절 렌더링
// 배경이미지는 pixabay나 unsplash에서 랜덤으로 떙겨오자, 특정 키워드의 이미지만 떙겨오도록 설정
async function createRandomVerse(){
        await getBibleRandomData()
        await getImageData()
    const h3 = document.createElement('h3')
    h3.innerHTML = `${randomData[0].bibles[0].content}<br><p>${randomData[0].bibles[0].title}&nbsp${randomData[0].bibles[0].chapter}장 ${randomData[0].bibles[0].verse}절</p>`

    ramdomPargraph.appendChild(h3)
    }
    
    createRandomVerse()


// 인풋창 입력이벤트 - 검색버튼을 클릭하면 성경읽기 html로 이동하여 검색어와 일치되는 내용을 표시해야한다.

inputWindow.addEventListener('change', async(e) => {
    const searchWord= e.target.value.trim()
    console.log(searchWord)
    localStorage.setItem("inputWord", searchWord) // 검색어를 로컬스토리지에 저장
    
    if(searchWord == '') // || !searchWord || !inputWindow.onfocus 이 조건문들은 왜 안되는거지? / 아무것도 입력안하고 클릭시 폼타입이 제출되어버린다, 일단 html requierd로 막는다..
    {
        alert('검색어를 입력해주세요')}
    })

// 검색결과가 없으면 form태그가 작동하지 않도록 설정, form 태그에 onsubmit는 event를 못가져와서 아래와 같이 했더니 해결됨 
form.addEventListener('submit', async(e) => {
    await getSearchedBibleData()
    console.log(updateResults, '검색결과')
    if(updateResults.length || updateResults.length > 1) {return true} // 배열은 빈값도 메모리에 저장하기 때문에 if(updateResults)로 조건문을 작성하면 빈값도 있는것으로 인식함
    else {
        alert('검색결과가 없습니다')
        e.preventDefault()
   }
})    

// 모바일 버거버튼 클릭시
document.body.addEventListener('click', function(e){
    if(e.target.className == 'material-symbols-outlined'){
        const navButtons = document.querySelector('.nav-btns')
        const mobileBackground = document.querySelector('.mobile-background')
        navButtons.classList.toggle('show')
        mobileBackground.classList.toggle('show')
    }
})
