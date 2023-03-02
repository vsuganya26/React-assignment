import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import IMovie from "../../model/IMovie";
import { addMovie,  deleteMovieById, getHigestMovieId, getMovieByTitle } from "../../services/movies";
import Rating from "../common/Rating";

type Props = {
    movie: IMovie
    path: string
    onRemove:(title:string) => void
};

const MovieListItem = ( { movie, path, onRemove } : Props ) => {
    const toastTimeout = 2000;
    const isFavouritePage = path === "favourite";

    const { id, title, storyline, ratings, posterurl } = movie;

    const average = (arr : number[]) => arr.reduce((a,b) => a + b, 0) / arr.length;
    var rating = parseInt(average(ratings).toFixed(2), 10) / 2;

    var cardText = storyline.length > 100 ? storyline.substring(0, 100) + '...' : storyline;

    var toPath = `${path}/${title}`

    const addMovieToFavourite = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            const movieByTitle = await getMovieByTitle("favourite", movie.title);
            if (movieByTitle !== null){
                toast.error("Already added in favourite!", { autoClose: toastTimeout })
                return;
            }

            const highestId = await getHigestMovieId("favourite");
            movie.id = highestId + 1;
            await addMovie("favourite", movie);
            toast.success("Successfully added in favourite!", { autoClose: toastTimeout })
        }
        catch (errormsg : any) {
            toast.error("Failed to add the movie!", { autoClose: toastTimeout })
        }
    };

    const removeMovieFromFavourite = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            if (movie.id === null){
                toast.warn("Deletion of a movie without id not implemented");
            }
            const data = await deleteMovieById("favourite", movie.id);
            toast.success("Successfully removed from favourite!", { autoClose: toastTimeout })
            onRemove(movie.title);
        }
        catch (errormsg : any) {
            toast.error("Failed to remove from favourite", { autoClose: toastTimeout })
        }
    };

    const history = useHistory();
  
    const routeChange = () =>{
        history.push(toPath);
    }

    return (
        <Card className="shadow-sm mb-5 bg-white rounded" style={{ width: '18rem' }}>
            <Card.Img variant="top" height={350} src={`${posterurl}`} alt={`${title} Movie Poster`} onClick={routeChange}/>
            <Card.Header className="text-md text-center font-weight-bold" onClick={routeChange}>
                {title}
            </Card.Header>
            <Card.Body onClick={routeChange}>
                <Card.Title className="d-flex justify-content-between">
                    <div className="text-xs">
                        <div>
                            <Rating rating={rating}/>
                            {rating} ({ratings.length} rated)
                        </div>
                    </div>
                </Card.Title>
                <Card.Text>
                    <span>
                        <strong>Story Line</strong>: {cardText}
                    </span>
                </Card.Text>
            </Card.Body>
            <Card.Footer className="text-center">
                <Button hidden={isFavouritePage} onClick={addMovieToFavourite} variant="primary">Add to favourite</Button>
                <Button hidden={!isFavouritePage} onClick={removeMovieFromFavourite} variant="danger">Remove from favourite</Button>
            </Card.Footer>
        </Card>
    );
};

export default MovieListItem