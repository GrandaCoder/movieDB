import { lazyLoader, loadNextPage } from './lazyloading.mjs';
import {
     headerCategoryTitle, 
     headerSection, 
     trendingMoviesPreviewList, 
     genericSection,
     likedMoviesContainer,
     categoriesPreviewList,
     movieDetailTitle,
     movieDetailDescription,
     movieDetailScore,
     movieDetailCategoriesList,
     relatedMoviesContainer

} from './getNodes.mjs';

import {
    likedMoviesList,
    likeMovie
} from './favoriteMovies.mjs';

import{
    getDataFromApi,
} from './getData.mjs';

import {
    playSound
} from './sounds.mjs';

function createMovieElement(movie, insertUbication) {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');
    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.classList.add('backgrondImage-skeleton-img');

    try {
        movieImg.setAttribute('data-img', `https://image.tmdb.org/t/p/w300${movie.poster_path}`);
        movieImg.classList.add('fade-in');
        movieImg.addEventListener('load', () => {
          movieImg.classList.add('loaded');
        });
      } catch (error) {
         movieImg.src = `https://via.placeholder.com/300x450/5c218a/ffffff?text=${movie.title}`;
         movieImg.alt = 'No image available';
      }
    

    
    // if (movie.poster_path == null) {
    //     movieImg.src = `https://via.placeholder.com/300x450/5c218a/ffffff?text=${movie.title}`;
    //     movieImg.alt = 'No image available';
    // } else {
    //     movieImg.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
    //     movieImg.alt = movie.title;
    // }
    // movieImg.setAttribute('data-img', movieImg.src);


    movieImg.addEventListener('click', () => {
        location.hash = `#movie=${movie.id}`;
    });

    const movieButton = document.createElement('button');
    movieButton.classList.add('movie-btn');
    movieButton.alt = movie.title;

    if (likedMoviesList()[movie.id]) {
        movieButton.classList.add('movie-button--liked');
    }

    movieButton.addEventListener('click', () => {
        movieButton.classList.toggle('movie-button--liked');
        likeMovie(movie);
        getLikedMovies();
        searchTrendingMovies();

        const source = `/src/sounds/like.mp3`;
        playSound(source);
    });

    lazyLoader.observe(movieImg);

    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieButton);
    insertUbication.appendChild(movieContainer);
}

//function that reproduces a sound from a source

function createCategoryElement(category, toInsertIn) {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');
    const categoryTitle = document.createElement('h3');
    categoryTitle.id = `id${category.id}`;
    categoryTitle.classList.add('category-title');
    categoryTitle.innerText = category.name;

    categoryTitle.addEventListener('click', () => {
        location.hash = `#category=${category.id}-${category.name}`
    })

    categoryContainer.appendChild(categoryTitle);
    toInsertIn.appendChild(categoryContainer);
}

function createMovieDetail(movie) {

    const movieUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    headerSection.style.background = `
    linear-gradient(
        180deg, 
        rgba(0, 0, 0, 0.35) 19.27%, 
        rgba(0, 0, 0, 0) 29.17%
        ),
    url(${movieUrl})`;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;
    const generos = movie.genres;
    cleanSection(movieDetailCategoriesList);
    generos.forEach(genero => {
        createCategoryElement(genero, movieDetailCategoriesList)
    })
}

// render elements

function renderElements(elementos, seccion, funcion) {
    elementos.forEach(elemento => {
        funcion(elemento, seccion);
    })
}

async function searchTrendingMovies() {
    const data = await getDataFromApi('/trending/movie/week');
    const movies = data.results;

    cleanSection(trendingMoviesPreviewList);
    renderElements(movies, trendingMoviesPreviewList, createMovieElement);
}


async function searchCategories() {
    const data = await getDataFromApi('/genre/movie/list');
    const categories = data.genres;

    renderElements(categories, categoriesPreviewList, createCategoryElement);
}


async function searchMovies(informacion = { query, clean, page }) {

    const data = await getDataFromApi(`/search/movie`, {
        params: {
            query: informacion.query,
            page: informacion.page
        }
    })
    const movies = data.results;
    cleanSection(genericSection, informacion.clean);
    renderElements(movies, genericSection, createMovieElement);
    loadNextPageIfPossible(informacion, data, genericSection, searchMovies);
}

async function getMovieById(movie_id) {
    const data = await getDataFromApi(`/movie/${movie_id}`);

    createMovieDetail(data);
    getRelatedMovies(movie_id);
}

async function getRelatedMovies(movie_id) {
    const data = await getDataFromApi(`/movie/${movie_id}/similar`);
    const movies = data.results;

    cleanSection(relatedMoviesContainer);
    renderElements(movies, relatedMoviesContainer, createMovieElement);
}

async function getMovieByCategory(informacion) {
    const data = await getDataFromApi(`/discover/movie`, {
        params: {
            with_genres: informacion.idNumber,
            page: informacion.page
        }
    });
    const results = data.results;

    cleanSection(genericSection, informacion.clean);
    headerCategoryTitle.innerHTML = informacion.genderMovie;
    renderElements(results, genericSection, createMovieElement);
    loadNextPageIfPossible(informacion, data, genericSection, getMovieByCategory);
}

async function renderTrendingMoviesSection(informacion = { page: 1, clean: true }) {
    const data = await getDataFromApi(`/trending/movie/day`, {
        params: {
            page: informacion.page
        }
    });
    const results = data.results;

    cleanSection(genericSection, informacion.clean);
    renderElements(results, genericSection, createMovieElement);
    loadNextPageIfPossible(informacion, data, genericSection, renderTrendingMoviesSection);
}

//--- end get data from api

//---  functions
function loadNextPageIfPossible(informacion, data, Section, fun) {
    const nextPage = informacion.page + 1;
    if (nextPage <= data.total_pages) {
        const loadingElement = createLoadingElement();
        Section.appendChild(loadingElement);
        loadNextPage(loadingElement, informacion, fun);
    }
}

function cleanSection(section, isClean = true) {
    if (isClean) {
        while (section.firstChild) {
            section.removeChild(section.firstChild);
        }
    }
}

function createLoadingElement() {
    const divider = document.createElement('div');
    divider.classList.add('divider');
    const textNode = document.createTextNode('Loading more...');
    divider.appendChild(textNode);
    return divider;
}


function getLikedMovies() {
    const likedMovies = likedMoviesList();
    const movieArray = Object.values(likedMovies);

    cleanSection(likedMoviesContainer);
    renderElements(movieArray, likedMoviesContainer, createMovieElement);
}


function getIdFromLocation() {
    const generalId = location.hash.split('=')[1];
    const [idNumber, genderMovie] = generalId.split('-');
    return { idNumber, genderMovie };
}

function isLoadedInfoAPI(category) {
    return category.children.length;
}


export  {
    renderTrendingMoviesSection,
    searchMovies,
    getMovieById,
    getMovieByCategory,
    searchTrendingMovies,
    searchCategories,
    getLikedMovies,
    getIdFromLocation,
    isLoadedInfoAPI
}



