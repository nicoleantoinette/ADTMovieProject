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

          <div className="poster-container">
            <img
              src={
                movie.poster ||
                movie.backdropPath ||
                "https://via.placeholder.com/500x750?text=No+Poster+Available"
              }
              alt="Movie Poster"
              className="poster-image"
            />
          </div>

          <div className="movie-details">
            <h3 className="movie-overview">{movie.overview}</h3>
          </div>

          {movie.photos && movie.photos.length > 0 && (
            <div className="section">
              <h2 className="section-title">Photos</h2>
              <div className="photo-gallery-grid">
                {movie.photos.map((photo, index) => (
                  <div key={index} className="photo-item">
                    <img
                      src={photo.url}
                      alt={`Movie Photo ${index + 1}`}
                      className="rounded-image"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {movie.casts && movie.casts.length > 0 && (
            <div className="section">
              <h2 className="section-title">Cast & Crew</h2>
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
              <h2 className="section-title">Videos</h2>
              <div className="video-gallery-grid">
                {movie.videos.map((video, index) => (
                  <div key={index} className="video-item">
                    <iframe
                      title={`Movie Video ${index + 1}`}
                      width="100%"
                      height="auto"
                      src={video.url.replace("watch?v=", "embed/")}
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="loading-text">Loading...</p>
      )}
    </div>
  );
}

export default View;
