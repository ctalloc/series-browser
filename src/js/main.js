"use strict";

//js-results js-form js-searchInput js-searchBtn

//API

//SEARCH

const formElement = document.querySelector(".js-form");
const btnElement = document.querySelector(".js-searchBtn");
const inputElement = document.querySelector(".js-searchInput");
const resultsElement = document.querySelector(".js-results");
const favoritesListElement = document.querySelector(".js-favoritesList");
let shows = [];
let favoriteShows = [];

//API

function callToApi(searchValue) {
  fetch("http://api.tvmaze.com/search/shows?q=" + searchValue)
    .then((response) => response.json())
    .then((data) => {
      shows = data;
      renderResult(data);
    });
}

//PAINT SHOW RESULTS AND LISTEN

function renderResult() {
  let htmlCode = "";
  for (const serie of shows) {
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
  listenShowsEvents();
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

//SHOW LIST LISTENER + HANDLER

function listenShowsEvents() {
  const showElements = document.querySelectorAll(".js-show");
  for (const showElement of showElements) {
    showElement.addEventListener("click", handleShow);
  }
}

function handleShow(ev) {
  const clickedShow = ev.currentTarget;
  const clickedShowId = clickedShow.id;
  //console.log(clickedShowId);
  const resultShows = shows;
  //console.log(resultShows);
  for (const result of resultShows) {
    const showItem = result.show;
    const itemId = showItem.id;
    const stringId = `${itemId}`;
    if (stringId === clickedShowId) {
      console.log("te encontré");
      function isItAFavorite() {
        console.log("es favorita o no");
       // for (const favorite of favoriteShows) {
          console.log("buscando en favoritos");
            const favoritesFoundIndex = favoriteShows.findIndex((favorite) => favorite.show.id === parseInt(clickedShowId)
          );
          if (favoritesFoundIndex === -1) {
            favoriteShows.push(result)
          } else {
            favoriteShows.splice(favoritesFoundIndex, 1)
          }
          console.log(favoritesFoundIndex);
       // }
      }
      isItAFavorite();
    }
  }
  saveLocalFavorites();
  console.log(favoriteShows);
  renderResult();
  paintFavorites();
}

//RUN THROUGH FAVORITES

//SAVE FAVORITES IN LOCAL STORAGE

function saveLocalFavorites() {
  const stringfavorites = JSON.stringify(favoriteShows);
  localStorage.setItem("showFavorites", stringfavorites);
}

//GET FROM LOCAL

function getFromLocalStorage() {
  console.log("hola");
  const localStorageFavorites = localStorage.getItem("showFavorites");
  if (localStorageFavorites) {
    const arrayFavorites = JSON.parse(localStorageFavorites);
    favoriteShows = arrayFavorites;
    paintFavorites();
  }
}
getFromLocalStorage();

// PAINT FAVORITES

function paintFavorites() {
  let htmlCode = "";
  for (const favorite of favoriteShows) {
    const favoriteItem = favorite.show;
    const favoriteTitle = favoriteItem.name;
    const favoriteId = favoriteItem.id;
    let favoriteImages = favoriteItem.image;
    const favoriteThumbnail = isImgUrlValid();
    function isImgUrlValid() {
      let validUrl = "";
      if (favoriteItem.image === null) {
        validUrl = `https://via.placeholder.com/210x295/ffffff/666666/?
            text=TV`;
      } else {
        validUrl = `${favoriteImages.medium}`;
      }
      return validUrl;
    }
    htmlCode += `<li id="${favoriteId}">`;
    htmlCode += `<img src="${favoriteThumbnail}" alt="${favoriteTitle} poster">`;
    htmlCode += `<p>${favoriteTitle}</p>`;
    htmlCode += "</li>";
  }
  favoritesListElement.innerHTML = htmlCode;
}
