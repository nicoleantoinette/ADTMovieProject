import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./pages/Main/Main";
import Home from "./pages/Main/Movie/Home/Home";
import MovieContextProvider from "./context/MovieContext";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import View from "./pages/Main/Movie/View/View";
import Login from "./pages/Public/Login/Login";
import Register from "./pages/Public/Register/Register";

import Movie from "./pages/Main/Movie/Movie";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/main",
    element: <Main />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "view/:movieId?",
        element: <View />,
      },

      {
        path: "movies",
        element: <Movie />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <MovieContextProvider>
          <RouterProvider router={router} />
        </MovieContextProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
