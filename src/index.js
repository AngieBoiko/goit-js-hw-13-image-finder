import './sass/main.scss';
import galleryTemp from './templates/gallery.hbs';
import apiService from './js/apiService.js';

import * as basicLightbox from 'basiclightbox';
import "basiclightbox/dist/basicLightbox.min.css";
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/Material.css';
import { alert, notice, info, success, error } from '@pnotify/core';

const refs = {
    form:document.querySelector('#search-form'),
    list: document.querySelector('.gallery'),
    input: document.querySelector("[data-action='input']"),
    resetBtn: document.querySelector("[data-action='reset']"),
    listContainer: document.querySelector('.images-list'),
    observeElem: document.querySelector('#observe-element'),
}

refs.form.addEventListener('submit',onSearch);
refs.resetBtn.addEventListener('click', onReset);


const options = {
  threshold: 0.5,
};
function onEntry(entries,observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            onLoadMore();
        }
   });
};
const observer = new IntersectionObserver(onEntry, options);

let pageCounter = 1;
let searchQuery = '';


async function onSearch(e) {
     e.preventDefault();
    if (!refs.input.value) {
        return alert({
            title:'Empty field',
            text:'Please, enter word!',

        });
    }
    searchQuery = refs.input.value;
    const getData = await apiService(searchQuery, pageCounter);
    render(getData);
       
    if (!getData.total) {
        return error({
            title:'Something going wrong :((',
            text:'Please, enter another word!',
        });
    }
    observer.observe(refs.observeElem);
    refs.input.value = '';
}

async function onLoadMore(){
    if (!refs.list.innerHTML) return;
    pageCounter += 1;
    const getData = await apiService(searchQuery, pageCounter);
    render(getData);
   refs.list.lastElementChild.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
    });
    if (!getData.total) {
        return error({
            title:'Something going wrong :((',
            text:'Please, enter another word!',
        });
    };
    
}

function render(data) {
    const markUp = galleryTemp(data);
    refs.list.insertAdjacentHTML('beforeend', markUp);
}

const imageModal = (e) => {
    if (e.target.dataset.src === undefined) return;
    basicLightbox.create(`<img src="${e.target.dataset.src}" alt="${e.target.alt}" />`).show();
    
};
refs.list.addEventListener('click', imageModal);
 

function onReset(event) {
    event.preventDefault();
    clearContent()
    refs.input.value=''
}

function clearContent(e) {
    refs.listContainer.innerHTML = '';
};




