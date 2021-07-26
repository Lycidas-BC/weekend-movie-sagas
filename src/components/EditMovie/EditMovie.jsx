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
import TextField from '@material-ui/core/TextField';
import './EditMovie.css'

const useStyles = makeStyles((theme) => ({root: {flexGrow: 1},paper: {padding: theme.spacing(2), textAlign: "center", color: theme.palette.text.secondary, justifyContent: "center" }})); // materialUI stuff

function EditMovie() {
    const classes = useStyles();
    const history = useHistory();
    const { movieId } = useParams();
    const dispatch = useDispatch();
    const movieDetails = useSelector(store => store.movieDetails);
    const genres = useSelector(store => store.genres);
    const [localMovieDetails, setLocalMovieDetails] = useState(movieDetails);
    const [editModeBooleans, setEditModeBooleans] = useState({
        title: false,
        poster: false,
        description: false
    });
    
    let localCopyInitialized = false;

    const saveEdits = () => {
        console.log(`in saveEdits`, movieId);
    }

    const goHome = () => {
        history.push(`/`);
    }

    useEffect(() => {
        dispatch({ type: 'FETCH_MOVIE_DETAILS', payload: {id: movieId} });
        dispatch({ type: 'FETCH_GENRES' });
    }, []);

    console.log("movie details:", movieDetails, "genres:", genres);
    return (
        <section>
            <h1>Movie Details</h1>
            <Grid item style={{height: "100%", width: "75%", margin: "auto" }}  id={movieDetails.id}>
                <Paper className={classes.paper}>
                    {
                        editModeBooleans.title ?
                        <TextField></TextField> :
                        <h2 style={{ color: "black" }}> <Button><EditIcon></EditIcon></Button> {movieDetails.title}</h2>
                    }
                    {
                        editModeBooleans.poster ?
                        <TextField></TextField> :
                        <div style={{ display: "flex", alignContent: "flex-start", margin: "auto", justifyContent: "center" }}>
                            <Button><EditIcon style={{color: "black", alignItems: "right" }}></EditIcon></Button>
                            <CardMedia
                                style={{maxHeight: "40%", maxWidth: "40%", padding: "10% 7% 10% 7%", backgroundImage: "url(../../images/frame.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" }}
                                className={movieDetails.title}
                                component="img"
                                alt={movieDetails.title}
                                src={`../../${movieDetails.poster}`}
                                title={movieDetails.title}
                            />
                        </div>
                    }
                    {
                        editModeBooleans.description ?
                        <TextField></TextField> :
                        <div style={{color: "black", textAlign: "left", margin: "20px"}}> <Button><EditIcon></EditIcon></Button> <b>Description:</b> {movieDetails.description}</div>
                    }
                    <div style={{color: "black", textAlign: "left", margin: "20px"}}>
                        <b>Genres:</b>
                        <ul>
                            {movieDetails.genreList.map((genre, index) => {
                                return (
                                    <li key={index}>{genre} <Button><DeleteIcon></DeleteIcon></Button></li>
                                )
                            })}
                            <li><Button><AddIcon></AddIcon></Button></li>
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