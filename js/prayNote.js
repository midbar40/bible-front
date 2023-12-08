let prayBucketIndex = 1
let prayBucketDbId = null
let rightClickNearestTdInnerText

// 헤더 모듈 가져오기
function checkIsLogined(){
    {
        const isLoggedIn = localStorage.getItem('로그인상태')
        console.log('로그인상태 :', isLoggedIn)         
        document.body.insertAdjacentElement('afterbegin',headerModule(isLoggedIn))
    }
}
document.addEventListener('DOMContentLoaded', checkIsLogined)

// 한번에 여러개의 서버 데이터 가져오기
async function getPrayNoteServerData(){
    const reponses = await Promise.all([getPrayBucketlist(), getGrace(), getPrayDiary()])
    const prayBucketlistData = reponses[0]
    const graceList = reponses[1]
    const prayDiaryList = reponses[2]

    showPrayBucketlist(prayBucketlistData)
    showGraceList(graceList)
    showPrayDiary(prayDiaryList)
}

// PrayBucketlist 서버 데이터 가져오는 함수
async function getPrayBucketlist(){
    try{
    const data = await fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/prayBucketlist/getBucket',
    {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body : JSON.stringify({
        email: localStorage.getItem('유저이름')
    })
    }

    )
    const prayBucketlistData = await data.json()
    return prayBucketlistData
    }catch(error){
        console.log('기도버킷리스트 로딩 실패 :', error)
    }
}
   // 마우스 우클릭해서 기능 (수정, 삭제) 추가하기
   const deleteAndEditPrayBucketlist = (prayBucketlistList) => {
    prayBucketlistList.addEventListener('contextmenu', function(e){
        // 마우스 우클릭 시 클릭된 곳 색깔 입히기
        const rightClickeActive = e.target.parentNode.classList.add('active')
        const prayBucketlistList = document.querySelectorAll('.prayBucketlist-List')
        // 기존에 active 클래스가 있으면 삭제하고 새로운 active 클래스 추가하기
        prayBucketlistList.forEach((element => {
            if(element.classList.contains('active')){
                element.classList.remove('active')
                e.currentTarget.classList.add('active')    
         } 
        }))
        // 마우스 우클릭시 기존에 열려있던 input 수정창 사라지게 하기
        const editDetail = document.querySelector('#edit-detail')
        if(editDetail) editDetail.parentNode.innerHTML = rightClickNearestTdInnerText

        const rightClickList = e.target.parentNode.className.split(' ')[1]
        const rightClickNearestTd = e.target
         rightClickNearestTdInnerText = e.target.innerText
        console.log('e.target.parent :', e.target.parentNode.className.split(' ')[1])
        console.log('rightClickNearestTdInnerText :', rightClickNearestTdInnerText)
        e.preventDefault()
        const rightClickMenu = document.querySelector('.right-click-menu')
        rightClickMenu.innerHTML = `
        <div class='right-click-menu-edit'>수정</div>
        <div class='right-click-menu-delete'>삭제</div>
        `
        document.body.appendChild(rightClickMenu)

        rightClickMenu.style.top = `${e.clientY}px`
        rightClickMenu.style.left = `${e.clientX}px`
        rightClickMenu.style.display = 'flex'
    
        const rightClickMenuEdit = document.querySelector('.right-click-menu-edit')
        const rightClickMenuDelete = document.querySelector('.right-click-menu-delete')
        rightClickMenuEdit.style='cursor:pointer'
        rightClickMenuDelete.style='cursor:pointer'
        // 삭제하기
        rightClickMenuDelete.addEventListener('click', function(e){
            console.log('rightClickList :', rightClickList)
            fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/prayBucketlist/',
            {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                _id: rightClickList
            })
            })
            .then(res => res.json())
            .then(data => {
                console.log('data :', data)
                if(data.code == 200){
                    alert('삭제되었습니다.')
                    location.reload()
                }
            })
        })

        // 수정하기
        rightClickMenuEdit.addEventListener('click', function(e){
            rightClickNearestTd.innerHTML = `
            <input id='edit-detail' type='text' placeholder ='수정할 내용을 입력하세요'/>
            `
            const editDetail = document.querySelector('#edit-detail')
            editDetail.style.width = '100%'
            editDetail.addEventListener('keydown', function(e){
                if(e.key === 'Enter'){
                    fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/prayBucketlist/edit',
                    {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body : JSON.stringify({
                        _id: rightClickList,
                        detail: editDetail.value,
                        lastModifiedAt: new Date()
                    })
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log('글수정하기 :', data)
                        if(data.code == 200){
                            alert('수정되었습니다.')
                            location.reload()
                        }
                    })
                }
            })
    })

    })
   }

   // 우클릭 메뉴가 떠있는 상태에서 다른 곳을 클릭하면 우클릭 메뉴가 사라지게 하기
   document.body.addEventListener('click', function(e){
    e.stopPropagation()
    const rightClickMenu = document.querySelector('.right-click-menu')
    const prayBucketlistList = document.querySelectorAll('.prayBucketlist-List')
    const graceList = document.querySelectorAll('.Prayer-of-thanksList')
    const editDetail = document.querySelector('#edit-detail')

    if(rightClickMenu){
        rightClickMenu.style.display = 'none'
        rightClickMenu.style.top = null
        rightClickMenu.style.left = null
        if(prayBucketlistList){
            prayBucketlistList.forEach(element => {
                element.classList.remove('active')
            })
        }
        if(graceList){
            graceList.forEach(element => {
                element.classList.remove('active')
            })
        }
    }
    // 수정버튼 눌러서 생긴 input창을 제외한 다른 곳을 클릭하면 input창이 사라지게 하기 && 수정창 1개만 열리게해야함
    if(editDetail && e.target.id !== 'edit-detail' && e.target.className !== 'right-click-menu' 
    && e.target.className !== 'right-click-menu-edit' && e.target.className !== 'right-click-menu-delete' ){
        editDetail.parentNode.innerHTML = rightClickNearestTdInnerText 
      }
  })

// 버킷리스트 화면에 뿌려주는 함수
async function showPrayBucketlist(prayBucketlistData){
    console.log(' prayBucketlistData :', prayBucketlistData)
    const prayBucketListTbody = document.querySelector('.prayBucketList-body tbody')
    prayBucketlistData.result?.forEach(element => {
        const prayBucketlistList = document.createElement('tr')
        prayBucketlistList.className = `prayBucketlist-List ${element._id}`
        const currentDate = new Date(element.createdAt); // 해당 시간을 가진 날짜 객체 생성
        const formattedDate = `${currentDate.getFullYear().toString().slice(2,4)}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`;
    
        prayBucketlistList.innerHTML = 
        `
                <td><input type="checkbox" class='complete-checkbox'></td>
                <td>${prayBucketIndex}</td>
                <td>${element.detail}</td>
                <td>${formattedDate}</td>
                <td class='checkedDate'></td>
        `
        prayBucketListTbody.appendChild(prayBucketlistList)
        prayBucketIndex ++
        deleteAndEditPrayBucketlist(prayBucketlistList)
    });
}

document.addEventListener('DOMContentLoaded', getPrayNoteServerData)  // 서버데이터 가져오기

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
 async function addPrayBucketlist(event) {
    console.log('addPrayBucketlist ', prayBucketIndex)
    event.preventDefault()
    const currentTime = Date.now(); // 현재 시간을 밀리초로 얻기
    const currentDate = new Date(currentTime); // 해당 시간을 가진 날짜 객체 생성
    const formattedDate = `${currentDate.getFullYear().toString().slice(2,4)}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`;
    const prayBucketListTbody = document.querySelector('.prayBucketList-body tbody')
    const prayBucketlistInput = document.querySelector('.prayBucketList-input input')
    const prayBucketlist = prayBucketlistInput.value
    const prayBucketlistList = document.createElement('tr')
        
  // 몽고DB에 저장하는 코드 작성
  const saveServer = async(number, detail) => {
    try{
    const response = await fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/prayBucketlist/saveBucket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                number : number,
                detail : detail,
                email: localStorage.getItem('유저이름'),
            })
        })
      const result = await response.json()  
      console.log('기도버킷리스트 등록결과 :', result)
      prayBucketDbId = result.result._id // 몽고DB에 저장된 기도버킷리스트의 아이디를 전역변수에 저장
      return prayBucketDbId
    }
    catch(err){
        console.log('기도버킷리스트 등록오류 :', err)
    }
}
    await saveServer(prayBucketIndex, prayBucketlist) // 서버에 저장하는 함수
       
    prayBucketlistList.className = `prayBucketlist-List ${prayBucketDbId}` 
    prayBucketlistList.innerHTML = 
    `
            <td><input type="checkbox" class='complete-checkbox'></td>
            <td>${prayBucketIndex}</td>
            <td>${prayBucketlist}</td>
            <td>${formattedDate}</td>
            <td class='checkedDate'></td>
    `


    prayBucketListTbody.appendChild(prayBucketlistList)
    prayBucketlistInput.value = ''

    prayBucketIndex ++ 
    deleteAndEditPrayBucketlist(prayBucketlistList)
  }
    
// PrayBuckelist checkbox 클릭시 체크당시 날짜 출력
function handleCheckboxChange(e) {
    if (e.target.className === 'complete-checkbox') {
        const currentTime = Date.now();
        const currentDate = new Date(currentTime);
        const formattedDate = `${currentDate.getFullYear().toString().slice(2, 4)}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`;

        if (e.target.checked) {
            let getCheckedTime = formattedDate;
            e.target.closest('tr').querySelector('.checkedDate').innerText = getCheckedTime;

            const clickedDataDbId = e.target.closest('tr').className.split(' ')[1];
            const updatedCheckedDate = async () => {
                const response = await fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/prayBucketlist/checked', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        _id: clickedDataDbId,
                        isDone: true,
                        finishedAt: Date.now()
                    })
                });
                const result = await response.json();
                console.log('체크박스클릭 :', result);
            };
            updatedCheckedDate();
        } else {
            e.target.closest('tr').querySelector('.checkedDate').innerText = '';

            const clickedDataDbId = e.target.closest('tr').className.split(' ')[1];
            const updatedUnCheckedDate = async () => {
                const response = await fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/prayBucketlist/checked', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        _id: clickedDataDbId,
                        isDone: false,
                        finishedAt: null
                    })
                });
                const result = await response.json();
                console.log('체크박스해제 :', result);
            };
            updatedUnCheckedDate();
        }
    }
}

document.body.removeEventListener('click', handleCheckboxChange);
document.body.addEventListener('click', handleCheckboxChange);



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
let graceIndex = 1
let graceDbId = null

// 감사기도 가져오기
async function getGrace(){
    try {
        const reponse = await fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/grace/getGrace', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: localStorage.getItem('유저이름')
            })
        })
        const result = await reponse.json()
        console.log('감사기도 조회:', result)
        return result
        } catch (error) {
        console.log('감사기도 조회 실패:', error)
    }
}

// 감사기도 작성하기

async function showGraceList(graceList) {
    const PrayerOfThanksBody = document.querySelector('.Prayer-of-thanks-body tbody')
    graceList.result?.forEach(element => {
        const PrayerOfThanksList = document.createElement('tr')
        PrayerOfThanksList.className = `Prayer-of-thanksList ${element._id}`
        const currentDate = new Date(element.createdAt); // 해당 시간을 가진 날짜 객체 생성
        const formattedDate = `${currentDate.getFullYear().toString().slice(2,4)}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`;
    
        PrayerOfThanksList.innerHTML = 
        `
                <td>${graceIndex}</td>
                <td>${element.detail}</td>
                <td>${formattedDate}</td>
        `
        PrayerOfThanksBody.appendChild(PrayerOfThanksList)
        graceIndex ++
        deleteAndEditGraceList(PrayerOfThanksList)
    });
}


// 마우스 우클릭해서 기능 (수정, 삭제) 추가하기
const deleteAndEditGraceList = (PrayerOfThanksList) => {
    PrayerOfThanksList.addEventListener('contextmenu', function(e){
        // 마우스 우클릭 시 클릭된 곳 색깔 입히기
        const rightClickeActive = e.target.parentNode.classList.add('active')
        const PrayerOfThanksList = document.querySelectorAll('.Prayer-of-thanksList')
        // 기존에 active 클래스가 있으면 삭제하고 새로운 active 클래스 추가하기
        PrayerOfThanksList.forEach((element => {
            if(element.classList.contains('active')){
                element.classList.remove('active')
                e.currentTarget.classList.add('active')    
         } 
        }))
        // 마우스 우클릭시 기존에 열려있던 input 수정창 사라지게 하기
        const editDetail = document.querySelector('#edit-detail')
        if(editDetail) editDetail.parentNode.innerHTML = rightClickNearestTdInnerText

        const rightClickList = e.target.parentNode.className.split(' ')[1]
        console.log('rightClickList :', rightClickList)
        const rightClickNearestTd = e.target
         rightClickNearestTdInnerText = e.target.innerText
        console.log('e.target.parent :', e.target.parentNode.className.split(' ')[1])
        console.log('rightClickNearestTdInnerText :', rightClickNearestTdInnerText)
        e.preventDefault()
        const rightClickMenu = document.querySelector('.right-click-menu')
        rightClickMenu.innerHTML = `
        <div class='right-click-menu-edit'>수정</div>
        <div class='right-click-menu-delete'>삭제</div>
        `
        document.body.appendChild(rightClickMenu)

        rightClickMenu.style.top = `${e.clientY}px`
        rightClickMenu.style.left = `${e.clientX}px`
        rightClickMenu.style.display = 'flex'
    
        const rightClickMenuEdit = document.querySelector('.right-click-menu-edit')
        const rightClickMenuDelete = document.querySelector('.right-click-menu-delete')
        rightClickMenuEdit.style='cursor:pointer'
        rightClickMenuDelete.style='cursor:pointer'
        // 삭제하기
        rightClickMenuDelete.addEventListener('click', function(e){
            console.log('rightClickList :', rightClickList)
            fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/grace/',
            {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                _id: rightClickList
            })
            })
            .then(res => res.json())
            .then(data => {
                console.log('data :', data)
                if(data.code == 200){
                    alert('삭제되었습니다.')
                    location.reload()
                }
            })
        })

        // 수정하기
        rightClickMenuEdit.addEventListener('click', function(e){
            rightClickNearestTd.innerHTML = `
            <input id='edit-detail' type='text' placeholder ='수정할 내용을 입력하세요'/>
            `
            const editDetail = document.querySelector('#edit-detail')
            editDetail.style.width = '100%'
            editDetail.addEventListener('keydown', function(e){
                if(e.key === 'Enter'){
                    fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/grace/edit',
                    {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body : JSON.stringify({
                        _id: rightClickList,
                        detail: editDetail.value,
                        lastModifiedAt: new Date()
                    })
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log('글수정하기 :', data)
                        if(data.code == 200){
                            alert('수정되었습니다.')
                            location.reload()
                        }
                    })
                }
            })
    })

    })
   }


   // PrayerOfThanksList 작업
const PrayerOfThanksListForm = document.querySelector('.Prayer-of-thanks-input form')
PrayerOfThanksListForm.addEventListener('submit', addGraceList)

// PrayerOfThanksList 추가
 async function addGraceList(event) {
    console.log('addGraceList ', graceIndex)
    event.preventDefault()
    const currentTime = Date.now(); // 현재 시간을 밀리초로 얻기
    const currentDate = new Date(currentTime); // 해당 시간을 가진 날짜 객체 생성
    const formattedDate = `${currentDate.getFullYear().toString().slice(2,4)}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`;
    const graceListTbody = document.querySelector('.Prayer-of-thanks-body tbody')
    const graceListInput = document.querySelector('.Prayer-of-thanks-input input')
    const graceList = graceListInput.value
    const graceListList = document.createElement('tr')
        
  // 몽고DB에 저장하는 코드 작성
  const saveServer = async(number, detail) => {
    try{
    const response = await fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/grace/saveGrace', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                number : number,
                detail : detail,
                email: localStorage.getItem('유저이름'),
            })
        })
      const result = await response.json()  
      console.log('감사기도 등록결과 :', result)
      graceDbId = result.result._id // 몽고DB에 저장된 감사기도의 아이디를 전역변수에 저장
      return graceDbId
    }
    catch(err){
        console.log('감사기도 등록오류 :', err)
    }
}
    await saveServer(graceIndex, graceList) // 서버에 저장하는 함수
       
    graceListList.className = `Prayer-of-thanksList ${graceDbId}` 
    graceListList.innerHTML = 
    `
            <td>${graceIndex}</td>
            <td>${graceList}</td>
            <td>${formattedDate}</td>
    `


    graceListTbody.appendChild(graceListList)
    graceListInput.value = ''

    graceIndex ++ 
    deleteAndEditGraceList(graceListList)
  }


  /////////////////////////////////////////////////
  
  // 기도일기 변수
  const prayDiaryTitle = document.querySelector('#prayDiary-title')
  const prayDiaryContent = document.querySelector('#prayDiary-content')
  const prayDiarySaveBtn = document.querySelector('.btn btn-outline save')
  const prayDiaryCancelBtn = document.querySelector('.btn btn-outline cancel')

  // 기도일기 작성
  const savePrayDiary = async() => {
        const saveDiary = await fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/prayDiary/saveDiary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title : prayDiaryTitle.value,
            content : prayDiaryContent.value,
            email: localStorage.getItem('유저이름')
        })
    })
    const result = await saveDiary.json()
    console.log('기도일기 저장결과 :', result)
}
 document.body.addEventListener('click', function(e){
    if(prayDiarySaveBtn && e.target.className == 'btn btn-outline save'){
        savePrayDiary()
    }
 })

// 기도일기 취소
const cancelPrayDiary = () => {
    const userResponse = confirm('작성중인 내용이 있습니다. 정말 취소하시겠습니까?')
    if(userResponse){
        prayDiaryTitle.value = ''
        prayDiaryContent.value = ''
    } else return
}
document.body.addEventListener('click', function(e){
    console.log(prayDiaryCancelBtn)
    if(prayDiaryCancelBtn && e.target.className == 'btn btn-outline cancel'){
        cancelPrayDiary()
    }
})

// 저장된 기도일기 서버에서 가져오기
const getPrayDiary = async() => {
    const response = await fetch('https://port-0-bible-server-32updzt2alphmfpdy.sel5.cloudtype.app/api/prayDiary/getDiary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: localStorage.getItem('유저이름')
        })
    })
    const result = await response.json()
    console.log('기도일기 조회결과 :', result)
}

// 서버에서 가져온 기도일기 output 화면에 보여주기
const showPrayDiary = async(prayDiaryList) => {
  const prayDiaryOutputBodyTbody = document.querySelector('.prayDiary-output-body tbody')
  prayDiaryList.result?.forEach(element => {
    const prayDiaryTr = document.createElement('tr')
    prayDiaryTr.className = `prayDiary-List ${element._id}`
    const prayDiaryList = element.content 
    const currentTime = Date.now(); // 현재 시간을 밀리초로 얻기
    const currentDate = new Date(currentTime); // 해당 시간을 가진 날짜 객체 생성
    const formattedDate = `${currentDate.getFullYear().toString().slice(2,4)}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`;
  
    prayDiaryTr.innerHTML = `
          <td>${formattedDate}</td>
          <td>${prayDiaryList}</td>
      `
})
prayDiaryOutputBodyTbody.appendChild(prayDiaryList)
}