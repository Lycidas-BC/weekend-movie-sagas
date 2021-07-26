import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './MovieDetails.css'

function MovieDetails() {
    const { movieId } = useParams();
    const dispatch = useDispatch();
    // const movies = useSelector(store => store.movies);

    return (
        <main>
            <h1>MovieDetails</h1>
            <h2>movie Id: {movieId}</h2>
        </main>
    );
}

export default MovieDetails;