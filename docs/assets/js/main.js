"use strict";const formElement=document.querySelector(".js-form"),btnElement=document.querySelector(".js-searchBtn"),inputElement=document.querySelector(".js-searchInput"),resultsElement=document.querySelector(".js-results"),favoritesListElement=document.querySelector(".js-favoritesList");let shows=[],favoriteShows=[];function callToApi(e){fetch("https://api.tvmaze.com/search/shows?q="+e).then(e=>e.json()).then(e=>{shows=e,renderResult(e),console.log(shows)})}function renderResult(){let e="";for(const o of shows){const s=o.show,n=s.name,i=s.id;let r=s.image;function t(){let e="";return e=null===s.image?"https://via.placeholder.com/210x295/ffffff/666666/?\n            text=TV":""+r.medium,e}e+=`<li class="resultList--item js-show ${isFavoriteShow(o)?"show--favorite":""}" id="${i}">`,e+=`<img src="${t()}" alt="${n} poster" title="Click para agregar/quitar ${n} a favoritos">`,e+=`<p>${n}</p>`,e+=`<p>${o.show.language}</p>`,e+="</li>"}resultsElement.innerHTML=e,listenShowsEvents()}function isFavoriteShow(e){return!!favoriteShows.find(t=>t.show.id===e.show.id)}function handleForm(e){e.preventDefault()}function handleSubmitButton(){callToApi(inputElement.value)}function listenShowsEvents(){const e=document.querySelectorAll(".js-show");for(const t of e)t.addEventListener("click",handleShow)}function handleShow(e){const t=e.currentTarget.id,o=shows;for(const e of o){if(""+e.show.id===t){function s(){const o=favoriteShows.findIndex(e=>e.show.id===parseInt(t));-1===o?favoriteShows.push(e):favoriteShows.splice(o,1)}s()}}saveLocalFavorites(),renderResult(),paintFavorites()}function saveLocalFavorites(){const e=JSON.stringify(favoriteShows);localStorage.setItem("showFavorites",e)}function getFromLocalStorage(){const e=localStorage.getItem("showFavorites");if(e){const t=JSON.parse(e);favoriteShows=t,paintFavorites()}}function paintFavorites(){let e="";for(const o of favoriteShows){const s=o.show,n=s.name,i=s.id;let r=s.image;function t(){let e="";return e=null===s.image?"https://via.placeholder.com/210x295/ffffff/666666/?\n            text=TV":""+r.medium,e}e+=`<li id="${i}" class="favorites__list--item">`,e+='<div class="favorites__list--imgContainer">',e+=`<img src="${t()}" class="favorites__list--img" alt="${n} poster" title="${n}">`,e+="</div>",e+=`<p class="favorites__list--title">${n}</p>`,e+=`<button class="js-delete favorites__list--deleteBtn" title="Click para borrar de favoritos" id="${favoriteShows.indexOf(o)}">`,e+="<span>Borrar</span>",e+="</button>",e+="</li>"}favoritesListElement.innerHTML=e,listenDeleteButtons()}function listenDeleteButtons(){const e=document.querySelectorAll(".js-delete");for(const t of e)t.addEventListener("click",handleDelete)}function handleDelete(e){const t=parseInt(e.currentTarget.id);favoriteShows.splice(t,1),paintFavorites(),renderResult()}formElement.addEventListener("submit",handleForm),btnElement.addEventListener("click",handleSubmitButton),getFromLocalStorage();const logBtn=document.querySelector(".js-log");function handleLog(){console.log(favoriteShows.length)}logBtn.addEventListener("click",handleLog);