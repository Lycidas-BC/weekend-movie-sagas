const blankMovieObject = {
  id: "",
  title: "",
  poster: "",
  description: "",
  genreList: []
};

// Used to store movies returned from the server
const movieDetails = (state = blankMovieObject, action) => {
  switch (action.type) {
      case 'SET_MOVIE_DETAILS':
          return action.payload;
      default:
          return state;
  }
}
  
export default movieDetails;