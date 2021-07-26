import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MovieItem from '../MovieItem/MovieItem';
import './MovieList.css'

function MovieList() {

    const dispatch = useDispatch();
    const movies = useSelector(store => store.movies);

    useEffect(() => {
        dispatch({ type: 'FETCH_MOVIES' });
    }, []);

    return (
        <main>
            <h1>MovieList</h1>
            <section className="movies" style={{ alignItems: "flex-end" }}>
                {movies.map(movie => {
                    return (
                        <MovieItem key={movie.id} movieIn={movie}></MovieItem>
                    );
                })}
            </section>
        </main>

    );
}

export default MovieList;