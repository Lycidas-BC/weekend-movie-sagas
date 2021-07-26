import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import MovieList from '../MovieList/MovieList';
import MovieDetails from '../MovieDetails/MovieDetails';
import AddMovie from '../AddMovie/AddMovie';
import EditMovie from '../EditMovie/EditMovie';
import Administration from '../Administration/Administration';




function App() {
  
  return (
    <div className="App">
      <Router>        
        <Route path="/" exact>
          <MovieList />
        </Route>
        <Route path="/details/:movieId" exact>
          <MovieDetails />
        </Route>
        <Route path="/add_movie" exact>
          <AddMovie />
        </Route>
        <Route path="/edit_movie/:movieId" exact>
          <EditMovie />
        </Route>
        <Route path="/administration" exact>
          <Administration />
        </Route>
      </Router>
    </div>
  );
}


export default App;
