import { Outlet } from "react-router-dom";

const Movie = () => {
  return (
    <>
      <h1 style={{ color: "white" }}>Movie Page</h1>

      <Outlet />
    </>
  );
};

export default Movie;
