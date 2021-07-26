import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardMedia from '@material-ui/core/CardMedia';
import './MovieItem';

const useStyles = makeStyles((theme) => ({root: {flexGrow: 1},paper: {padding: theme.spacing(2), textAlign: "center", color: theme.palette.text.secondary, justifyContent: "center", alignItems: "flex-end" }})); // materialUI stuff

function MovieItem({movieIn, addMovieScreen}) {
    const classes = useStyles();
    const history = useHistory();
    if (addMovieScreen) {
      movieIn = {
        title: "New movie",
        poster: "/images/addImage.png"
      }
    }

    const movieDetails = () => {
        console.log(`Go to movie's details page`, movieIn);
        history.push(`/details/${movieIn.id}`);
    };

    const addMovie = () => {
      console.log(`Go to add movie page`);
      history.push("/add_movie");
  };

    return (
      <Grid item style={{height: "100%", width: "24%", padding: "20px 10px" }}  id={movieIn.id}>
        <Paper className={classes.paper}>
            <h2>{movieIn.title}</h2>
        <CardMedia
        style={{maxHeight: "80%", maxWidth: "80%", margin: "auto", padding: "10% 7% 10% 7%", backgroundImage: "url(images/frame.jpg)", backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" }}
        className={movieIn.title}
        component="img"
        alt={movieIn.title}
        src={movieIn.poster}
        title={movieIn.title}
      />
          <br />
          {
            addMovieScreen ?
            <Button
            style={{ width: "90%" }}
            variant="contained"
            color="primary"
            onClick={() => addMovie()}
          >
            Add movie
          </Button> :
          <Button
            style={{ width: "90%" }}
            variant="contained"
            color="primary"
            onClick={() => movieDetails()}
          >
            See movie details
          </Button>
          }
        </Paper>
      </Grid>
    );
};

export default MovieItem;