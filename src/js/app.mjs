import {
    navigator,
    homePage
} from "./routes/navigation.mjs";
import {searchFormBtn,
    searchFormInput, 
    trendingBtn,
    arrowBtn,
    selectLanguage,
    labelSelectLanguage,
    trendingPreviewTitle,
    categoriesPreviewtitle,
    likedtitle,
    footer,
    headerCategoryTitle,
    relatedMoviestitle
} from "./utils/getNodes.mjs";

import {
    getTranslation
} from "./language/selectLanguage.mjs";

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

//-- load language
const previouslySelectedLanguage = localStorage.getItem('language');
if (previouslySelectedLanguage) {
    selectLanguage.value = previouslySelectedLanguage;
}
selectLanguage.addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    localStorage.setItem('language', selectedLanguage);
    location.reload();
});

let language = previouslySelectedLanguage || 'es';

labelSelectLanguage.textContent = getTranslation(language, "selectLanguage");
trendingBtn.textContent = getTranslation(language, "loadMore");
trendingPreviewTitle.textContent = getTranslation(language, "trends");
headerCategoryTitle.textContent = getTranslation(language, "trends");
categoriesPreviewtitle.textContent = getTranslation(language, "categorys");
likedtitle.textContent = getTranslation(language, "favoritesMovies");
footer.textContent = getTranslation(language, "author");
relatedMoviestitle.textContent = getTranslation(language, "relatedMovies");



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
//--- end listeners

const API_KEY = '54aae79ca27848ab627616cec3c45480';

const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: API_KEY,
    language: language
  }
});

export {instance, language};

