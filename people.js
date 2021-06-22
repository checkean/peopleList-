const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/"
const users = []
let filteredUsers = []
const USERS_PER_PAGE = 16
// 資料內容格式是陣列

const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
// 加入到dataPanel中的HTML結構
function userList(data) {
  let rawHTML = ""
  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-3">
        <div class = "mb-2">
            <img src="${item.avatar}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <button type="button" class="btn btn-primary btn-show-info" data-toggle="modal"
                    data-target="#user-Modal" data-id = "${item.id}">
                    More</button>
            <button class="btn btn-info btn-add-favorite" data-id = "${item.id}">+</button>
            </div>
        </div>
    </div>
        `
  })
  dataPanel.innerHTML = rawHTML
}


// 產生Modal 的內容函式，
function showModal(id) {
  const modalTitle = document.querySelector("#user-modal-title")
  const modalAvatar = document.querySelector("#user-modal-avatar")
  const modalEmail = document.querySelector("#user-modal-email")
  const modalAge = document.querySelector("#user-modal-age")
  const modalGender = document.querySelector("#user-modal-gender")
  const modalRegion = document.querySelector("#user-modal-region")
  const modalDate = document.querySelector("#user-modal-date")
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data
    modalTitle.innerText = `${data.name}  ${data.surname}`
    modalAvatar.innerHTML = `<img src="${data.avatar}" class="card-img-top" alt="user-avatar">`
    modalEmail.innerHTML = `E-mail： ${data.email}`
    modalGender.innerText = `gender： ${data.gender}`
    modalAge.innerText = `Age： ${data.age}`
    modalRegion.innerText = `region： ${data.region}`
    modalDate.innerText = `birthday： ${data.birthday}`
  })
}
//
function getUsersByPage(page) {
  // array  199
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USERS_PER_PAGE
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}

//收藏清單函式
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteUser")) || []
  const person = users.find((person) => person.id === id)

  if (list.some((person) => person.id === id)) {
    return alert("此用戶已在收藏清單中")
  }

  list.push(person)
  localStorage.setItem("favoriteUser", JSON.stringify(list))
}

//
dataPanel.addEventListener("click", function onPanelChecked(event) {
  if (event.target.matches(".btn-show-info")) {
    showModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

//分頁器
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ''

  for (let page = 0; page < numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page + 1}">${page + 1}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  userList(getUsersByPage(page))
})
//search 監聽事件
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  )
  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字:${keyword} 沒有符合條件的人物資料`)
  }
  renderPaginator(filteredUsers.length)
  userList(getUsersByPage(1))
})

axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results)
    renderPaginator(users.length)
    userList(getUsersByPage(1))
  })
  .catch((error) => {
    console.log(error)
  })
