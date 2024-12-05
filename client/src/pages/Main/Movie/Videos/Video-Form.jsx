import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { MdDelete, MdEdit } from "react-icons/md"; // Import React Icons
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Video-Form.css";

function VideoForm() {
  const { auth } = useContext(AuthContext);
  const [videoId, setVideoId] = useState(undefined);
  const [videoURL, setVideoURL] = useState("");
  const [videos, setVideos] = useState([]);
  const [videokey, setVideoKey] = useState({});
  const [selectedvideo, setSelectedVideo] = useState({});
  const urlRef = useRef();
  const nameRef = useRef();
  const siteRef = useRef();
  const videoTypeRef = useRef();
  let { movieId } = useParams();

  const getAll = useCallback(
    (movieId) => {
      axios({
        method: "get",
        url: `/movies/${movieId}`,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
        .then((response) => {
          setVideos(response.data.videos);
        })
        .catch((error) => {
          console.error("Error fetching Videos:", error.response.data);
        });
    },
    [auth.accessToken]
  );

  const getYouTubeVideoID = (url) => {
    if (!url || typeof url !== "string") {
      console.log("Invalid URL:", url);
      setVideoKey("");
      return null;
    }

    const regex =
      /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/)([\w-]+))/i;
    const match = url.match(regex);
    console.log("URL:", url);
    console.log("Match:", match);

    if (match && match[1]) {
      setVideoKey(match[1]);
      return match[1];
    } else {
      setVideoKey("");
      return null;
    }
  };

  const validateField = (fieldRef, fieldName) => {
    if (!fieldRef.current) {
      console.error(`Field ${fieldName} ref is not assigned.`);
      return false;
    }

    if (!fieldRef.current.value.trim()) {
      fieldRef.current.style.border = "2px solid red";
      setTimeout(() => {
        fieldRef.current.style.border = "1px solid #ccc";
      }, 2000);
      console.log(`${fieldName} cannot be empty.`);
      return false;
    }

    return true;
  };

  function importDataVideo() {
    axios({
      method: "get",
      url: `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MGY0ZjFlMmNhODQ1ZjA3NWY5MmI5ZDRlMGY3ZTEwYiIsIm5iZiI6MTcyOTkyNjY3NC40NzIwOTksInN1YiI6IjY3MTM3ODRmNjUwMjQ4YjlkYjYxZTgxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RRJNLOg8pmgYoomiCWKtwkw74T3ZtAs7ZScqxo1bzWg",
      },
    }).then((response) => {
      setSavePhotosImp(response.data.results);
      alert(
        `Total of ${response.data.results.length} Videos are now Imported to Database`
      );
      setTimeout(() => {
        getAll(movieId);
      }, 2000);
    });
  }

  async function setSavePhotosImp(vidoeImportData) {
    await Promise.all(
      vidoeImportData.map(async (datainfo) => {
        const datavideo = {
          userId: auth.user.userId,
          movieId: movieId,
          url: `https://www.youtube.com/embed/${datainfo.key}`,
          videoKey: datainfo.key,
          name: datainfo.name,
          site: datainfo.site,
          videoType: datainfo.type,
          official: datainfo.official,
        };
        console.log("Transfering import to Database", datavideo);
        try {
          await axios.post("/admin/videos", datavideo, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${auth.accessToken}`,
            },
          });
        } catch (error) {
          console.error("Error of Importing:", error);
        }
      })
    );
    console.log("Imported Success");
  }

  const handlesave = async () => {
    const dataphoto = {
      userId: auth.user.userId,
      movieId: movieId,
      url: `https://www.youtube.com/embed/${videokey}`,
      videoKey: videokey,
      name: selectedvideo.name,
      site: selectedvideo.site,
      videoType: selectedvideo.videoType,
      official: selectedvideo.official,
    };
    console.table(dataphoto);
    const validateFields = () => {
      const isUrlValid = validateField(urlRef, "YouTube Link");

      if (isUrlValid) {
        const videoKey = getYouTubeVideoID(urlRef.current.value);
        if (!videoKey) {
          urlRef.current.style.border = "2px solid red";
          setTimeout(() => {
            urlRef.current.style.border = "1px solid #ccc";
          }, 2000);
          console.log("Invalid YouTube link. Please enter a valid URL.");
          alert("Invalid YouTube link. Please enter a valid URL.");
          return false;
        }
      }

      const isNameValid = validateField(nameRef, "Title Name");
      const isSiteValid = validateField(siteRef, "Site Type");
      const isVideoTypeValid = validateField(videoTypeRef, "Video Type");

      return isUrlValid && isNameValid && isSiteValid && isVideoTypeValid;
    };

    if (!validateFields()) {
      return;
    } else {
      try {
        await axios({
          method: "POST",
          url: "/admin/videos",
          data: dataphoto,
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        alert("Added Success");
        getAll(movieId);
        setSelectedVideo([]);
        setVideoURL("");
        setVideoKey("");
        getYouTubeVideoID(null);
        urlRef.current.value = "";
      } catch (error) {
        console.log(
          "Error Saving Video",
          error.response?.data || error.message
        );
        alert(`Incorrect Link or Error: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    getAll(movieId);
  }, [movieId, getAll]);

  const handledelete = async (id) => {
    const isConfirm = window.confirm(
      "Are you sure you want to delete this Video?"
    );

    if (isConfirm) {
      try {
        const response = await axios({
          method: "delete",
          url: `/videos/${id}`,
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        alert("Delete successful!");
        console.log(response);
        getAll(movieId);
      } catch (err) {
        console.error("Error deleting video:", err.message);
        alert("An error occurred while deleting the video.");
      }
    }
  };

  const videoget = async (id) => {
    axios({
      method: "get",
      url: `/videos/${id}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
      .then((response) => {
        setSelectedVideo(response.data);
        setVideoId(response.data.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleclear = useCallback(() => {
    setSelectedVideo([]);
    setVideoId(undefined);
    setVideoKey("");
    setVideoURL("");
    urlRef.current.value = "";
  }, [setSelectedVideo, setVideoId, setVideoKey, setVideoURL]);

  const videoUpdate = async (id) => {
    const validateFields = () => {
      const isUrlValid = validateField(urlRef, "YouTube Link");

      if (isUrlValid) {
        const videoKey = getYouTubeVideoID(urlRef.current.value);
        if (!videoKey) {
          urlRef.current.style.border = "2px solid red";
          setTimeout(() => {
            urlRef.current.style.border = "1px solid #ccc";
          }, 2000);
          console.log("Invalid YouTube link. Please enter a valid URL.");
          alert("Invalid YouTube link. Please enter a valid URL.");
          return false;
        }
      }

      const isNameValid = validateField(nameRef, "Title Name");
      const isSiteValid = validateField(siteRef, "Site Type");
      const isVideoTypeValid = validateField(videoTypeRef, "Video Type");

      return isUrlValid && isNameValid && isSiteValid && isVideoTypeValid;
    };

    if (!validateFields()) {
      return;
    } else {
      const videoUpdate = {
        name: selectedvideo.name,
        site: selectedvideo.site,
        videoType: selectedvideo.videoType,
        url: `https://www.youtube.com/embed/${videokey}`,
        videoKey: videokey,
      };

      await axios({
        method: "put",
        url: `/videos/${id}`,
        data: videoUpdate,
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
        .then((response) => {
          alert("Successfully updated the Video");
          setSelectedVideo([]);
          getAll(movieId);
        })
        .catch((err) => {
          console.error(err.message);
        });
    }
  };

  return (
    <div className="video-form-container">
      <div className="video-form">
        <input
          type="text"
          ref={urlRef}
          placeholder="Enter YouTube Video URL"
          onChange={(e) => getYouTubeVideoID(e.target.value)}
        />
        <button className="import-btn" onClick={() => importDataVideo()}>
          Import
        </button>
        <input
          type="text"
          ref={nameRef}
          placeholder="Enter Title Name"
          onChange={(e) =>
            setSelectedVideo({ ...selectedvideo, name: e.target.value })
          }
        />
        <input
          type="text"
          ref={siteRef}
          placeholder="Enter Site Type"
          onChange={(e) =>
            setSelectedVideo({ ...selectedvideo, site: e.target.value })
          }
        />
        <input
          type="text"
          ref={videoTypeRef}
          placeholder="Enter Video Type"
          onChange={(e) =>
            setSelectedVideo({ ...selectedvideo, videoType: e.target.value })
          }
        />
        <button className="save-btn" onClick={handlesave}>
          Save
        </button>
        <button className="clear-btn" onClick={handleclear}>
          Clear
        </button>
      </div>

      <div className="videos-list">
        {videos.map((video) => (
          <div key={video.id} className="video-item">
            <div>{video.name}</div>
            <div>{video.site}</div>
            <div>{video.videoType}</div>
            <button onClick={() => videoget(video.id)}>
              <MdEdit /> Edit
            </button>
            <button onClick={() => handledelete(video.id)}>
              <MdDelete /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoForm;
