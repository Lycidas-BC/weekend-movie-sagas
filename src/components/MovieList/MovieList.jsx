import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MovieItem from '../MovieItem/MovieItem';
import Select from '@material-ui/core/Select';
import './MovieList.css'

function MovieList() {
    const dispatch = useDispatch();
    const movies = useSelector(store => store.movies);
    const genres = useSelector(store => store.genres);
    // const [genreSelect, setGenreSelect] = useState(0);

    useEffect(() => {
        dispatch({ type: 'FETCH_MOVIES' });
        dispatch({ type: 'FETCH_GENRES' });
    }, []);

    const handleChange = (event) => {
        const genre = event.target.value;
        console.log("genre:", genre);
        if (Number(genre) === 0) {
            dispatch({ type: 'FETCH_MOVIES' });
        } else {
            dispatch({ type: 'FETCH_MOVIES_IN_GENRE', payload: {genre_id: genre} });
        }
    }

    return (
        <main>
            <h1>MovieList</h1>
            <header>
                <Select
                native
                onChange={handleChange}
                inputProps={{
                    name: 'genre'
                }}
                >
                    <option value={0}>Show All</option>
                    {genres.map((genre, index) => {
                        return (<option key={index} value={genre.id}>{genre.name}</option>)
                    })}
                </Select>
            </header>
            <section className="movies" style={{ alignItems: "flex-end" }}>
                {movies.map(movie => {
                    return (
                        <MovieItem key={movie.id} movieIn={movie} addMovieScreen={false} ></MovieItem>
                    );
                })}
                <MovieItem movieIn={"none"} addMovieScreen={true} ></MovieItem>
            </section>
        </main>

    );
}

export default MovieList;