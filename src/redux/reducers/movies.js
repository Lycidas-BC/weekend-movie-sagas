// Used to store movies returned from the server
const movies = (state = [], action) => {
  switch (action.type) {
      case 'SET_MOVIES':
          return action.payload;
      default:
          return state;
  }
}
  
export default movies;