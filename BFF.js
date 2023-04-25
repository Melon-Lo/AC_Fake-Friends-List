const BASE_URL = "https://user-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/users/"

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const friends = JSON.parse(localStorage.getItem('BFFs')) || []

const FRIENDS_PER_PAGE = 8

function getFriendsByPage(page) {
  const startIndex = (page - 1) * FRIENDS_PER_PAGE
  return friends.slice(startIndex, startIndex + FRIENDS_PER_PAGE)
}

function renderFriendsList(data) {
  let rawHTML = "";

  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-3">
        <div class="mb-2">
          <div class="card m-1" style="width: 10rem;">
            <div class="d-flex justify-content-evenly">${item.name} ${item.surname}</div>
            <div class="card-img">
              <img src="${item.avatar}" class="w-100 p-1 rounded">
            </div>
            <div class="gender-age d-flex justify-content-evenly">
              <span id="gender">${item.gender}</span>
              <span id="age">${item.age}</span>
            </div>
            <div class="card-footer d-flex justify-content-evenly">
              <button class="btn btn-primary btn-more" data-bs-toggle="modal" data-bs-target="#person-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-delete" data-id="${item.id}">Out</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / FRIENDS_PER_PAGE)

  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

function showFriendModal(id) {
  const modalTitle = document.querySelector("#modal-title");
  const modalAvatar = document.querySelector("#modal-person-img");
  const modalGender = document.querySelector("#modal-gender");
  const modalAge = document.querySelector("#modal-age");
  const modalBirthday = document.querySelector("#modal-birthday");
  const modalRegion = document.querySelector("#modal-region");
  const modalEmail = document.querySelector("#modal-email");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data;
    modalTitle.innerText = `${data.name} ${data.surname}`;
    modalAvatar.innerHTML = `<img src="${data.avatar}">`;
    modalGender.innerText = `Gender: ${data.gender}`;
    modalAge.innerText = `Age: ${data.age}`;
    modalBirthday.innerText = `Birthday: ${data.birthday}`;
    modalRegion.innerText = `Region: ${data.region}`;
    modalEmail.innerText = `Email: ${data.email}`;
  });
}

function removeFromBFF(id) {
  if (!friends || !friends.length) return

  const friendIndex = friends.findIndex((friend) => friend.id === id)

  if (friendIndex === -1) return

  friends.splice(friendIndex, 1)

  alert(`他退回普通朋友了！`)

  localStorage.setItem('BFFs', JSON.stringify(friends))
  renderFriendsList(friends)
  renderPaginator(friends.length)
}

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {

  let filteredFriends = []

  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  for (const friend of friends) {
    if (friend.name.toLowerCase().includes(keyword)) {
      filteredFriends.push(friend)
    }
  }

  if (filteredFriends.length === 0) {
    return alert(`沒有包含關鍵字${keyword}的朋友哦!!`)
  }

  renderPaginator(filteredFriends.length)
  renderFriendsList(filteredFriends)
})

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches('.btn-more')) {
    showFriendModal(Number(event.target.dataset.id));
  } if (event.target.matches('.btn-delete')) {
    removeFromBFF(Number(event.target.dataset.id))
    renderFriendsList(getFriendsByPage(1))
    renderPaginator(friends.length)
  }
});

paginator.addEventListener('click', function onPaginatorClicked(event) {

  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  renderFriendsList(getFriendsByPage(page))
  renderPaginator(friends.length)
})

renderFriendsList(getFriendsByPage(1))
renderPaginator(friends.length)