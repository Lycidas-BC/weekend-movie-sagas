import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './MovieDetails.css'

function MovieDetails() {
    const { movieId } = useParams();
    const dispatch = useDispatch();
    const movieDetails = useSelector(store => store.movieDetails);

    useEffect(() => {
        dispatch({ type: 'FETCH_MOVIE_DETAILS', payload: {id: movieId} });
    }, []);

    console.log("movie details:", movieDetails);
    return (
        <main>
            <h1>Movie Details</h1>
            <h2>movie Id: {movieId}</h2>
        </main>
    );
}

export default MovieDetails;