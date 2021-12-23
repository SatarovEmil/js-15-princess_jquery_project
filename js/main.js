 let API = " http://localhost:8000/movies";
// переменные для инпутов: для добавления фильма
let inpTitle = $('#title');
let inpImg = $('#img');
let inpDesc = $('#desc');
let inpPrice = $('#price');
let addBtn = $('#btn-add');
let list = $('.list'); // блок куда добавляются карточки фильмов 

// search
let searchInp = $('.search-inp'); // достаем инпут для поиска 
let searchVal = ""; // сохраняем значение из инпута для поиска 

let currentPage = 1; // текущая страница
let pageTotalCount = 1; // общее количество страниц
let paginationList = $('.pagination-list'); // блок куда добавляются кнопки с цифрами, для 
// переключения между страницами
let prev = $('.prev'); // кнопка - предыдущая страница
let next = $('.next'); // след - страница
// edit переменные для инпутов: для редактирования фильма
let editTitle = $('#edit-title');
let editImg = $('#edit-img');
let editDecs = $('#edit-desc');
let editPrice = $('#edit-price');
let editBtn = $('#btn-save-edit');
let editFormModal = $('#editFormModal');

render();
//todo Отоброжрание товаров на странице

function render(){
    fetch(`${API}?q=${searchVal}&_limit=2&_page=${currentPage}`)
    .then((res) => res.json())
    .then((data) => {
        // console.log(data);
        list.html('');
        data.forEach((item) => {
let elem = drawMovieCard(item);
list.append(elem);
        });
        drawPaginationButtons();
    });
}

// возвращает верстку карточки для каждого фильма
function drawMovieCard(movie){ 
    return `
    <div class="card col-4 mx-3 mb-3" style="width: 18rem;">
        <img src="${movie.img}" class="card-img-top movie-img" alt="...">
        <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <a href="#" class="card-link">
                <h6 class="card-title">$ ${movie.price}</h6>
            </a>
            <p class="card-text">${movie.desc}</p>
            

            <button data-bs-toggle="modal" data-bs-target="#editFormModal" class="btn btn-info btn-edit" id="${movie.id}">Edit</button>
      <button class="btn btn-danger btn-delete" type="button" id="${movie.id}">Delete</button>
        </div>
    </div>
    `;
}

// todo search функция срабатывает на каждый ввод
searchInp.on('input', () => {
    searchVal = searchInp.val(); // записывает значение поисковика в переменную searchVal
    // console.log(searchVal);
    render(); // новая перерисовка страницы 
});

// todo pagination 
function drawPaginationButtons() {
    fetch(`${API}?q=${searchVal}`) // запрос на сервер чтобы узнать общее количество продуктов
      .then((res) => res.json())
      .then((data) => {
        pageTotalCount = Math.ceil(data.length / 2); //общее количество продуктов делим на кол-во продуктов которые отображаются на одной странице
        //pageTotalCount = кол-во страниц
        paginationList.html("");
        for (let i = 1; i <= pageTotalCount; i++) {
          // создаем кнопки с цифрами
          if (currentPage == i) {
            // сравниваем текущую страницу с цифрой из кнопки. Если они совпадают, то нужно закрасить эту кнопку, обозначая на какой странице мы находимся
            paginationList.append(` 
              <li class="page-item active">
                  <a class="page-link page_number" href="#">${i}</a>
              </li>
          `);
          } else {
            paginationList.append(` 
                  <li class="page-item">
                      <a class="page-link page_number" href="#">${i}</a>
                  </li>
              `);
          }
        }
      });
  }
// кнопка переключения на пред. страницу
prev.on('click', () => {
    if(currentPage <= 1) {
        return;
    }
    currentPage--
    render()
})
//кнопка переключения на след. страницу
next.on('click', () => {
    if(currentPage >= pageTotalCount) {
        return;
    }
    currentPage++
    render()
});
// кнопка переключения на определенную страницу
$('body').on('click', '.page_number', function(){
    // console.log(this);
    console.log(this.innerText);
    currentPage = this.innerText; // обозначаем предыдущую страницу цифрой из кнопки
    render();
});

//todo EDIT
// открываем модалку и делаем запрос, для того чтобы достать именно этот фильм. и заполняем поля
// в модалке для редактирования 
$('body').on('click', '.btn-edit', function () {
    // console.log(this);
    fetch(`${API}/${this.id}`)
    .then((res) => res.json())
    .then((data) => {
        // console.log(data)
       editTitle.val(data.title) // заполняем поля данными
       editImg.val(data.img)
       editDecs.val(data.desc)
       editPrice.val(data.price)
       editBtn.attr('id', data.id)// записываем id movie к кнопке сохранения
    });
}); 

// todo сохранить изменения товара
// кнопка из модалки, для сохранения изменений
// кнопка сохрнаить в модалке 
editBtn.on('click', function (){
    let id = this.id // вытаскиваем из кнопки id и ложим его в переменную 

    let title = editTitle.val() // сохраняем значение инпута из модалки в переменные
    let desc = editDecs.val() //
    let img = editImg.val()
    let price = editPrice.val()
    
    if(!title || !desc || !img || !price) return // проверяем на заполненность и пустоту полей

    let editedMovie = { // формируем новый объект, из новых данных, чтобы отправить на сервер 
        title : title, 
        desc: desc,
        img: img,
        price: price
        
    };
    saveEdit(editedMovie, id); // вызываем функцию для сохранения данных и передаем ей этот новый объект и id
});

// функция для сохранения
function saveEdit(editedMovie, id){
    fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(editedMovie)
    }).then(() => {
        render()
        $('#editFormModal').modal("hide");
    })
}
function drawCard(item) {
    return `
          <div id="products-list" class="d-flex flex-wrap justify-content-center mt-5">
              <div class="card" style="width: 18rem;">
                  <div class="card-body">
                      <h5 class="card-title">${item.title}</h5>
                      <a href="#" class="card-link">
                          <h6>$ ${item.price}</h6>
                      </a>
                      <p class="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                      <button id=${item.id} data-bs-toggle="modal" data-bs-target="#exampleModal" type="button" class="btn btn-info btn-edit">Edit</button>
                      <button id=${item.id} type="button" class="btn btn-danger btn-del">Delete</button>
                  </div>
              </div>
          </div>
      `;
  }


$('body').on('click','.btn-del',
function (){
    console.log(this);
    fetch(`${API}/${this.id}`, {
        method: "DELETE",
    }).then(() => render())
    
});


// todo POST NEW MOVIE

addBtn.on('click', function(){
    let title = inpTitle.val()
    let img = inpImg.val()
    let desc = inpDesc.val()
    let price = inpPrice.val()

    if(!title || !desc || !img || !price) return;

    let newMovie = {
        title,
        img,
        desc,
        price
    };
    postMovie(newMovie);
});

function postMovie(newMovie){
    fetch(API, {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(newMovie)
    }).then(() => {
        render()
        $('#addFormModal').modal('hide');
    });
}

// todo DELETE
$('body').on('click', '.btn-delete', function(){
    fetch(`${API}/${this.id}`, {
        method: 'DELETE',
    }).then(() =>{
        render()
    });
});
