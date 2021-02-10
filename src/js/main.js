"use strict";

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
    let isFavoriteClass = isFavoriteShow(serie) ? "show--favorite" : "";
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
    htmlCode += `<li class="resultList--item js-show ${isFavoriteClass}" id="${showId}">`;
    htmlCode += `<img src="${showThumbnail}" alt="${showTitle} poster" title="Click para agregar/quitar ${showTitle} a favoritos">`;
    htmlCode += `<p>${showTitle}</p>`;
    htmlCode += "</li>";
  }
  resultsElement.innerHTML = htmlCode;
  listenShowsEvents();
}

//IS FAVORITE SHOW

function isFavoriteShow(shows) {
  return !!favoriteShows.find((favorite) => favorite.show.id === shows.show.id);
}

//PREVENT DEFAULT FORM BTN

function handleForm(ev) {
  ev.preventDefault();
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
  const resultShows = shows;
  for (const result of resultShows) {
    const showItem = result.show;
    const itemId = showItem.id;
    const stringId = `${itemId}`;
    if (stringId === clickedShowId) {
      function isItAFavorite() {
        const favoritesFoundIndex = favoriteShows.findIndex(
          (favorite) => favorite.show.id === parseInt(clickedShowId)
        );
        if (favoritesFoundIndex === -1) {
          favoriteShows.push(result);
        } else {
          favoriteShows.splice(favoritesFoundIndex, 1);
        }
      }
      isItAFavorite();
    }
  }
  saveLocalFavorites();
  renderResult();
  paintFavorites();
}

//SAVE FAVORITES IN LOCAL STORAGE

function saveLocalFavorites() {
  const stringfavorites = JSON.stringify(favoriteShows);
  localStorage.setItem("showFavorites", stringfavorites);
}

//GET FROM LOCAL

function getFromLocalStorage() {
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
    htmlCode += `<li id="${favoriteId}" class="favorites__list--item">`;
    htmlCode += `<div class="favorites__list--imgContainer">`;
    htmlCode += `<img src="${favoriteThumbnail}" class="favorites__list--img" alt="${favoriteTitle} poster" title="${favoriteTitle}">`;
    htmlCode += `</div>`;
    htmlCode += `<p class="favorites__list--title">${favoriteTitle}</p>`;
    htmlCode += `<button class="js-delete favorites__list--deleteBtn" id="${favoriteShows.indexOf(
      favorite
    )}">`;
    htmlCode += `<span>Borrar</span>`;
    htmlCode += `</button>`;
    htmlCode += "</li>";
  }
  favoritesListElement.innerHTML = htmlCode;
  listenDeleteButtons();
}

// DELETE BUTTON

function listenDeleteButtons() {
  const deleteButtons = document.querySelectorAll(".js-delete");
  for (const deleteButton of deleteButtons) {
    deleteButton.addEventListener("click", handleDelete);
  }
}

function handleDelete(ev) {
  const clickedIndex = parseInt(ev.currentTarget.id);
  favoriteShows.splice(clickedIndex, 1);
  paintFavorites();
  renderResult();
}
