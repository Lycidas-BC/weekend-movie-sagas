// Used to store the movie genres
const genres = (state = [], action) => {
  switch (action.type) {
      case 'SET_GENRES':
          return action.payload;
      default:
          return state;
  }
}
  
export default genres;