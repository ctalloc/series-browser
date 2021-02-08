"use strict";

//js-results js-form js-searchInput js-searchBtn

//API

//SEARCH

const formElement = document.querySelector(".js-form");
const btnElement = document.querySelector(".js-searchBtn");
const inputElement = document.querySelector(".js-searchInput");
const resultsElement = document.querySelector(".js-results");

//API

function callToApi(searchValue) {
  fetch("http://api.tvmaze.com/search/shows?q=" + searchValue)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      renderResult(data);
    });
}

//PAINT

function renderResult(series) {
  let htmlCode = "";
  for (const serie of series) {
    const showItem = serie.show;
    const showTitle = showItem.name;
    let showImages = showItem.image;
    //const showThumbnail = `${showImages.medium}`;
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
    htmlCode += '<li class="resultList__item">';
    htmlCode += `<img src="${showThumbnail}" alt="${showTitle} poster">`;
    htmlCode += `<p>${showTitle}</p>`;
    htmlCode += "</li>";
  }
  resultsElement.innerHTML = htmlCode;
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
