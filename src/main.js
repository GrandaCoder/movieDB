/*
const movieElement = document.querySelector('.trendingPreview-movieList');
const categoryElement = document.querySelector('.categoriesPreview-list');
*/


async function getDataFromApi(endpoint,optionalConfig = {}){
    const {data} = await instance.get(`${endpoint}`, optionalConfig);
    return data;
};

async function showTrendingMovies(){
    const data = await getDataFromApi('/trending/movie/week');
    const movies = data.results;

    movies.forEach(movie => {
        createMovieElement(movie,trendingMoviesPreviewList);
    })

}

async function getMovieBySearch(query) {

    console.log("query:"+query);

    const data =await getDataFromApi(`/search/movie`, {
        params: {
            query
        }
    })

    const movies = data.results;
    cleanSection(genericSection);
    movies.forEach(movie => {
        createMovieElement(movie,genericSection);
    })
}

function cleanSection(section){
    section.innerHTML = '';
}

//carga las listas de las categorias
async function showCategories(){
    const data = await getDataFromApi('/genre/movie/list');
    const categories = data.genres;
    categories.forEach(category => {
        createCategoryElement(category,categoriesPreviewList);
    })
}

//crea un elemento de categoria para renderizar
function createMovieElement(movie, insertUbication){
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');
    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');

    movieContainer.addEventListener('click', () => {
        location.hash = `#movie=${movie.id}`
    })

    if (movie.poster_path !== null) { // check if poster_path is not null
        movieImg.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        movieImg.alt = movie.title;
    } else {
        movieImg.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'; // set a default image source
        movieImg.alt = 'No image available'; // set a default alt text
    }
    movieImg.alt = movie.title;
    movieContainer.appendChild(movieImg);

    // trendingMoviesPreviewList.appendChild(movieContainer);
    insertUbication.appendChild(movieContainer);
}

//crea las listas
function createCategoryElement(category,toInsertIn){
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

function scrollToTop() {
    window.scrollTo({
        top: 0
    });
}

async function getMovieById(movie_id){
    const data = await getDataFromApi(`/movie/${movie_id}`);
    createMovieDetail(data);
    getRelatedMovies(movie_id);
}

async function getRelatedMovies(movie_id){
    const data = await getDataFromApi(`/movie/${movie_id}/similar`);
    const movies = data.results;

    cleanSection(relatedMoviesContainer);
    movies.forEach(movie => {
        createMovieElement(movie,relatedMoviesContainer);
    })
}

function createMovieDetail(movie){

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
    generos.forEach(genero  => {
        createCategoryElement(genero,movieDetailCategoriesList)
    })
}





