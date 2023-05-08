import {
    navigator,
    homePage
} from "./routes/navigation.mjs";
import * as getNode from "./utils/getNodes.mjs";

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

//--- general listeners
getNode.searchFormBtn.addEventListener('click', () => {
    location.hash = `#search=${getNode.searchFormInput.value}`
})

getNode.trendingBtn.addEventListener('click', () => {
    location.hash = '#trending'
})

getNode.arrowBtn.addEventListener('click', () => {
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

