let prayBucketIndex = 1
let prayBucketDbId = null
let rightClickNearestTdInnerText
let currentScreen = ''; // 전역 변수를 사용하여 현재 화면 추적


// 헤더 모듈 가져오기
function checkIsLogined() {
    {
        const isLoggedIn = localStorage.getItem('로그인상태')
        console.log('로그인상태 :', isLoggedIn)
        document.body.insertAdjacentElement('afterbegin', headerModule(isLoggedIn))
    }
}
document.addEventListener('DOMContentLoaded', checkIsLogined)

// new Date => YY/MM/DD 형식으로 바꾸기
const transformDate = (date) => {
    const currentDate = new Date(date); // 해당 시간을 가진 날짜 객체 생성
    const formattedDate = `${currentDate.getFullYear().toString().slice(2, 4)}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`;
    return formattedDate
}

// 버킷리스트 초기DOM 렌더링
const createPrayBucketlist = () => {
    const prayWrapper = document.querySelector('.pray-wrapper')
    prayWrapper.innerHTML = `
        <div class="prayBucketList">
        <div class="prayBucketList-body">
        <table>
            <thead>
            <tr>
                <td>응답</td>
                <td>순번</td>
                <td>내용</td>
                <td>기도일자</td>
                <td>응답일자</td>
            </tr>
            </thead>
            <tbody></tbody>
        </table>
        <div class="right-click-menu"></div>
        </div>
        <div class="prayBucketList-input">
        <form>
            <input type="text" placeholder="기도 버킷리스트를 입력하세요, 마우스 우클릭을 통해 수정하거나 삭제할 수 있어요" />
        </form>
        </div>
        `
}

// 첫화면 버킷리스트 서버 데이터 가져오기
async function getPrayNoteServerData() {
    const reponses = await getPrayBucketlist()
    const prayBucketlistData = reponses
    showPrayBucketlist(prayBucketlistData)
}

// PrayBucketlist 서버 데이터 가져오는 함수
async function getPrayBucketlist() {
    try {
        const data = await fetch('http://127.0.0.1:3300/api/prayBucketlist/getBucket',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: localStorage.getItem('유저이름')
                })
            }

        )
        const prayBucketlistData = await data.json()
        return prayBucketlistData
    } catch (error) {
        console.log('기도버킷리스트 로딩 실패 :', error)
    }
}
// 마우스 우클릭해서 기능 (수정, 삭제) 추가하기
const deleteAndEditPrayBucketlist = (prayBucketlistList) => {
    prayBucketlistList.addEventListener('contextmenu', function (e) {
        // 마우스 우클릭 시 클릭된 곳 색깔 입히기
        const rightClickeActive = e.target.parentNode.classList.add('active')
        const prayBucketlistList = document.querySelectorAll('.prayBucketlist-List')
        // 기존에 active 클래스가 있으면 삭제하고 새로운 active 클래스 추가하기
        prayBucketlistList.forEach((element => {
            if (element.classList.contains('active')) {
                element.classList.remove('active')
                e.currentTarget.classList.add('active')
            }
        }))
        // 마우스 우클릭시 기존에 열려있던 input 수정창 사라지게 하기
        const editDetail = document.querySelector('#edit-detail')
        if (editDetail) editDetail.parentNode.innerHTML = rightClickNearestTdInnerText

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

        rightClickMenu.style.top = `${e.clientY + scrollY}px`
        rightClickMenu.style.left = `${e.clientX + scrollY}px`
        rightClickMenu.style.display = 'flex'

        const rightClickMenuEdit = document.querySelector('.right-click-menu-edit')
        const rightClickMenuDelete = document.querySelector('.right-click-menu-delete')
        rightClickMenuEdit.style.cursor = 'pointer'
        rightClickMenuDelete.style.cursor = 'pointer'
        // 삭제하기
        rightClickMenuDelete.addEventListener('click', function (e) {
            if (confirm('정말 삭제하시겠습니까?') === false) return
            else {
                fetch('http://127.0.0.1:3300/api/prayBucketlist/',
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            _id: rightClickList
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log('data :', data)
                        if (data.code == 200) {
                            rightClickNearestTd.parentNode.remove()
                        }
                    })
            }
        })

        // 수정하기
        rightClickMenuEdit.addEventListener('click', function (e) {
            rightClickNearestTd.innerHTML = `
            <input id='edit-detail' type='text' value ='${rightClickNearestTdInnerText}'/> 
            `
            const editDetail = document.querySelector('#edit-detail')
            editDetail.style.width = '100%'
            editDetail.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    fetch('http://127.0.0.1:3300/api/prayBucketlist/edit',
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                _id: rightClickList,
                                detail: editDetail.value,
                                lastModifiedAt: new Date()
                            })
                        })
                        .then(res => res.json())
                        .then(data => {
                            console.log('글수정하기 :', data)
                            if (data.code == 200) {
                                rightClickNearestTd.innerText = editDetail.value;
                            }
                        })
                }
            })
        })
    })
}



// 우클릭 메뉴가 떠있는 상태에서 다른 곳을 클릭하면 우클릭 메뉴가 사라지게 하기
const hideRightClickMenu = (e) => {
    e.stopPropagation()
    const rightClickMenu = document.querySelector('.right-click-menu')
    const prayBucketlistList = document.querySelectorAll('.prayBucketlist-List')
    const graceList = document.querySelectorAll('.Prayer-of-thanksList')
    const prayDiaryList = document.querySelectorAll('.prayDiary-List')
    const editDetail = document.querySelector('#edit-detail')

    if (rightClickMenu) {
        rightClickMenu.style.display = 'none'
        rightClickMenu.style.top = null
        rightClickMenu.style.left = null
        if (prayBucketlistList) {
            prayBucketlistList.forEach(element => {
                element.classList.remove('active')
            })
        }
        if (graceList) {
            graceList.forEach(element => {
                element.classList.remove('active')
            })
        }
        if (prayDiaryList) {
            prayDiaryList.forEach(element => {
                element.classList.remove('active')
            })
        }
    }
    // 수정버튼 눌러서 생긴 input창을 제외한 다른 곳을 클릭하면 input창이 사라지게 하기 && 수정창 1개만 열리게해야함
    if (editDetail && e.target.id !== 'edit-detail' && e.target.className !== 'right-click-menu'
        && e.target.className !== 'right-click-menu-edit' && e.target.className !== 'right-click-menu-delete') {
        editDetail.parentNode.innerHTML = rightClickNearestTdInnerText
    }
}

document.body.addEventListener('click', hideRightClickMenu)

// 버킷리스트 화면에 뿌려주는 함수
async function showPrayBucketlist(prayBucketlistData) {
    createPrayBucketlist()
    submitPrayBucketlist()
    console.log(' prayBucketlistData :', prayBucketlistData)
    const prayBucketListTbody = document.querySelector('.prayBucketList-body tbody')
    prayBucketlistData.result?.forEach(element => {
        const prayBucketlistList = document.createElement('tr')
        prayBucketlistList.className = `prayBucketlist-List ${element._id}`
        prayBucketlistList.innerHTML =
            `
                <td><input type="checkbox" class='complete-checkbox'></td>
                <td>${prayBucketIndex}</td>
                <td>${element.detail}</td>
                <td>${transformDate(element.createdAt)}</td>
                <td class='checkedDate'>${element.finishedAt !==null ? transformDate(element.finishedAt) : ''}</td>
        `
        prayBucketListTbody.appendChild(prayBucketlistList)
        if (element.isDone) prayBucketlistList.querySelector('.complete-checkbox').checked = true
        prayBucketIndex++
        deleteAndEditPrayBucketlist(prayBucketlistList)
    });
}

document.addEventListener('DOMContentLoaded', getPrayNoteServerData)  // 서버데이터 가져오기


// PrayBucketList 작업
const submitPrayBucketlist = () => {
    const prayBucketlistForm = document.querySelector('.prayBucketList-input form')
    prayBucketlistForm.addEventListener('submit', addPrayBucketlist)
}

// PrayBucketList 추가
async function addPrayBucketlist(event) {
    console.log('addPrayBucketlist ', prayBucketIndex)
    event.preventDefault()
    const currentTime = Date.now(); // 현재 시간을 밀리초로 얻기
    const prayBucketListTbody = document.querySelector('.prayBucketList-body tbody')
    const prayBucketlistInput = document.querySelector('.prayBucketList-input input')
    const prayBucketlist = prayBucketlistInput.value
    const prayBucketlistList = document.createElement('tr')

    // 몽고DB에 저장하는 코드 작성
    const saveServer = async (number, detail) => {
        try {
            const response = await fetch('http://127.0.0.1:3300/api/prayBucketlist/saveBucket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    number: number,
                    detail: detail,
                    email: localStorage.getItem('유저이름'),
                    finishedAt: ''
                    ,
                })
            })
            const result = await response.json()
            console.log('기도버킷리스트 등록결과 :', result)
            prayBucketDbId = result.result._id // 몽고DB에 저장된 기도버킷리스트의 아이디를 전역변수에 저장
            return prayBucketDbId
        }
        catch (err) {
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
            <td>${transformDate(currentTime)}</td>
            <td class='checkedDate'></td>
    `


    prayBucketListTbody.appendChild(prayBucketlistList)
    prayBucketlistInput.value = ''

    prayBucketIndex++
    deleteAndEditPrayBucketlist(prayBucketlistList)
}

// PrayBuckelist checkbox 클릭시 체크당시 날짜 출력
function handleCheckboxChange(e) {
    if (e.target.className === 'complete-checkbox') {
        const currentTime = Date.now();
        if (e.target.checked) {
            let getCheckedTime = transformDate(currentTime);
            e.target.closest('tr').querySelector('.checkedDate').innerText = getCheckedTime;

            const clickedDataDbId = e.target.closest('tr').className.split(' ')[1];
            const updatedCheckedDate = async () => {
                const response = await fetch('http://127.0.0.1:3300/api/prayBucketlist/checked', {
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
            confirm('체크박스를 해제하시겠습니까?') === false ? e.target.checked = true :
                e.target.closest('tr').querySelector('.checkedDate').innerText = '';

            const clickedDataDbId = e.target.closest('tr').className.split(' ')[1];
            const updatedUnCheckedDate = async () => {
                const response = await fetch('http://127.0.0.1:3300/api/prayBucketlist/checked', {
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




//  감사기도 초기DOM 렌더링
const createPrayerOfThanks = () => {
    const prayWrapper = document.querySelector('.pray-wrapper')
    prayWrapper.innerHTML = `
    <div class="Prayer-of-thanks">
      <div class="Prayer-of-thanks-body">
        <table>
          <thead>
            <tr>
              <td>순번</td>
              <td>내용</td>
              <td>일자</td>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      <div class="right-click-menu"></div>
      <div class="Prayer-of-thanks-input">
        <form>
          <input type="text" placeholder="감사한 일을 기억해보세요, 마우스 우클릭을 통해 수정하거나 삭제할 수 있어요" />
        </form>
      </div>
    </div>
        `
}

let graceIndex = 1
let graceDbId = null

// 감사기도 가져오기
async function getGrace() {
    try {
        const reponse = await fetch('http://127.0.0.1:3300/api/grace/getGrace', {
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
    createPrayerOfThanks()
    submitGraceList()
    const PrayerOfThanksBody = document.querySelector('.Prayer-of-thanks-body tbody')
    graceList.result?.forEach(element => {
        const PrayerOfThanksList = document.createElement('tr')
        PrayerOfThanksList.className = `Prayer-of-thanksList ${element._id}`
        PrayerOfThanksList.innerHTML =
            `
                <td>${graceIndex}</td>
                <td>${element.detail}</td>
                <td>${transformDate(element.createdAt)}</td>
        `
        PrayerOfThanksBody.appendChild(PrayerOfThanksList)
        graceIndex++
        deleteAndEditGraceList(PrayerOfThanksList)
    });
}


// 마우스 우클릭해서 기능 (수정, 삭제) 추가하기
const deleteAndEditGraceList = (PrayerOfThanksList) => {
    PrayerOfThanksList.addEventListener('contextmenu', function (e) {
        // 마우스 우클릭 시 클릭된 곳 색깔 입히기
        const rightClickeActive = e.target.parentNode.classList.add('active')
        const PrayerOfThanksList = document.querySelectorAll('.Prayer-of-thanksList')
        // 기존에 active 클래스가 있으면 삭제하고 새로운 active 클래스 추가하기
        PrayerOfThanksList.forEach((element => {
            if (element.classList.contains('active')) {
                element.classList.remove('active')
                e.currentTarget.classList.add('active')
            }
        }))
        // 마우스 우클릭시 기존에 열려있던 input 수정창 사라지게 하기
        const editDetail = document.querySelector('#edit-detail')
        if (editDetail) editDetail.parentNode.innerHTML = rightClickNearestTdInnerText

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

        rightClickMenu.style.top = `${e.clientY + scrollY}px`
        rightClickMenu.style.left = `${e.clientX + scrollX}px`
        rightClickMenu.style.display = 'flex'

        const rightClickMenuEdit = document.querySelector('.right-click-menu-edit')
        const rightClickMenuDelete = document.querySelector('.right-click-menu-delete')
        rightClickMenuEdit.style = 'cursor:pointer'
        rightClickMenuDelete.style = 'cursor:pointer'
        // 삭제하기
        rightClickMenuDelete.addEventListener('click', function (e) {
            if(confirm('정말 삭제하시겠습니까?') === false) return
            else{
                fetch('http://127.0.0.1:3300/api/grace/',
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        _id: rightClickList
                    })
                })
                .then(res => res.json())
                .then(data => {
                    console.log('data :', data)
                    if (data.code == 200) {
                        rightClickNearestTd.parentNode.remove()
                    }
                })
            }
        })

        // 수정하기
        rightClickMenuEdit.addEventListener('click', function (e) {
            rightClickNearestTd.innerHTML = `
            <input id='edit-detail' type='text' value ='${rightClickNearestTdInnerText}'/>
            `
            const editDetail = document.querySelector('#edit-detail')
            editDetail.style.width = '100%'
            editDetail.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    fetch('http://127.0.0.1:3300/api/grace/edit',
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                _id: rightClickList,
                                detail: editDetail.value,
                                lastModifiedAt: new Date()
                            })
                        })
                        .then(res => res.json())
                        .then(data => {
                            console.log('글수정하기 :', data)
                            if (data.code == 200) {
                                rightClickNearestTd.innerText = editDetail.value;
                            }
                        })
                }
            })
        })

    })
}




const submitGraceList = () => {
    const PrayerOfThanksListForm = document.querySelector('.Prayer-of-thanks-input form')
    PrayerOfThanksListForm.addEventListener('submit', addGraceList)
}

// PrayerOfThanksList 추가
async function addGraceList(event) {
    console.log('addGraceList ', graceIndex)
    event.preventDefault()
    const currentTime = Date.now(); // 현재 시간을 밀리초로 얻기
    const graceListTbody = document.querySelector('.Prayer-of-thanks-body tbody')
    const graceListInput = document.querySelector('.Prayer-of-thanks-input input')
    const graceList = graceListInput.value
    const graceListList = document.createElement('tr')

    // 몽고DB에 저장하는 코드 작성
    const saveServer = async (number, detail) => {
        try {
            const response = await fetch('http://127.0.0.1:3300/api/grace/saveGrace', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    number: number,
                    detail: detail,
                    email: localStorage.getItem('유저이름'),
                })
            })
            const result = await response.json()
            console.log('감사기도 등록결과 :', result)
            graceDbId = result.result._id // 몽고DB에 저장된 감사기도의 아이디를 전역변수에 저장
            return graceDbId
        }
        catch (err) {
            console.log('감사기도 등록오류 :', err)
        }
    }
    await saveServer(graceIndex, graceList) // 서버에 저장하는 함수

    graceListList.className = `Prayer-of-thanksList ${graceDbId}`
    graceListList.innerHTML =
        `
            <td>${graceIndex}</td>
            <td>${graceList}</td>
            <td>${transformDate(currentTime)}</td>
    `


    graceListTbody.appendChild(graceListList)
    graceListInput.value = ''

    graceIndex++
    deleteAndEditGraceList(graceListList)
}


// 스프링 배경만들기
const createSpringBackground = () => {
    const springBackground = document.createElement('div')
    const springBackgroundImg = document.createElement('img')

    springBackground.className = 'spring-background'
    springBackgroundImg.src = '/asssets/imgs/spring1.png'
    springBackgroundImg.className = 'spring-background-img'
    springBackgroundImg.style.width = '100px'
    springBackgroundImg.style.height = '930px'
    springBackgroundImg.style.position = 'absolute'
    springBackgroundImg.style.top = '15%'
    springBackgroundImg.style.left = '30px'
    springBackgroundImg.style.zIndex = '1'
    springBackgroundImg.style.opacity = '0.5'


    document.body.appendChild(springBackground)
    springBackground.appendChild(springBackgroundImg)
}
createSpringBackground()

// 북마크 만들기
const createBookmark = () => {
    const bookmark1 = document.createElement('div')
    bookmark1.innerHTML = `<h4 class='prayBucketTitle'>버킷리스트</h4>`
    bookmark1.className = 'bookmark1'
    document.body.appendChild(bookmark1)

    const bookmark2 = document.createElement('div')
    bookmark2.innerHTML = `<h4 class='prayOfThanksTitle'>감사기도</h4>`
    bookmark2.className = 'bookmark2'
    document.body.appendChild(bookmark2)

    const bookmark3 = document.createElement('div')
    bookmark3.innerHTML = `<h4 class='prayDiaryTitle'>기도일기</h4>`
    bookmark3.className = 'bookmark3'
    document.body.appendChild(bookmark3)
}
createBookmark()


// 북마크 클릭시
document.body.addEventListener('click', function (e) {
    console.log('e.target.className :', e.target)
    if (e.target.className == 'prayBucketTitle') {   
        currentScreen = 'prayBucketList'
        const prayWrapper = document.querySelector('.pray-wrapper')
        const prayBucketList = document.querySelector('.prayBucketList')
        if(!prayBucketList) {
            prayWrapper.innerHTML = ''
            prayBucketIndex = 1
            createPrayBucketlist()  
            getPrayBucketlist()
            .then(data => {
                showPrayBucketlist(data)
            })
        } 
        console.log('버킷리스트')
    }
    else if (e.target.className == 'prayOfThanksTitle') {
        currentScreen = 'prayOfThanks'
        const prayWrapper = document.querySelector('.pray-wrapper')
        const prayerOfThanks = document.querySelector('.Prayer-of-thanks')
        if(!prayerOfThanks) {
            prayWrapper.innerHTML = ''
            graceIndex = 1
            createPrayBucketlist()  
            getGrace()
            .then(data => {
                showGraceList(data)
            })
        } 
        console.log('감사기도')
        
    }
    else if (e.target.className == 'prayDiaryTitle') {
        currentScreen = 'prayDiary'
        console.log('기도일기')

    }
})
// 페이지 리로드 시 화면 복원
window.addEventListener('load', function() {
    switch(currentScreen) {
        case 'prayBucketList':
            // prayBucketList 화면 복원 로직 추가
            break;
        case 'prayOfThanks':
            // prayerOfThanks 화면 복원 로직 추가
            break;
        case 'prayDiary':
            // prayDiary 화면 복원 로직 추가
            break;
        default:
            break;
    }
});