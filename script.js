let books = [];
let searchResults = [];

function Book(title, author, pages, coverImage, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.coverImage = coverImage;
    this.read = read;
}

function SearchResults(title, author, thumbnail, pages){
    this.title = title;
    this.author = author;
    this.thumbnail = thumbnail;
    this.pages = pages;
}




let confirmImage;
let confirmTitle;
let confirmAuthor;
let confirmPages;

// if(books.length == 0){
//     localStorage.setItem("defaultCreated", false);
// }else{
//     localStorage.setItem("defaultCreated", true);
// }




function populateDefaultBooks(){

        confirmImage = "http://books.google.com/books/content?id=coMlEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api";
        confirmTitle = "Encyclopedia of Sahih Al-Bukhari" ;
        confirmAuthor = "Abu-`Abdullah Muhammad-Bin-Isma`il Al-Bukhari";
        confirmPages = 3452;
    
        books.push(new Book(confirmTitle,confirmAuthor,confirmPages,confirmImage, false));
        updateLocalStorage();
        createBookCard(books.length - 1);

        confirmImage = "http://books.google.com/books/content?id=nWg0swEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api";
        confirmTitle = "Sahih Muslim Hadith";
        confirmAuthor = "Imam Muslim"
        confirmPages = 130

        books.push(new Book(confirmTitle, confirmAuthor, confirmPages, confirmImage, false));
        updateLocalStorage();
        createBookCard(books.length - 1);

        
}





if(localStorage.getItem("books") != null){
    books = JSON.parse(localStorage.getItem("books"));
}






function fetchDataFromGoogle(query) {
formattedQuery = query.replaceAll(" ","%20");
console.log(formattedQuery);

fetch("https://www.googleapis.com/books/v1/volumes?q="+formattedQuery, {mode: "cors"})
.then(function(response){
    return response.json();
})
.then(function(result){

    console.log(result);
    console.log(result.items.length);


            for(let x = 0; x < result.items.length; x++){
                if(result["items"][x]["volumeInfo"].hasOwnProperty("imageLinks") && result["items"][x]["volumeInfo"].hasOwnProperty("authors")){
                    console.log("LOGGED");
                    searchResults.push(new SearchResults(result["items"][x]["volumeInfo"]["title"],
                    result["items"][x]["volumeInfo"]["authors"][0],result["items"][x]["volumeInfo"]["imageLinks"]["smallThumbnail"],result["items"][x]["volumeInfo"]["pageCount"]));
                }
                else if (result["items"][x]["volumeInfo"].hasOwnProperty("authors") && !(result["items"][x]["volumeInfo"].hasOwnProperty("imageLinks"))){
                    searchResults.push(new SearchResults(result["items"][x]["volumeInfo"]["title"],
                    result["items"][x]["volumeInfo"]["authors"][0],"https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",result["items"][x]["volumeInfo"]["pageCount"]));
                }
                else if (!(result["items"][x]["volumeInfo"].hasOwnProperty("authors")) && result["items"][x]["volumeInfo"].hasOwnProperty("imageLinks")){
                    searchResults.push(new SearchResults(result["items"][x]["volumeInfo"]["title"],
                    "Unknown Author",result["items"][x]["volumeInfo"]["imageLinks"]["smallThumbnail"],result["items"][x]["volumeInfo"]["pageCount"]));
                }
                else if (!(result["items"][x]["volumeInfo"].hasOwnProperty("authors")) &&  !(result["items"][x]["volumeInfo"].hasOwnProperty("imageLinks"))){
                    console.log(x);
                    searchResults.push(new SearchResults(result["items"][x]["volumeInfo"]["title"],
                    "Unknown Author","https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg", result["items"][0]["volumeInfo"]["pageCount"]))
                }               
            };


    console.log(searchResults);
    if(result["items"][0]["volumeInfo"].hasOwnProperty("imageLinks")){
        confirmImage = result["items"][0]["volumeInfo"]["imageLinks"]["thumbnail"];
    } else{
        confirmImage = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
    }
    console.log(confirmImage);
    confirmTitle = result["items"][0]["volumeInfo"]["title"];
    console.log(confirmTitle);
    confirmAuthor = result["items"][0]["volumeInfo"]["authors"][0];
    console.log(confirmAuthor);
    confirmPages = result["items"][0]["volumeInfo"]["pageCount"];
    console.log(confirmPages);
}).then(function(){
    populateDialog();
})



}

function populateDialog(){
    // const confImage = document.createElement("img");
    // firstModal.appendChild(confImage);
    // confImage.classList.add("temp-cover-image");
    // console.log(confirmImage);
    // console.log("hello");
    // confImage.src = confirmImage;
    // const infoSection = document.createElement("div");
    // infoSection.classList.add("temp-info-section");
    // firstModal.appendChild(infoSection);
    // const confTitle = document.createElement("span");
    // confTitle.textContent = "Title: " + confirmTitle;
    // infoSection.appendChild(confTitle);
    // const confAuthor = document.createElement("span");
    // confAuthor.textContent = "Author: " + confirmAuthor;
    // infoSection.appendChild(confAuthor);

    tempCoverImage.src = confirmImage;
    if(tempCoverImage.src == "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"){
        tempCoverImage.style.width = "128px";
        tempCoverImage.style.height = "169px";
    }
    googleTitle.textContent = confirmTitle;
    googleAuthor.textContent = confirmAuthor;
    googlePages.textContent = confirmPages;

    firstModal.showModal();
    firstModal.style.visibility = "visible";

}



const firstModal = document.querySelector(".first-modal");
const addBookButton = document.querySelector(".add-book-button");
const titleInput = document.querySelector("#booktitle");
const requiredField = document.querySelector(".required-field")
const authorInput = document.querySelector("#authorname");

const tempCoverImage = document.querySelector(".temp-cover-image");
const googleTitle = document.querySelector(".googletitle");
const googleAuthor = document.querySelector(".googleauthor");
const googlePages = document.querySelector(".googlepages");

const yesButton = document.querySelector(".yes-button");
const noButton = document.querySelector(".no-button");
const mainSection = document.querySelector(".mainsection");
const readCheckBox = document.querySelector("#readcheckbox")

const secondModal = document.querySelector(".second-modal");
const searchResultGrid = document.querySelector(".search-results-grid");

secondModal.style.width = "60vw";
secondModal.style.height = "80vh";



addBookButton.addEventListener("click", function () {
    console.log(titleInput.value);
    if(titleInput.value == ""){
        titleInput.style.outline = "5px solid red"
        requiredField.style.opacity = "1";
    } else{
        fetchDataFromGoogle(titleInput.value.concat(" ").concat(authorInput.value));
    }
});

titleInput.addEventListener("keydown", function (){
    titleInput.style.outline = "5px solid #38bdf8";
    requiredField.style.opacity = "0";
});

titleInput.addEventListener("focusout", function(){
    titleInput.style.outline = "none";
    requiredField.style.opacity = "0";
});

titleInput.addEventListener("focus", function() {
    if(titleInput.style.outline == "none"){
        titleInput.style.outline = "5px solid #38bdf8";
    }
    
});

firstModal.addEventListener("click", function () {
    let rect = firstModal.getBoundingClientRect();
    console.log(rect);
    let isInModal = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
    if(!isInModal){
        firstModal.close();
        firstModal.style.visibility = "hidden";
    }
});


secondModal.addEventListener("click", function () {
    let rect = secondModal.getBoundingClientRect();
    console.log(rect);
    let isInModal = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
    if(!isInModal){
        blankSearchResults();
        clearSearchResult();
        secondModal.style.visibility = "hidden";
        secondModal.close();
    }
});

function updateLocalStorage(){
    localStorage.setItem("books", JSON.stringify(books));
}

function blankSearchResults(){
    searchResults = [];
}

yesButton.addEventListener("click", function(){
    books.push(new Book(confirmTitle,confirmAuthor,confirmPages,confirmImage, readCheckBox.checked));
    updateLocalStorage();
    blankSearchResults();
    firstModal.close();
    firstModal.style.visibility = "hidden";
    createBookCard(books.length - 1);
    console.log(books);
});

noButton.addEventListener("click", function(){
    firstModal.close();
    firstModal.style.visibility = "hidden";
    secondModal.showModal();
    secondModal.style.visibility = "visible";

    for(let y = 0; y < searchResults.length; y++){
        createSearchResult(y);
    }
    
} )

function clearSearchResult(){
    for(let x = 0; x < 10; x++){
        searchResultGrid.removeChild(searchResultGrid.lastChild);
    }
}

function createSearchResult(currItem){
    let searchResultBanner = document.createElement("div");
    searchResultBanner.classList.add("search-result");
    searchResultGrid.appendChild(searchResultBanner);
    searchResultBanner.value = currItem;

    let searchResultTitle = document.createElement("span");
    searchResultTitle.classList.add("book-result-title");
    searchResultBanner.appendChild(searchResultTitle);
    searchResultTitle.textContent = searchResults[currItem]["title"];
    searchResultTitle.style.fontWeight = "bold";

    let searchResultAuthor = document.createElement("span");
    searchResultAuthor.classList.add("book-result-author");
    searchResultBanner.appendChild(searchResultAuthor);
    searchResultAuthor.textContent = searchResults[currItem]["author"];

    let searchResultImage = document.createElement("img");
    searchResultImage.classList.add("book-result-image");
    searchResultBanner.appendChild(searchResultImage);
    searchResultImage.src = searchResults[currItem]["thumbnail"];

    searchResultBanner.addEventListener("click", function(){
        confirmTitle = searchResults[searchResultBanner.value]["title"];
        confirmAuthor = searchResults[searchResultBanner.value]["author"];
        confirmPages = searchResults[searchResultBanner.value]["pages"];
        confirmImage = searchResults[searchResultBanner.value]["thumbnail"];

        books.push(new Book(confirmTitle,confirmAuthor,confirmPages,confirmImage, readCheckBox.checked));
        updateLocalStorage();
        blankSearchResults();
        clearSearchResult();
        secondModal.close();
        secondModal.style.visibility = "hidden";
        createBookCard(books.length - 1);
     })

//confirmTitle,confirmAuthor,confirmPages,confirmImage, readCheckBox.checked

}



function createBookCard(lastIndex){
    let bookCard = document.createElement("div");
    bookCard.classList.add("bookcard");
    mainSection.appendChild(bookCard);

    let bookInfoSection = document.createElement("div");
    bookInfoSection.classList.add("bookinfosection");
    bookCard.appendChild(bookInfoSection);

    let bookImage = document.createElement("div");
    bookImage.classList.add("bookimage");
    bookCard.appendChild(bookImage);

    let bookCardTitle = document.createElement("div");
    bookCardTitle.classList.add("bookcardtitle");
    bookInfoSection.appendChild(bookCardTitle);
    bookCardTitle.textContent = books[lastIndex]["title"];

    let bookCardAuthor = document.createElement("div");
    bookCardAuthor.classList.add("bookcardauthor");
    bookInfoSection.appendChild(bookCardAuthor);
    bookCardAuthor.textContent = books[lastIndex]["author"];


    let bookCardPages = document.createElement("div");
    if(books[lastIndex]["pages"] == undefined){
        console.log(books[lastIndex]["title"] + " \'s pages are undefined");
    }
    if(books[lastIndex]["pages"] != undefined){
        bookCardPages.classList.add("bookcardpages");
        bookInfoSection.appendChild(bookCardPages);
        bookCardPages.textContent = books[lastIndex]["pages"] + " pages";
    }
    
   
    let bookCardRead = document.createElement("div");
    bookCardRead.classList.add(".bookcardread");
    bookInfoSection.appendChild(bookCardRead);
    bookCardRead.textContent = "Read?";

    let bookCardCheckBox = document.createElement("INPUT");
    bookCardCheckBox.setAttribute("type", "checkbox");
    bookCardCheckBox.value = lastIndex;
    bookCardRead.appendChild(bookCardCheckBox);
    bookCardCheckBox.checked = books[lastIndex]["read"];

    let bookCardImage = document.createElement("img");
    bookCardImage.classList.add("book-card-image");
    bookImage.appendChild(bookCardImage);
    bookCardImage.src = books[lastIndex]["coverImage"];
    if(bookCardImage.src == "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"){
        bookCardImage.style.objectFit = "cover";
    }

    let bookCardCloseButton = document.createElement("img");
    bookCardCloseButton.classList.add("book-card-close-button");
    bookCard.appendChild(bookCardCloseButton);
    bookCardCloseButton.src = "assets/alpha-x-box.svg";

    bookCardCheckBox.addEventListener("click", function(){
        if(bookCardCheckBox.checked){
            books[lastIndex]["read"] = true;
            updateLocalStorage();
        }else if (!bookCardCheckBox.checked){
            books[lastIndex]["read"] = false;
            updateLocalStorage();
        }
    })

    bookCardCloseButton.addEventListener("click", function(){
        bookCard.remove();
        books.splice(lastIndex, 1);
        updateLocalStorage();
    })

};



populateFromLocalStorage();


function populateFromLocalStorage(){
    if(localStorage.getItem("books") != null){
        for(let i = 0; i <= books.length - 1; i++){
            createBookCard(i);
        }
    }
}

if(localStorage.getItem("books") == null){
    populateDefaultBooks();
}

