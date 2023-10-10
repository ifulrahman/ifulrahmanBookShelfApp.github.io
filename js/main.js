const books = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "Bookshelf";
const form = document.getElementById("inputBook");
const inputSearchBook = document.getElementById("searchBookTitle");
const formSearchBook = document.getElementById("searchBook");

inputSearchBook.addEventListener("keyup", (e) => {
   e.preventDefault();
   searchBooks();
});

formSearchBook.addEventListener("submit", (e) => {
   e.preventDefault();
   searchBooks();
});

function isStorageExist() {
   if (typeof Storage === "undefined") {
      swal("Upss", "Maaf, Browser anda tidak mendukung web storage. Silahkan gunakan Browser yang lainnya", "info");
      return false;
   }
   return true;
}

const generateId = () => +new Date();

const generateBookItem = (id, title, author, year, isCompleted) => {
   return {
      id,
      title,
      author,
      year,
      isCompleted,
   };
};

function checkStatusBook() {
   const isCheckComplete = document.getElementById("inputBookIsComplete");
   if (isCheckComplete.checked) {
      return true;
   }
   return false;
}

function addBook() {
   const bookTitle = document.getElementById("inputBookTitle").value;
   const bookAuthor = document.getElementById("inputBookAuthor").value;
   const bookYear = parseInt(document.getElementById("inputBookYear").value);
   const isCompleted = checkStatusBook();

   const id = generateId();
   const newBook = generateBookItem(id, bookTitle, bookAuthor, bookYear, isCompleted);

   books.unshift(newBook);
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();

   swal("Berhasil", "Buku baru berhasil ditambahkan", "success");
}

function findBookIndex(bookId) {
   for (const index in books) {
      if (books[index].id == bookId) {
         return index;
      }
   }
   return null;
}

function removeBook(bookId) {
   const bookTarget = findBookIndex(bookId);
   swal({
      title: "Apakah Anda Yakin?",
      text: "Buku akan dihapus secara permanen, Anda tidak bisa memulihkannya kembali!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
   }).then((willDelete) => {
      if (willDelete) {
         books.splice(bookTarget, 1);
         document.dispatchEvent(new Event(RENDER_EVENT));
         saveData();

         swal("Berhasil", "Satu buku sudah dihapus", "success");
      } else {
         swal("Buku tidak jadi dihapus");
      }
   });
}

function resetRak() {
   swal({
      title: "Apakah Anda Yakin?",
      text: "Semua data buku akan dihapus secara permanen, Anda tidak bisa memulihkannya kembali!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
   }).then((willDelete) => {
      if (willDelete) {
         books.splice(0, books.length);
         document.dispatchEvent(new Event(RENDER_EVENT));
         saveData();

         swal("Berhasil", "Semua buku berhasil dihapus", "success");
      } else {
         swal("Rak batal dikosongkan");
      }
   });
}

function changeBookStatus(bookId) {
   const bookIndex = findBookIndex(bookId);
   for (const index in books) {
      if (index === bookIndex) {
         if (books[index].isCompleted === true) {
            books[index].isCompleted = false;
            swal("Berhasil", "Buku anda sudah dipindahkan ke kategori buku yang belum selesai dibaca", "success");
         } else {
            books[index].isCompleted = true;
            swal("Berhasil", "Buku anda sudah dipindahkan ke kategori buku yang selesai dibaca", "success");
         }
      }
   }

   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

function searchBooks() {
   const inputSearchValue = document.getElementById("searchBookTitle").value.toLowerCase();
   const incompleteBookShelf = document.getElementById("incompleteBookshelfList");
   const completeBookShelf = document.getElementById("completeBookshelfList");
   incompleteBookShelf.innerHTML = "";
   completeBookShelf.innerHTML = "";

   if (inputSearchValue == "") {
      document.dispatchEvent(new Event(RENDER_EVENT));
      return;
   }

   for (const book of books) {
      if (book.title.toLowerCase().includes(inputSearchValue)) {
         if (book.isCompleted == false) {
            let el = `
            <article class="book_item">
               <h3>${book.title}</h3>
               <p>Penulis : ${book.author}</p>
               <p>Tahun Terbit : ${book.year}</p>

               <div class="action">
                  <button class="btn-black" onclick="changeBookStatus(${book.id})">Selesai di Baca</button>
                  <button class="btn-red" onclick="removeBook(${book.id})">Hapus Buku</button>
                  <button class="btn-orange" onclick="editBookData(${book.id})">Edit buku</button>
                  </div>
            </article>
            `;

            incompleteBookShelf.innerHTML += el;
         } else {
            let el = `
            <article class="book_item">
               <h3>${book.title}</h3>
               <p>Penulis : ${book.author}</p>
               <p>Tahun Terbit : ${book.year}</p>

               <div class="action">
                  <button class="btn-black" onclick="changeBookStatus(${book.id})">Belum selesai di Baca</button>
                  <button class="btn-red" onclick="removeBook(${book.id})">Hapus Buku</button>
                  <button class="btn-orange" onclick="editBookData(${book.id})">Edit buku</button>
                  </div>
            </article>
            `;

            completeBookShelf.innerHTML += el;
         }
      }
   }
}

function editBookData(bookId) {
   const sectionEdit = document.querySelector(".input_edit_section");
   sectionEdit.style.display = "flex";
   const editTitle = document.getElementById("inputEditTitle");
   const editAuthor = document.getElementById("inputEditAuthor");
   const editYear = document.getElementById("inputEditYear");
   const formEditData = document.getElementById("editData");
   const cancelEdit = document.getElementById("bookEditCancel");
   const SubmitEdit = document.getElementById("bookEditSubmit");

   bookTarget = findBookIndex(bookId);

   editTitle.setAttribute("value", books[bookTarget].title);
   editAuthor.setAttribute("value", books[bookTarget].author);
   editYear.setAttribute("value", books[bookTarget].year);

   SubmitEdit.addEventListener("click", (e) => {
      books[bookTarget].title = editTitle.value;
      books[bookTarget].author = editAuthor.value;
      books[bookTarget].year = editYear.value;

      document.dispatchEvent(new Event(RENDER_EVENT));
      saveData();
      formEditData.reset();
      sectionEdit.style.display = "none";
      swal("Berhasil", "Data bukumu sudah berhasil diedit", "success");
   });

   cancelEdit.addEventListener("click", (e) => {
      e.preventDefault();
      sectionEdit.style.display = "none";
      formEditData.reset();
      swal("Anda membatalkan untuk mengedit data buku");
   });
}

function saveData() {
   if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);

      document.dispatchEvent(new Event(RENDER_EVENT));
   }
}

function loadDataFromStorage() {
   const serializedData = localStorage.getItem(STORAGE_KEY);
   let data = JSON.parse(serializedData);

   if (data !== null) {
      data.forEach((book) => {
         books.unshift(book);
      });
   }
   document.dispatchEvent(new Event(RENDER_EVENT));
   return books;
}

function showBook(books = []) {
   const incompleteBookShelf = document.getElementById("incompleteBookshelfList");
   const completeBookShelf = document.getElementById("completeBookshelfList");

   incompleteBookShelf.innerHTML = "";
   completeBookShelf.innerHTML = "";

   books.forEach((book) => {
      if (book.isCompleted == false) {
         let el = `
            <article class="book_item">
               <h3>${book.title}</h3>
               <p>Penulis : ${book.author}</p>
               <p>Tahun Terbit : ${book.year}</p>

               <div class="action">
                  <button class="btn-black" onclick="changeBookStatus(${book.id})"><i class="fa-solid fa-circle-check"></i></button>
                  <button class="btn-red" onclick="removeBook(${book.id})"><i class="fa-solid fa-trash"></i></button>
                  <button class="btn-orange" onclick="editBookData(${book.id})"><i class="fa-solid fa-pen-to-square"></i></button>
               </div>
            </article>
            `;

         incompleteBookShelf.innerHTML += el;
      } else {
         let el = `
            <article class="book_item">
               <h3>${book.title}</h3>
               <p>Penulis : ${book.author}</p>
               <p>Tahun Terbit : ${book.year}</p>

               <div class="action">
                  <button class="btn-black" onclick="changeBookStatus(${book.id})"><i class="fa-solid fa-rotate-left"></i></button>
                  <button class="btn-red" onclick="removeBook(${book.id})"><i class="fa-solid fa-trash"></i></button>
                  <button class="btn-orange" onclick="editBookData(${book.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                  </div>
            </article>
            `;

         completeBookShelf.innerHTML += el;
      }
   });
}

document.addEventListener("DOMContentLoaded", function () {
   form.addEventListener("submit", function (e) {
      e.preventDefault();
      addBook();

      form.reset();
   });

   if (isStorageExist()) {
      loadDataFromStorage();
   }
});

document.addEventListener(RENDER_EVENT, () => {
   const btnResetRak = document.getElementById("resetRak");
   if (books.length <= 0) {
      btnResetRak.style.display = "none";
   } else {
      btnResetRak.style.display = "block";
   }

   showBook(books);
});
