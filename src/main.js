/*
const movieElement = document.querySelector('.trendingPreview-movieList');
const categoryElement = document.querySelector('.categoriesPreview-list');
*/

//lazy loader
const lazyLoader = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        entry
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.src = url;
            observer.unobserve(entry.target);
        }
    })
})




async function getDataFromApi(endpoint, optionalConfig = {}) {
    const { data } = await instance.get(`${endpoint}`, optionalConfig);
    return data;
};

async function showTrendingMovies() {
    const data = await getDataFromApi('/trending/movie/week');
    const movies = data.results;

    cleanSection(trendingMoviesPreviewList);
    movies.forEach(movie => {
        createMovieElement(movie,trendingMoviesPreviewList);
    })
    // renderSection(movies, trendingMoviesPreviewList);
}

// function renderSection(datos, section) {
//     cleanSection(section);
//     datos.forEach(dato => {
//         createMovieElement(dato, section);
//     })
// }

async function getMovieBySearch(informacion = { query, clean, currentPage }) {

    console.log("query:" + informacion.query);

    const data = await getDataFromApi(`/search/movie`, {
        params: {
            query: informacion.query,
            page: informacion.currentPage
        }
    })

    const movies = data.results;

    if (informacion.clean) {
        console.log("Limpiando")
        cleanSection(genericSection);
    }
    // cleanSection(genericSection);
    movies.forEach(movie => {
        createMovieElement(movie, genericSection);
    })

    //creamos un elemento de carga para que muestre el siguiente page
    loadNextPageIfPossible(informacion, data, genericSection, getMovieBySearch);

}


function loadNextPageIfPossible(informacion, data, Section, fun) {
    const nextPage = informacion.currentPage + 1;

    console.log("total pages:" + data.total_pages);

    if (nextPage <= data.total_pages) {
        console.log('cargando siguiente page');
        const loadingElement = createLoadingElement();
        Section.appendChild(loadingElement);
        loadNextPage(loadingElement, informacion, fun);
    }
}


function createLoadingElement() {
    const divider = document.createElement('div');
    divider.classList.add('divider');
    divider.innerHTML = 'Loading more...';
    return divider;
}

function loadNextPage(endOfContainer, informacion, fun) {
    // const element = document.getElementById('mi-div');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    informacion.currentPage += 1;

                    informacion.clean = false
                    fun(informacion);
                    endOfContainer.remove();
                }
            });
        },
        {
            threshold: 1,
        }
    );

    observer.observe(endOfContainer);
}



function cleanSection(section) {
    section.innerHTML = '';
}

//carga las listas de las categorias
async function showCategories() {
    const data = await getDataFromApi('/genre/movie/list');
    const categories = data.genres;
    categories.forEach(category => {
        createCategoryElement(category, categoriesPreviewList);
    })

}

//crea un elemento de categoria para renderizar
function createMovieElement(movie, insertUbication) {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');
    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.classList.add('backgrondImage-skeleton-img');


    if (movie.poster_path !== null) { // check if poster_path is not null
        movieImg.setAttribute('data-img', `https://image.tmdb.org/t/p/w300${movie.poster_path}`);
        // movieImg.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        movieImg.alt = movie.title;
    } else {
        movieImg.setAttribute('data-img', `https://via.placeholder.com/300x450/5c218a/ffffff?text=${movie.title}`);
        // movieImg.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'; // set a default image source
        movieImg.alt = 'No image available'; // set a default alt text
    }

    const movieButton = document.createElement('button');
    movieButton.classList.add('movie-btn');

    likedMoviesList()[movie.id] && movieButton.classList.add('movie-button--liked');

    movieButton.addEventListener('click', () => {
        movieButton.classList.toggle('movie-button--liked');
        //todo
        likeMovie(movie);
        getLikedMovies();
        // homePage();
        showTrendingMovies();
    })

    movieImg.addEventListener('click', () => {
        location.hash = `#movie=${movie.id}`
    })

    movieImg.alt = movie.title;
    lazyLoader.observe(movieImg);
    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieButton);
    insertUbication.appendChild(movieContainer);
}

//crea las listas
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

function scrollToTop() {
    window.scrollTo({
        top: 0
    });
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
    movies.forEach(movie => {
        createMovieElement(movie, relatedMoviesContainer);
    })
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

function getLikedMovies() {
    const likedMovies = likedMoviesList();
    const movieArray = Object.values(likedMovies);

    cleanSection(likedMoviesContainer);
    movieArray.forEach(movie => {
        createMovieElement(movie, likedMoviesContainer);
    })

    // showTrendingMovies();
}


