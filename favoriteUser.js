const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/"
const users = JSON.parse(localStorage.getItem('favoriteUser'))
// 資料內容格式是陣列

const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
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
            <button class="btn btn-danger btn-remove-favorite" data-id = "${item.id}">x</button>
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

function removeFromFavorite(id) {

  const personIndex = users.findIndex((person) => person.id === id)
  users.splice(personIndex, 1)
  localStorage.setItem("favoriteUser", JSON.stringify(users))
  userList(users)
}
//
dataPanel.addEventListener("click", function onPanelChecked(event) {
  if (event.target.matches(".btn-show-info")) {
    showModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})



userList(users)