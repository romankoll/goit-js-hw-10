import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));

function handleSearch(e) {
  const countryValue = e.target.value.trim();

  if (countryValue === '') {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
    return;
  }
  fetchCountries(countryValue)
    .then(data => searchListCountries(data))
    .catch(onError);
}

function searchListCountries(data) {
  if (data.lenght > 10) {
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.lenght >= 2 && data.lenght <= 10) {
    countryListEl.innerHTML = createList(data);
    countryInfoEl.innerHTML = '';
  } else {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = createCountryInfo(data);
  }
}

function createList(data) {
  return data
    .map(ell => `<li><img src="${ell.flag}" width=60><h2>${ell.name}</h2>`)
    .join(', ');
}

function createCountryInfo(data) {
  const languages = Object.values(data[0].languages).join(', ');
  const capital = Object.values(data[0].capital).join(', ');
  return `<div class= "country-title"> <img src="${data[0].flag}" 
  width=60><h2>${data[0].name}</h2></div><p><span>Capital: </span>${capital}</p><p><span>Population: 
  </span>${data[0].population}</p><p><span>Languages: </span>${languages}</p>`;
}
function onError() {
  Notify.failure('Oops, there is no country with that name');
}
