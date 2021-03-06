import React, { useState, useEffect } from 'react';
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
import './AddMovie.css'

const useStyles = makeStyles((theme) => ({root: {flexGrow: 1},paper: {padding: theme.spacing(2), textAlign: "center", color: theme.palette.text.secondary, justifyContent: "center" }})); // materialUI stuff

const blankMovieObject = {
    id: "",
    title: "",
    poster: "",
    description: "",
    genreList: [],
    genreIdList: []
  };

function AddMovie() {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const genres = useSelector(store => store.genres);
    const [localMovieDetails, setLocalMovieDetails] = useState(blankMovieObject);
    const [genreToAdd, setGenreToAdd] = useState(1);
    const [tempTitle, setTempTitle] = useState("");
    const [tempPoster, setTempPoster] = useState("");
    const [tempDescription, setTempDescription] = useState("");
    const [editModeBooleans, setEditModeBooleans] = useState({
        title: true,
        poster: true,
        description: true,
        addGenre: false
    });

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

    const toggleEditMode = (valueToToggle) => {
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

    const cancelEdit = (editToCancel) => {
        console.log('editToCancel',editToCancel, localMovieDetails);
        switch (editToCancel) {
            case "title":
                setTempTitle(localMovieDetails.title);
                toggleEditMode("title");
                break;
            case "poster":
                setTempPoster(localMovieDetails.poster);
                toggleEditMode("poster");
                break;
            case "description":
                setTempDescription(localMovieDetails.description);
                toggleEditMode("description");
                break;
            default:
                break;
        }
    }

    const handleEdit = (fieldToHandle) => {
        console.log('fieldToHandle',fieldToHandle, localMovieDetails,[tempTitle],[tempPoster],[tempDescription]);
        switch (fieldToHandle) {
            case "title":
                console.log("tempTitle",tempTitle);
                setLocalMovieDetails(oldState => ({ ...oldState, title: tempTitle}));
                toggleEditMode("title");
                break;
            case "poster":
                setLocalMovieDetails(oldState => ({ ...oldState, poster: tempPoster}));
                toggleEditMode("poster");
                break;
            case "description":
                setLocalMovieDetails(oldState => ({ ...oldState, description: tempDescription}));
                toggleEditMode("description");
                break;
            default:
                break;
        }
    }

    const saveEdits = () => {
        console.log(`in saveEdits`);
        if (localMovieDetails.title.trim() !== ""){
            //only update movie if edits were made
            dispatch({ type: 'ADD_MOVIE', payload: {
                title: localMovieDetails.title,
                poster: localMovieDetails.poster,
                description: localMovieDetails.description,
                genre_ids: localMovieDetails.genreIdList
            } });
        }
        history.push(`/`);
    }

    const goHome = () => {
        history.push(`/`);
    }

    useEffect(() => {
        dispatch({ type: 'FETCH_GENRES' });
    }, []);

    console.log('localDetails:', localMovieDetails);
    return (
        <section>
            <h1>Movie Details</h1>
            <Grid item style={{height: "100%", width: "75%", margin: "auto" }}>
                <Paper className={classes.paper}>
                    {
                        editModeBooleans.title ?
                        <div>
                            <Button onClick={() => cancelEdit("title")}><CancelIcon></CancelIcon></Button>
                            <TextField value={tempTitle} onChange={(event) => setTempTitle(event.target.value)}></TextField>
                            <Button onClick={() => handleEdit("title")}><DoneIcon></DoneIcon></Button>
                        </div> :
                        <h2 style={{ color: "black" }}> <Button onClick={() => toggleEditMode("title")}><EditIcon></EditIcon></Button> {localMovieDetails.title}</h2>
                    }
                    {
                        editModeBooleans.poster ?
                        <div>
                            <Button onClick={() => cancelEdit("poster")}><CancelIcon style={{color: "black", alignItems: "right" }}></CancelIcon></Button>
                            <TextField placeholder="New poster URL" value={tempPoster} onChange={(event) => setTempPoster(event.target.value)}></TextField>
                            <Button onClick={() => handleEdit("poster")}><DoneIcon></DoneIcon></Button>
                        </div> :
                        <div style={{ display: "flex", alignContent: "flex-start", margin: "auto", justifyContent: "center" }}>
                            <Button onClick={() => toggleEditMode("poster")}><EditIcon style={{color: "black", alignItems: "right" }}></EditIcon></Button>
                            <CardMedia
                                style={{maxHeight: "40%", maxWidth: "40%", padding: "10% 7% 10% 7%", backgroundImage: "url(/images/frame.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" }}
                                className={localMovieDetails.title}
                                component="img"
                                alt={localMovieDetails.title}
                                src={localMovieDetails.poster}
                                title={localMovieDetails.title}
                            />
                        </div>
                    }
                    {
                        editModeBooleans.description ?
                        <div>
                            <Button onClick={() => cancelEdit("description")} style={{width: "10%"}}><CancelIcon></CancelIcon></Button>
                            <TextareaAutosize value={tempDescription} minRows={3} style={{width: "70%"}} onChange={(event) => setTempDescription(event.target.value)}></TextareaAutosize>
                            <Button onClick={() => handleEdit("description")} style={{width: "10%"}}><DoneIcon></DoneIcon></Button>
                        </div> :
                        <div style={{color: "black", textAlign: "left", margin: "20px"}}> <Button onClick={() => toggleEditMode("description")}><EditIcon></EditIcon></Button> <b>Description:</b> {localMovieDetails.description}</div>
                    }
                    <div style={{color: "black", textAlign: "left", margin: "20px"}}>
                        <b>Genres:</b>
                        <ul>
                            {(localMovieDetails.genreList).map((genre, index) => {
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
                        Add movie
                    </Button>
                </Paper>
            </Grid>
        </ section>
    );
}

export default AddMovie;