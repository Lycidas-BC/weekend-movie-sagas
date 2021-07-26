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
import CancelIcon from '@material-ui/icons/Cancel';
import DoneIcon from '@material-ui/icons/Done';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Select from '@material-ui/core/Select';
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
    const [genreToAdd, setGenreToAdd] = useState(0);
    const [editModeBooleans, setEditModeBooleans] = useState({
        title: false,
        poster: false,
        description: false,
        addGenre: false
    });
    let localCopyInitialized = false;

    const addGenre = () => {
        console.log('In addGenre', genreToAdd, genres[genreToAdd].name);
        //create local copies arrays to update
        let newGenreList = localMovieDetails.genreList;
        let newGenreIdList = localMovieDetails.genreIdList;
        //add id of new genre to local genre id list
        newGenreIdList.push(genreToAdd);
        //get genre name that corresponds to genre id and add it to local genre list
        const genreObject = genres.filter(obj => {
            return obj.id === genreToAdd
          })
        newGenreList.push(genreObject[0].name);
        //update state
        setLocalMovieDetails(oldState => ({ ...oldState, genreList: newGenreList, genreIdList: newGenreIdList}));
        //display new array
        toggleEditMode("addGenre");
    }

    const removeGenre = (indexToRemove) => {
        console.log("In removeGenre", indexToRemove);
        //create local copies arrays to update
        let newGenreList = localMovieDetails.genreList;
        newGenreList.splice(indexToRemove, 1);
        let newGenreIdList = localMovieDetails.genreIdList;
        newGenreIdList.splice(indexToRemove, 1);
        //update state
        setLocalMovieDetails(oldState => ({ ...oldState, genreList: newGenreList, genreIdList: newGenreIdList}));
    }

    const handleChange = (event) => {
        setGenreToAdd(Number(event.target.value));
    }

    const initializeLocalCopy = () => {
        if (!localCopyInitialized) {
            //localMovieDetails is updating before dispatch has time to load movieDetails
            //so, on the first call to an edit button, I'm making sure it's initialized
            setLocalMovieDetails(movieDetails);
            localCopyInitialized = true;
        }
    }

    const toggleEditMode = (valueToToggle) => {
        initializeLocalCopy();
        switch (valueToToggle) {
            case "title":
                setEditModeBooleans(oldState => ({ ...oldState, title: !oldState.title}));
                break;
            case "poster":
                setEditModeBooleans(oldState => ({ ...oldState, poster: !oldState.poster}));
                break;
            case "description":
                setEditModeBooleans(oldState => ({ ...oldState, description: !oldState.description}));
                break;
            case "addGenre":
                setEditModeBooleans(oldState => ({ ...oldState, addGenre: !oldState.addGenre}));
                break;
            default:
                break;
        }
        console.log("editModeBooleans", editModeBooleans);
    }

    const handleEdit = (valueToToggle) => {
        initializeLocalCopy();
        switch (valueToToggle) {
            case "title":
                setLocalMovieDetails(oldState => ({ ...oldState, title: !oldState.title}));
                break;
            case "poster":
                setLocalMovieDetails(oldState => ({ ...oldState, poster: !oldState.poster}));
                break;
            case "description":
                setLocalMovieDetails(oldState => ({ ...oldState, description: !oldState.description}));
                break;
            default:
                break;
        }
        console.log("handleEdit", setLocalMovieDetails);
    }

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

    console.log("movie details:", movieDetails, "genres:", genres, 'localDetails:', localMovieDetails);
    return (
        <section>
            <h1>Movie Details</h1>
            <Grid item style={{height: "100%", width: "75%", margin: "auto" }}  id={movieDetails.id}>
                <Paper className={classes.paper}>
                    {
                        editModeBooleans.title ?
                        <div>
                            <Button onClick={() => toggleEditMode("title")}><CancelIcon></CancelIcon></Button>
                            <TextField value={localMovieDetails.title}></TextField>
                            <Button onClick={() => toggleEditMode("title")}><DoneIcon></DoneIcon></Button>
                        </div> :
                        <h2 style={{ color: "black" }}> <Button onClick={() => toggleEditMode("title")}><EditIcon></EditIcon></Button> {localCopyInitialized ? localMovieDetails.title : movieDetails.title}</h2>
                    }
                    {
                        editModeBooleans.poster ?
                        <div>
                            <Button onClick={() => toggleEditMode("poster")}><CancelIcon style={{color: "black", alignItems: "right" }}></CancelIcon></Button>
                            <TextField placeholder="New poster URL"></TextField>
                            <Button onClick={() => toggleEditMode("poster")}><DoneIcon></DoneIcon></Button>
                        </div> :
                        <div style={{ display: "flex", alignContent: "flex-start", margin: "auto", justifyContent: "center" }}>
                            <Button onClick={() => toggleEditMode("poster")}><EditIcon style={{color: "black", alignItems: "right" }}></EditIcon></Button>
                            <CardMedia
                                style={{maxHeight: "40%", maxWidth: "40%", padding: "10% 7% 10% 7%", backgroundImage: "url(../../images/frame.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" }}
                                className={movieDetails.title}
                                component="img"
                                alt={movieDetails.title}
                                src={localCopyInitialized ? localMovieDetails.poster : `../../${movieDetails.poster}`}
                                title={movieDetails.title}
                            />
                        </div>
                    }
                    {
                        editModeBooleans.description ?
                        <div>
                            <Button onClick={() => toggleEditMode("description")} style={{width: "10%"}}><CancelIcon></CancelIcon></Button>
                            <TextareaAutosize value={localMovieDetails.description} minRows={3} style={{width: "70%"}}></TextareaAutosize>
                            <Button onClick={() => toggleEditMode("description")} style={{width: "10%"}}><DoneIcon></DoneIcon></Button>
                        </div> :
                        <div style={{color: "black", textAlign: "left", margin: "20px"}}> <Button onClick={() => toggleEditMode("description")}><EditIcon></EditIcon></Button> <b>Description:</b> {localCopyInitialized ? localMovieDetails.description : movieDetails.description}</div>
                    }
                    <div style={{color: "black", textAlign: "left", margin: "20px"}}>
                        <b>Genres:</b>
                        <ul>
                            {(localCopyInitialized ? localMovieDetails.genreList : movieDetails.genreList).map((genre, index) => {
                                return (
                                    <li key={index}>{genre} <Button onClick={() => removeGenre(index)}><DeleteIcon></DeleteIcon></Button></li>
                                )
                            })}
                            {
                                editModeBooleans.addGenre ?
                                <div>
                                    <Button onClick={() => toggleEditMode("addGenre")}><CancelIcon></CancelIcon></Button>
                                    <Select
                                    native
                                    value={genreToAdd}
                                    onChange={handleChange}
                                    inputProps={{
                                        name: 'genre'
                                    }}
                                    >
                                        {genres.map((genre, index) => {
                                            return (<option key={index} value={genre.id}>{genre.name}</option>)
                                        })}
                                    </Select>
                                    <Button onClick={() => addGenre()}><AddIcon></AddIcon></Button>
                                </div> :
                                <li><Button onClick={() => toggleEditMode("addGenre")}><AddIcon></AddIcon></Button></li>
                            }
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