import {
    navigator,
    homePage
} from "./routes/navigation.mjs";
import {searchFormBtn,
    searchFormInput, 
    trendingBtn,
    arrowBtn,
} from "./utils/getNodes.mjs";

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

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
//--- end listeners

const API_KEY = '54aae79ca27848ab627616cec3c45480';
const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: API_KEY
  }
});

export {instance}

