const stringToHTML = s => {
  const domParser = new DOMParser()
  const doc = domParser.parseFromString(s, 'text/html')
  return doc.body.firstChild
}

// can be used to render the total of books
const booksQuantity = () => {
  const booksCounter = myBookstore.getState().length
  const bookCounterElement = document.getElementById('book-counter')
  bookCounterElement.innerText = 'Cantidad de libros: ' + booksCounter
}

// can be used to render books in the page
const renderBooks = () => {
  const books = myBookstore.getState()
  const booksList = document.getElementById('books-list')
  booksList.innerHTML = ''

  books.forEach(book => {
    const element = stringToHTML(`<li> Titulo: ${book.title} <br> isbn: ${book.isbn}`)
    booksList.appendChild(element)
  })
}

// para popular el store
const initialBooks = [
  {
    title: "The Fellowship of the Ring",
    isbn: 1
  },
  {
    title: "The End of Eternity",
    isbn: 2
  },
  {
    title: "Guards! Guards!",
    isbn: 3
  }
]

const library = (books = initialBooks, action) => {
  switch (action.type) {
    case 'RETURN_BOOK':
      return [...books, action.payload]
    case 'BORROW_BOOK':
      return books.filter(b => b.isbn !== action.payload.isbn)
    default:
      return books
  }
}


// nuestro store va a recibir como parámetro una función que es la que va a modificar los datos
const createStore = updater => {
  // almacenamiento vacio
  let store
  // listeners para saber quienes están esperando los cambios 
  const listeners = []
  
  // metodo para obtener el estado actual de 'store'
  const getState = () => store

  // metodo para actualizar los datos
  // llamará a la funcion updater para actualizar y luego a los listeners para tambien actualizarlos
  const dispatch = action => {
    // pasamos el store actual para actualizarlo
    store = updater(store, action)
    // llamamos a los listeners para que actualicen sus valores
    listeners.forEach((listener) => listener())
  }

  // método para almacenar las funciones que hay que llamar al momento de actualizar los datos
  const suscribe = listener => listeners.push(listener)

  // llamamos a dispatch con una accion vacia para popular la variable 'store'
  dispatch( {} )

  // hacemos uso de closures
  return { getState, dispatch, suscribe }
}

const myBookstore = createStore(library)

myBookstore.suscribe(booksQuantity)
myBookstore.suscribe(renderBooks)
myBookstore.dispatch( {} ) // initialBooks

const bookInfo = action => {
  const bookTitle = document.getElementById('book-title')
  const bookIsbn = document.getElementById('book-isbn')
  const payload = {
    title: bookTitle.value,
    isbn: bookIsbn.value
  }

  myBookstore.dispatch({
    type: action,
    payload
  })
}

window.onload = () => {
  const borrowBookBtn = document.getElementById('borrow-book-btn')
  const returnBookBtn = document.getElementById('return-book-btn')

  borrowBookBtn.addEventListener('click', () => bookInfo('BORROW_BOOK'))
  returnBookBtn.addEventListener('click', () => bookInfo('RETURN_BOOK'))
}
//buttons

