import * as getNode from '../utils/getNodes.mjs';
import scrollToTop from "../utils/scroll.mjs";
import {
    renderTrendingMoviesSection,
    searchMovies,
    getMovieById,
    getMovieByCategory,
    searchTrendingMovies,
    searchCategories,
    getLikedMovies,
    getIdFromLocation,
    isLoadedInfoAPI
} from '../utils/components.mjs';


function navigator() {
    const hash = location.hash;
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
    getNode.headerSection.style.background = ''
    getNode.headerSection.classList.remove('header-container--long');
    getNode.arrowBtn.classList.remove('inactive');
    getNode.arrowBtn.classList.remove('header-arrow--white')
    getNode.headerCategoryTitle.classList.remove('inactive');
    getNode.headerTitle.classList.add('inactive');
    getNode.searchForm.classList.add('inactive')

    getNode.likedMoviesSection.classList.add('inactive')
    getNode.trendingPreviewSection.classList.add('inactive')
    getNode.categoriesPreviewSection.classList.add('inactive')
    getNode.genericSection.classList.remove('inactive')
    getNode.movieDetailSection.classList.add('inactive')

    getNode.headerCategoryTitle.textContent = 'Trending';
    renderTrendingMoviesSection();
}

function searchPage() {
    getNode.headerSection.classList.remove('header-container--long');
    getNode.headerSection.style.background = ''
    getNode.arrowBtn.classList.remove('inactive');
    getNode.arrowBtn.classList.remove('header-arrow--white')
    getNode.headerTitle.classList.add('inactive');
    getNode.headerCategoryTitle.classList.add('inactive');
    getNode.searchForm.classList.remove('inactive')

    getNode.likedMoviesSection.classList.add('inactive')
    getNode.trendingPreviewSection.classList.add('inactive')
    getNode.categoriesPreviewSection.classList.add('inactive')
    getNode.genericSection.classList.remove('inactive')
    getNode.movieDetailSection.classList.add('inactive')

    const query = location.hash.split('=')[1];
    searchMovies({ query, page: 1, clean: true });
}



function moviePage() {
    getNode.headerSection.classList.add('header-container--long');
    getNode.arrowBtn.classList.remove('inactive');
    getNode.arrowBtn.classList.add('header-arrow--white')
    getNode.headerTitle.classList.add('inactive');
    getNode.headerCategoryTitle.classList.add('inactive');
    getNode.searchForm.classList.add('inactive')

    getNode.likedMoviesSection.classList.add('inactive')
    getNode.trendingPreviewSection.classList.add('inactive')
    getNode.categoriesPreviewSection.classList.add('inactive')
    getNode.genericSection.classList.add('inactive')
    getNode.movieDetailSection.classList.remove('inactive')

    const { idNumber } = getIdFromLocation();
    getMovieById(idNumber);
}

function categoryPage() {
    getNode.headerSection.classList.remove('header-container--long');
    getNode.headerSection.style.background = ''
    getNode.arrowBtn.classList.remove('inactive');
    getNode.arrowBtn.classList.remove('header-arrow--white')
    getNode.headerTitle.classList.add('inactive');
    getNode.headerCategoryTitle.classList.remove('inactive');
    getNode.searchForm.classList.remove('inactive')

    getNode.likedMoviesSection.classList.add('inactive')
    getNode.trendingPreviewSection.classList.add('inactive')
    getNode.categoriesPreviewSection.classList.add('inactive')
    getNode.genericSection.classList.remove('inactive')
    getNode.movieDetailSection.classList.add('inactive')

    const { idNumber, genderMovie } = getIdFromLocation();
    getMovieByCategory({ idNumber, genderMovie, page: 1, clean: true });
}


function homePage() {
    const hash = location.hash.split('=')[0];
    if (hash) location.hash = '#home';

    getNode.headerSection.style.background = '';
    getNode.headerSection.classList.remove('header-container--long');
    getNode.arrowBtn.classList.add('inactive');
    getNode.headerTitle.classList.remove('inactive');
    getNode.headerCategoryTitle.classList.add('inactive');
    getNode.searchForm.classList.remove('inactive');
    getNode.likedMoviesSection.classList.remove('inactive');
    getNode.trendingPreviewSection.classList.remove('inactive');
    getNode.categoriesPreviewSection.classList.remove('inactive');
    getNode.genericSection.classList.add('inactive');
    getNode.movieDetailSection.classList.add('inactive');

    if (!isLoadedInfoAPI(getNode.categoriesPreviewList)) {
        searchTrendingMovies();
        searchCategories();
    }
    getLikedMovies();
}

export  {navigator, homePage};




