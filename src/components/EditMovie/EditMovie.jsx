import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardMedia from '@material-ui/core/CardMedia';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import './EditMovie.css'

const useStyles = makeStyles((theme) => ({root: {flexGrow: 1},paper: {padding: theme.spacing(2), textAlign: "center", color: theme.palette.text.secondary, justifyContent: "center" }})); // materialUI stuff

function EditMovie() {
    const classes = useStyles();
    const history = useHistory();
    const { movieId } = useParams();
    const dispatch = useDispatch();
    const movieDetails = useSelector(store => store.movieDetails);
    const [localMovieDetails, setLocalMovieDetails] = useState(movieDetails);

    const saveEdits = () => {
        console.log(`in saveEdits`, movieId);
    }

    const goHome = () => {
        history.push(`/`);
    }

    useEffect(() => {
        dispatch({ type: 'FETCH_MOVIE_DETAILS', payload: {id: movieId} });
    }, []);

    console.log("movie details:", movieDetails);
    return (
        <section>
            <h1>Movie Details</h1>
            <Grid item style={{height: "100%", width: "75%", margin: "auto" }}  id={movieDetails.id}>
                <Paper className={classes.paper}>
                    <h2 style={{ color: "black" }}> <EditIcon></EditIcon> {movieDetails.title}</h2>
                    <div style={{ display: "flex", alignContent: "flex-start", margin: "auto", justifyContent: "center" }}>
                        <EditIcon style={{color: "black", alignItems: "right" }}></EditIcon>
                        <CardMedia
                            style={{maxHeight: "40%", maxWidth: "40%", padding: "10% 7% 10% 7%", backgroundImage: "url(../../images/frame.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" }}
                            className={movieDetails.title}
                            component="img"
                            alt={movieDetails.title}
                            src={`../../${movieDetails.poster}`}
                            title={movieDetails.title}
                        />
                    </div>
                    <div style={{color: "black", textAlign: "left", margin: "20px"}}> <EditIcon></EditIcon> <b>Description:</b> {movieDetails.description}</div>
                    <div style={{color: "black", textAlign: "left", margin: "20px"}}>
                        <b>Genres:</b>
                        <ul>
                            {movieDetails.genreList.map((genre, index) => {
                                return (
                                    <li key={index}>{genre} <DeleteIcon></DeleteIcon></li>
                                )
                            })}
                            <li><AddIcon></AddIcon></li>
                        </ul>
                    </div>
                    <br />
                    <Button
                        style={{ width: "45%", margin: "2%" }}
                        variant="contained"
                        color="primary"
                        onClick={() => goHome()}
                    >
                        Cancel
                    </Button>
                    <Button
                        style={{ width: "45%", margin: "2%" }}
                        variant="contained"
                        color="primary"
                        onClick={() => saveEdits()}
                    >
                        Save Edits
                    </Button>
                </Paper>
            </Grid>
        </ section>
    );
}

export default EditMovie;