import { useEffect, useState } from "react";
import { useMovieContext } from "../../../../context/MovieContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./View.css";

function View() {
  const { movie, setMovie } = useMovieContext();
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (movieId) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
        })
        .catch((error) => {
          console.error(error);
          navigate("/");
        });
    }
  }, [movieId, setMovie, navigate]);

  useEffect(() => {
    if (movie && movie.photos && movie.photos.length > 1) {
      const photoInterval = setInterval(() => {
        setCurrentPhotoIndex((prevIndex) =>
          prevIndex === movie.photos.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);

      return () => clearInterval(photoInterval);
    }
  }, [movie]);

  return (
    <div className="view-container">
      {movie ? (
        <>
          <h1 className="movie-title">{movie.title}</h1>

          <div className="movie-details">
            <h3 className="movie-overview">{movie.overview}</h3>
          </div>

          {movie.photos && movie.photos.length > 0 && (
            <div className="section">
              <div className="photo-gallery">
                <img
                  src={movie.photos[currentPhotoIndex]?.url}
                  alt={`Movie Photo ${currentPhotoIndex + 1}`}
                  className="rounded-image"
                />
              </div>
            </div>
          )}

          {movie.casts && movie.casts.length > 0 && (
            <div className="section">
              <h2>Cast & Crew</h2>
              <ul className="cast-list">
                {movie.casts.map((cast, index) => (
                  <li key={index} className="cast-item">
                    {cast.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {movie.videos && movie.videos.length > 0 && (
            <div className="section">
              <h2>Videos</h2>
              <div className="video-gallery">
                <video controls className="rounded-video">
                  <source src={movie.videos[0].url} type="video/mp4" />
                </video>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default View;
