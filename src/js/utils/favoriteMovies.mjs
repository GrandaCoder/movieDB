
function likeMovie(movie){
    const likedMovies = likedMoviesList();
    if(!likedMovies[movie.id]){
      likedMovies[movie.id] = movie;
    }else{
      delete likedMovies[movie.id];
      
    }
    const likedMoviesJSON = JSON.stringify(likedMovies); // almacenamos el valor devuelto en una variable
    localStorage.setItem('likedMovies', likedMoviesJSON);
    console.log(likedMovies);
  }
  
  function likedMoviesList(){
    const item = localStorage.getItem('likedMovies');
    return item ? JSON.parse(item) : {};
  }

  export  {
    likedMoviesList,
    likeMovie
  }
  