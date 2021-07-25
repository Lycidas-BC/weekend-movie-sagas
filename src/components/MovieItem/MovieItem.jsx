import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardMedia from '@material-ui/core/CardMedia';
import './MovieItem';

const useStyles = makeStyles((theme) => ({root: {flexGrow: 1},paper: {padding: theme.spacing(2), textAlign: "center", color: theme.palette.text.secondary}})); // materialUI stuff

function MovieItem({movieIn}) {
    const classes = useStyles();

    const movieDetails = () => {
        console.log(`Go to movie's details page`, movieIn);
        console.log('path:', movieIn.poster);
    };

    // <div key={movieIn.id} >
    //   <h3>{movieIn.title}</h3>
    //   <img src={movieIn.poster} alt={movieIn.title}/>
    //</div>

    return (
      <Grid item style={{height: "400px", width: "250px", display: "inline-block" }} id={movieIn.id}>
        <Paper className={classes.paper}>
            <h2>{movieIn.title}</h2>
        <CardMedia
        style={{maxHeight: "100%", maxWidth: "100%" }}
        className={movieIn.title}
        component="img"
        alt={movieIn.title}
        src={movieIn.poster}
        title={movieIn.title}
      />
          <br />
          <Button
            style={{ width: "180px", height: "42px" }}
            variant="contained"
            color="primary"
            onClick={() => movieDetails()}
          >
            See movie details
          </Button>
        </Paper>
      </Grid>
    );
};

export default MovieItem;