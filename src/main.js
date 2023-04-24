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

//carga las listas de las categorias
async function showCategories(){
    const data = await getDataFromApi('/genre/movie/list');
    const categories = data.genres;
    categories.forEach(category => {
        createCategoryElement(category);
    })
}

//crea un elemento de categoria para renderizar
function createMovieElement(movie, insertUbication){
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');
    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
    movieImg.alt = movie.title;
    movieContainer.appendChild(movieImg);

    // trendingMoviesPreviewList.appendChild(movieContainer);
    insertUbication.appendChild(movieContainer);
}

//crea las listas
function createCategoryElement(category){
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
    categoriesPreviewList.appendChild(categoryContainer);
}

function scrollToTop() {
    window.scrollTo({
        top: 0
    });
}






