class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UIMethods {
  addBook(book) {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" id='delete'><i class="delete material-icons">delete_forever</i></a></td>
    `;
    document.querySelector("#book-list").appendChild(row);
  }

  showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `center-align white-text ${className}`;
    div.appendChild(document.createTextNode(message));
    document.querySelector("#alert").appendChild(div);
    setTimeout(() => document.querySelector("#alert").removeChild(div), 2500);
  }

  clearInput() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  deleteBook(target) {
    if (target.classList.contains("delete")) {
      target.parentElement.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    const bookList = document.getElementById("book-list");
    while (bookList.firstChild) {
      bookList.removeChild(bookList.firstChild);
    }
  }
}

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static showBooksFromTheLocalStorage() {
    const books = Store.getBooks();
    books.forEach(function (book) {
      const uiMetod = new UIMethods();
      uiMetod.addBook(book);
    });
  }

  static addBookToTheLocalStorage(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeFromTheLocalStorage(isbn) {
    const books = Store.getBooks();
    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

const negative = "col s12 m10 l6 offset-m1 offset-l3 red lighten-2",
  positive = "col s12 m10 l6 offset-m1 offset-l3 teal lighten-1";

document.getElementById("input-form").addEventListener("submit", function (e) {
  const title = document.querySelector("#title").value,
    author = document.querySelector("#author").value,
    isbn = document.querySelector("#isbn").value;

  const book = new Book(title, author, isbn);
  const uiMethod = new UIMethods();

  if (title === "" || author === "" || isbn === "") {
    uiMethod.showAlert("Please fill in all the fields", negative);
  } else {
    uiMethod.addBook(book);
    uiMethod.showAlert("Book successfully added!", positive);
    Store.addBookToTheLocalStorage(book);
    uiMethod.clearInput();
  }

  e.preventDefault();
});

document.getElementById("book-list").addEventListener("click", function (e) {
  const uiMethod = new UIMethods();
  if (e.target.classList.contains("delete")) {
    uiMethod.deleteBook(e.target);
    uiMethod.showAlert("Book deleted!", positive);
    Store.removeFromTheLocalStorage(e.target.parentElement.parentElement.previousElementSibling.textContent);
  }

  e.preventDefault();
});

document.getElementById("clear-btn").addEventListener("click", function () {
  const uiMethod = new UIMethods();
  if (document.getElementById("book-list").hasChildNodes()) {
    uiMethod.clearFields();
    uiMethod.showAlert("Book list is cleared!", positive);
    localStorage.clear();
  } else {
    uiMethod.showAlert("Book list is empty, please add books to the list", negative);
  }
});

document.addEventListener("DOMContentLoaded", Store.showBooksFromTheLocalStorage);
