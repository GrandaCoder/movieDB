searchFormBtn.addEventListener('click', () => {
    location.hash = `#search=${searchFormInput.value}`
})

trendingBtn.addEventListener('click', () => {
    location.hash = '#trending'
})

arrowBtn.addEventListener('click', () => {
    // get location hast 
    const hash = location.hash.split('=')[0];
    if (hash != '#search') {
        homePage();
    } else {
        history.go(-2);
    }
})

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {
    console.log("entra al navigator")

    if (location.hash.startsWith("#trending")) {
        trendingPage();
    } else if (location.hash.startsWith("#search=")) {
        searchPage();
    } else if (location.hash.startsWith("#movie=")) {
        moviePage();
    } else if (location.hash.startsWith("#category=")) {
        categoryPage();
    } else {
        homePage();
    }

    scrollToTop();
}


function trendingPage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    renderTrendingMoviesSection();
    // scrollToTop();
}

function searchPage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = ''
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white')
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive')

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    const query = location.hash.split('=')[1];
    getMovieBySearch(query);
}



function moviePage() {
    headerSection.classList.add('header-container--long');
    // headerSection.style.background = ''
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white')
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive')

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

    trendingPreviewSection.classList.add('inactive')
    categoriesPreviewSection.classList.add('inactive')
    genericSection.classList.remove('inactive')
    movieDetailSection.classList.add('inactive')

    const { idNumber, genderMovie } = getIdFromLocation();
    getMovieByCategory(idNumber, genderMovie);
    // scrollToTop();
}

function getIdFromLocation() {
    const generalId = location.hash.split('=')[1];
    const [idNumber, genderMovie] = generalId.split('-');
    return { idNumber, genderMovie };
}


function homePage() {

    //quiere decir que esta en el home y no es necesario actualizar la pagina
    const hash = location.hash.split('=')[0]
    if (hash != '') {
        location.hash = `#home`
    }

    headerSection.style.background = '';
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = ''
    arrowBtn.classList.add('inactive');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive')
    trendingPreviewSection.classList.remove('inactive')
    categoriesPreviewSection.classList.remove('inactive')
    genericSection.classList.add('inactive')
    movieDetailSection.classList.add('inactive')

    if (!isLoadedInfoAPI()) {
        showTrendingMovies();
        showCategories();
    }
}

function isLoadedInfoAPI() {
    const childrenCategoriesPreview = Array.from(categoriesPreviewList.children);
    return childrenCategoriesPreview.length
}

async function getMovieByCategory(id, genderMovie = 'all', currentPage = 1) {

    const data = await getDataFromApi(`/discover/movie`, {
        params: {
            with_genres: id,
            page: currentPage
        }
    });
    const results = data.results;
    genericSection.innerHTML = ''
    headerCategoryTitle.innerHTML = genderMovie
    results.forEach(movie => {
        createMovieElement(movie, genericSection);
    })

    //creamos un elemento de carga para que muestre el siguiente page
    console.log('getMoviecategory');
    loadNextPageIfPossible(currentPage+1, data, genericSection, getMovieByCategory);
}

async function renderTrendingMoviesSection(currentPage = 1, clean = true) {
    const data = await getDataFromApi(`/trending/movie/week`, {
        params: {
            page: currentPage
        }
    });
    const results = data.results;

    if (clean) {
        cleanSection(genericSection);
    }

    results.forEach(movie => {
        createMovieElement(movie, genericSection);
    })

    //creamos un elemento de carga para que muestre el siguiente page
    loadNextPageIfPossible(currentPage, data, genericSection, renderTrendingMoviesSection);
}

// function loadNextPageIfPossible(currentPage, data, Section) {
//     if (currentPage <= data.total_pages) {
//       console.log('cargando siguiente page');
//       const loadingElement = createLoadingElement();
//       Section.appendChild(loadingElement);
//       loadNextPage(loadingElement, currentPage);
//     }
//   }
  

// function createLoadingElement() {
//     const divider = document.createElement('div');
//     divider.classList.add('divider');
//     divider.innerHTML = 'Loading more...';
//     return divider;
// }

// function loadNextPage(endOfContainer,currentPage) {
//     // const element = document.getElementById('mi-div');

//     const observer = new IntersectionObserver(
//         (entries) => {
//             entries.forEach((entry) => {
//                 if (entry.isIntersecting) {
//                     renderTrendingMoviesSection(currentPage + 1, false);
//                     endOfContainer.remove();
//                 }
//             });
//         },
//         {
//             threshold: 1,
//         }
//     );

//     observer.observe(endOfContainer);
// }

