let globalModule;

function searchBooks(event) {

  event.preventDefault();
  removeListener();
  clearTable();
  globalModule = {
    loadedItems: 0,
    totalItems: null
  };
  getBooks();
  addListener();

}

// add books while scrolling
function handleScroll() {

  if (tableWrapper.scrollTop + tableWrapper.clientHeight >= tableWrapper.scrollHeight 
      && globalModule.totalItems !== null) {
    getBooks();
  }

}

// add event listener function
function addListener() {

  let tableWrapper = document.querySelector('#tableWrapper');
  tableWrapper.addEventListener('scroll', handleScroll);

}

// remove event listener function
function removeListener() {

  let tableWrapper = document.querySelector('#tableWrapper');
  tableWrapper.removeEventListener('scroll', handleScroll);

}

// get books with related data
function getBooks() {
  
  let searchValue = document.getElementById('searchField').value;

  if (globalModule.totalItems === null || globalModule.loadedItems < globalModule.totalItems) {
    fetchData(searchValue, globalModule.loadedItems)
      .then(response => {

        globalModule.loadedItems = response.total;
        globalModule.totalItems = response.data.totalItems;

        const books = response.data.items;
        for (let i in books) {
          const book = books[i];
          addBook(book);
        }
      })
  }

}

// get data
function fetchData(searchValue, startIndex) {

  return fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${searchValue}&startIndex=${startIndex}&maxResults=10`)
    .then((response) => response.json())
    .then((jsonResponse) => {
      return {
        data: jsonResponse,
        total: startIndex + jsonResponse.items.length
      }
    });

}

// add book into the table body
function addBook(book) {

  const info = book.volumeInfo;

  // create dom elements
  const tr = document.createElement('tr');
  const tdImage = document.createElement('td');
  const tdTitle = document.createElement('td');
  const tdDescription = document.createElement('td');
  const image = document.createElement('img');

  // add classes to the tables cells
  tdImage.className = '-type_image';
  tdTitle.className = '-type_title';
  tdDescription.className = '-type_description';

  // add texts and html into the cells
  if (info.imageLinks) {
    image.src = info.imageLinks.thumbnail;
    tdImage.appendChild(image);
  } 
  tdTitle.innerHTML = info.title;
  if (info.description) {
    tdDescription.innerHTML = cutString(info.description, 12);
  }

  // add cells into the row
  tr.appendChild(tdImage);
  tr.appendChild(tdTitle);
  tr.appendChild(tdDescription);

  // add row into the tbody
  document.getElementById('tBody').appendChild(tr);

}

// clear table body
function clearTable() {

  var tBody = document.getElementById('tBody');
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

}

// cut the string depending on the given value
function cutString(str, limit) {

  let resultStr = str;
  let arrayWords = resultStr.split(' ');

  // cut the string if it has more words than specified
  if (arrayWords.length > limit) {
    arrayWords = arrayWords.splice(0, limit);
    resultStr = arrayWords.join(' ')+'...';
  }

  return resultStr;

}
