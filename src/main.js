

//---- lazy loaders
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

function loadNextPage(endOfContainer, informacion, fun) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    informacion.page += 1;
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
//--- end lazy loaders


//--- get data from api
async function getDataFromApi(endpoint, optionalConfig = {}) {
    try {
        const response = await instance.get(endpoint, optionalConfig);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function showTrendingMovies() {
    const data = await getDataFromApi('/trending/movie/week');
    const movies = data.results;

    cleanSection(trendingMoviesPreviewList);
    movies.forEach(movie => {
        createMovieElement(movie, trendingMoviesPreviewList);
    })
}

async function showCategories() {
    const data = await getDataFromApi('/genre/movie/list');
    const categories = data.genres;
    categories.forEach(category => {
        createCategoryElement(category, categoriesPreviewList);
    })

}

async function searchMovies(informacion = { query, clean, page }) {

    console.log("query:" + informacion.query);

    const data = await getDataFromApi(`/search/movie`, {
        params: {
            query: informacion.query,
            page: informacion.page
        }
    })
    const movies = data.results;

    if (informacion.clean) {
        cleanSection(genericSection);
    }

    movies.forEach(movie => {
        createMovieElement(movie, genericSection);
    })

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
    movies.forEach(movie => {
        createMovieElement(movie, relatedMoviesContainer);
    })
}

async function getMovieByCategory(informacion) {
    const data = await getDataFromApi(`/discover/movie`, {
        params: {
            with_genres: informacion.idNumber,
            page: informacion.page
        }
    });

    const results = data.results;
    if (informacion.clean) {
        console.log("entra al clean")
        cleanSection(genericSection);
    }

    headerCategoryTitle.innerHTML = informacion.genderMovie
    results.forEach(movie => createMovieElement(movie, genericSection));
    loadNextPageIfPossible(informacion, data, genericSection, getMovieByCategory);
}

async function renderTrendingMoviesSection(informacion = { page: 1, clean: true }) {
    const data = await getDataFromApi(`/trending/movie/week`, {
        params: {
            page: informacion.page
        }
    });
    const results = data.results;

    if (informacion.clean) {
        cleanSection(genericSection);
    }

    results.forEach(movie => {
        createMovieElement(movie, genericSection);
    })

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

function cleanSection(section) {
    while (section.firstChild) {
        section.removeChild(section.firstChild);
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
    movieArray.forEach(movie => {
        createMovieElement(movie, likedMoviesContainer);
    })
}

function scrollToTop() {
    window.scrollTo({
        top: 0
    });
}

function getIdFromLocation() {
    const generalId = location.hash.split('=')[1];
    const [idNumber, genderMovie] = generalId.split('-');
    return { idNumber, genderMovie };
}

function isLoadedInfoAPI() {
    return categoriesPreviewList.children.length;
}


//--- end functions

//--- create elements to render
function createMovieElement(movie, insertUbication) {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');
    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.classList.add('backgrondImage-skeleton-img');

    if (movie.poster_path !== null) {
        movieImg.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        movieImg.alt = movie.title;
    } else {
        movieImg.src = `https://via.placeholder.com/300x450/5c218a/ffffff?text=${movie.title}`;
        movieImg.alt = 'No image available';
    }

    movieImg.setAttribute('data-img', movieImg.src);
    movieImg.addEventListener('click', () => {
        location.hash = `#movie=${movie.id}`;
    });
    
    const movieButton = document.createElement('button');
    movieButton.classList.add('movie-btn');

    if (likedMoviesList()[movie.id]) {
        movieButton.classList.add('movie-button--liked');
    }

    movieButton.addEventListener('click', () => {
        movieButton.classList.toggle('movie-button--liked');
        likeMovie(movie);
        getLikedMovies();
        showTrendingMovies();
    });

    lazyLoader.observe(movieImg);

    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieButton);
    insertUbication.appendChild(movieContainer);
}

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

//--- end create elements



