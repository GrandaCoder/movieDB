//--- general listeners
searchFormBtn.addEventListener('click', () => {
    location.hash = `#search=${searchFormInput.value}`
})

trendingBtn.addEventListener('click', () => {
    location.hash = '#trending'
})

arrowBtn.addEventListener('click', () => {
    const hash = location.hash.split('=')[0];
    if (hash != '#search') {
        homePage();
    } else {
        history.go(-2);
    }
})

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

//--- end listeners

function navigator() {
    const hash = location.hash;
    console.log("entra al navigator");

    switch (true) {
        case hash.startsWith("#trending"):
            trendingPage();
            break;
        case hash.startsWith("#search="):
            searchPage();
            break;
        case hash.startsWith("#movie="):
            moviePage();
            break;
        case hash.startsWith("#category="):
            categoryPage();
            break;
        default:
            homePage();
    }
    scrollToTop();
}



function trendingPage() {
    headerSection.style.background = ''
    headerSection.classList.remove('header-container--long');
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white')
    headerCategoryTitle.classList.remove('inactive');
    headerTitle.classList.add('inactive');
    searchForm.classList.add('inactive')

    likedMoviesSection.classList.add('inactive')
    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    renderTrendingMoviesSection();
}

function searchPage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive')

    likedMoviesSection.classList.add('inactive')
    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    const query = location.hash.split('=')[1];
    searchMovies({ query, page: 1, clean: true });
}



function moviePage() {
    headerSection.classList.add('header-container--long');
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white')
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive')

    likedMoviesSection.classList.add('inactive')
    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.add('inactive')
    movieDetailSection.classList.remove('inactive')

    const { idNumber } = getIdFromLocation();
    getMovieById(idNumber);
}

function categoryPage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.remove('inactive')

    likedMoviesSection.classList.add('inactive')
    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    const { idNumber, genderMovie } = getIdFromLocation();
    getMovieByCategory({ idNumber, genderMovie, page: 1, clean: true });
}


function homePage() {
    const hash = location.hash.split('=')[0];
    if (hash) location.hash = '#home';

    headerSection.style.background = '';
    headerSection.classList.remove('header-container--long');
    arrowBtn.classList.add('inactive');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');
    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    if (!isLoadedInfoAPI()) {
        showTrendingMovies();
        showCategories();
    }
    getLikedMovies();
}






