"use strict";

//js-results js-form js-searchInput js-searchBtn

//API

//SEARCH

const formElement = document.querySelector(".js-form");
const btnElement = document.querySelector(".js-searchBtn");
const inputElement = document.querySelector(".js-searchInput");
const resultsElement = document.querySelector(".js-results");
const favoritesListElement = document.querySelector('.js-favoritesList');
let shows = [];
let favoriteShows = [];

//API

function callToApi(searchValue) {
  fetch("http://api.tvmaze.com/search/shows?q=" + searchValue)
    .then((response) => response.json())
    .then((data) => {
      shows = data;
      //console.log(shows);
      renderResult(data);
    });
}

//PAINT

function renderResult(series) {
  let htmlCode = "";
  for (const serie of series) {
    const showItem = serie.show;
    const showTitle = showItem.name;
    const showId = showItem.id;
    let showImages = showItem.image;
    const showThumbnail = isImgUrlValid();
    function isImgUrlValid() {
      let validUrl = "";
      if (showItem.image === null) {
        validUrl = `https://via.placeholder.com/210x295/ffffff/666666/?
            text=TV`;
      } else {
        validUrl = `${showImages.medium}`;
      }
      return validUrl;
    }
    htmlCode += `<li class="resultList--item js-show" id="${showId}">`;
    htmlCode += `<img src="${showThumbnail}" alt="${showTitle} poster">`;
    htmlCode += `<p>${showTitle}</p>`;
    htmlCode += "</li>";
  }
  resultsElement.innerHTML = htmlCode;
  listenShowsEvents()
}

//PREVENT DEFAULT FORM BTN

function handleForm(ev) {
  ev.preventDefault();
  console.log("No hago submit.");
}

formElement.addEventListener("submit", handleForm);

//HANDLE SUBMIT BUTTON CLICK

function handleSubmitButton() {
  callToApi(inputElement.value);
}

btnElement.addEventListener("click", handleSubmitButton);

//SHOW LIST LISTENER

function listenShowsEvents() {
  const showElements = document.querySelectorAll('.js-show');
  for (const showElement of showElements) {
    showElement.addEventListener('click', handleShow);
  }
}

function handleShow(ev) {
  const clickedShow = ev.currentTarget;
  const clickedShowId = clickedShow.id;
  console.log(clickedShowId);
  const resultShows = shows; 
  console.log(resultShows);
  for(const result of resultShows){
    const showItem = result.show;
    const itemId = showItem.id;
    const stringId = `${itemId}`;
    if (stringId === clickedShowId){
      console.log("te encontré");
      favoriteShows.push(result)
    }
  }
  console.log(favoriteShows);

  //pintando favorites (luego sacar de aquí)
  
} 
/* function handleShow(ev) {
  const clickedShowId = ev.currentTarget.id;
  // busco si la paleta clickada está en el array de favoritos
  const favoritesFoundIndex = favorites.findIndex(favorite => favorite.id === clickedShowId);
  // si la paleta no está en favoritos findIndex me ha devuelto -1
  if (favoritesFoundIndex === -1) {
    // busco la paleta clickada en el array de paletas
    const showFound = shows.find(show => show.id === clickedShowId);
    // para luego añadirlo al array de favoritos
    favorites.push(showFound);
  } else {
    // si el findIndex me ha devuelto un número mayor o igual a 0 es que sí está en el array de favoritos
    // quiero sacarlo de array de favoritos
    // para utilizar splice necesito el índice del elemento que quiero borrar
    // y quiero borrar un solo elemento
    favorites.splice(favoritesFoundIndex, 1);
  }
  console.log(favorites);
  // meter aqui función para pintar favoritos
} */