let prayBucketIndex = 1


// 헤더 모듈 가져오기
function checkIsLogined(){
    {
        const isLoggedIn = localStorage.getItem('로그인상태')
        console.log(isLoggedIn)         
        document.body.insertAdjacentElement('afterbegin',headerModule(isLoggedIn))
    }
}
document.addEventListener('DOMContentLoaded', checkIsLogined)


// 모바일 버거버튼 클릭시
document.body.addEventListener('click', function(e){
    if(e.target.className == 'material-symbols-outlined'){
        const navButtons = document.querySelector('.nav-btns')
        const mobileBackground = document.querySelector('.mobile-background')
        navButtons.classList.toggle('show')
        mobileBackground.classList.toggle('show')
    }
})


// PrayBucketList 작업
const prayBucketlistForm = document.querySelector('.prayBucketList-input form')
prayBucketlistForm.addEventListener('submit', addPrayBucketlist)

// PrayBucketList 추가
function addPrayBucketlist(event) {
    event.preventDefault()
    const currentTime = Date.now(); // 현재 시간을 밀리초로 얻기
    const currentDate = new Date(currentTime); // 해당 시간을 가진 날짜 객체 생성
    const formattedDate = `${currentDate.getFullYear().toString().slice(2,4)}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`;
    const prayBucketListTbody = document.querySelector('.prayBucketList-body tbody')
    const prayBucketlistInput = document.querySelector('.prayBucketList-input input')
    const prayBucketlist = prayBucketlistInput.value
    const prayBucketlistList = document.createElement('tr')
    prayBucketlistList.className = `prayBucketlist-List ${prayBucketIndex}`
    prayBucketlistList.innerHTML = 
    `
            <td><input type="checkbox" class='complete-checkbox'></td>
            <td>${prayBucketIndex}</td>
            <td>${prayBucketlist}</td>
            <td>${formattedDate}</td>
            <td class='checkedDate'></td>
    `
   
    
    prayBucketListTbody.appendChild(prayBucketlistList)
    prayBucketIndex ++ 
    prayBucketlistInput.value = ''

    // 몽고DB에 저장하는 코드 작성
  const saveServer = async() => {
    try{
    const response = await fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/prayBucketlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                number : prayBucketIndex,
                detail : prayBucketlist,
                author: localStorage.getItem('유저이름'),
            })
        })
      const result = await response.json()  
       console.log('기도버킷리스트 등록결과 :', result)
    }
    catch(err){
        console.log('기도버킷리스트 등록오류 :', err)
    }
}
saveServer() 
  }
    

// PrayBuckelist checkbox 클릭시 체크당시 날짜 출력
document.body.addEventListener('click', function(e){
    if(e.target.className == 'complete-checkbox'){
        const currentTime = Date.now(); // 현재 시간을 밀리초로 얻기
        const currentDate = new Date(currentTime); // 해당 시간을 가진 날짜 객체 생성
        const formattedDate = `${currentDate.getFullYear().toString().slice(2,4)}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`;
    
       document.querySelectorAll('input[type="checkbox"]').forEach(check => 
        check.addEventListener('change', 
       function(e){ // 2번째 기도내용부터는 이 함수가 추가되지 않는다, how? : querySelectorAll로 해결, 코파일럿 주석이 알려줬네..
        if(e.target.checked){
            let getCheckedTime = formattedDate // 현재 시간을 밀리초로 얻기
            e.target.closest('tr').querySelector('.checkedDate').innerText = getCheckedTime
             // 몽고DB에 저장하는 코드 작성

     }else if(!e.target.checked){
        e.target.closest('tr').querySelector('.checkedDate').innerText = ''
         // 몽고DB에 저장하는 코드 작성
         
     }
}))

    }
})