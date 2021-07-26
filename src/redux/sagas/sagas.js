import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';

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

// Create the rootSaga generator function
export function* rootSaga() {
    yield takeEvery('FETCH_MOVIES', fetchAllMovies);
}