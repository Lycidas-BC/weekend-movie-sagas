import { takeEvery, put, call} from 'redux-saga/effects';
import axios from 'axios';

function* fetchAllGenres() {
    // get all genres from the DB
    try {
        const genres = yield axios.get('/api/genre');
        console.log('get all:', genres.data);
        yield put({ type: 'SET_GENRES', payload: genres.data });

    } catch(error) {
        console.log('get all error', error);
    }
}

function* fetchAllMovies() {
    // get all movies from the DB
    try {
        const movies = yield axios.get('/api/movie');
        console.log('get all:', movies.data);
        yield put({ type: 'SET_MOVIES', payload: movies.data });

    } catch(error) {
        console.log('get all error', error);
    }
}

function* fetchMovieDetails(action) {
    // get movie details
    try {
        const movieDetails = yield axios.get(`/api/movie/details/${action.payload.id}`);
        yield put({ type: 'SET_MOVIE_DETAILS', payload: movieDetails.data[0] });

    } catch(error) {
        console.log('GET details error', error);
    }
}

function* updateMovieDetails(action) {
    // get movie details
    try {
        yield call(axios.put(`/api/movie/${action.payload.id}`, action.payload));
    } catch(error) {
        console.log('PUT details error', error);
    }
}

function* addMovie(action) {
    // get movie details
    try {
        yield call(axios.post(`/api/movie`, action.payload));
    } catch(error) {
        console.log('POST details error', error);
    }
}

// Create the rootSaga generator function
export function* rootSaga() {
    yield takeEvery('FETCH_GENRES', fetchAllGenres);
    yield takeEvery('FETCH_MOVIES', fetchAllMovies);
    yield takeEvery('FETCH_MOVIE_DETAILS', fetchMovieDetails);
    yield takeEvery('UPDATE_MOVIE_DETAILS', updateMovieDetails);
    yield takeEvery('ADD_MOVIE', addMovie);
}