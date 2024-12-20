import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./Main.css";

function Main() {
  const accessToken = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user")); // Expecting user object with a 'role' property
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      setIsLoggingOut(true);
      setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setIsLoggingOut(false);
        navigate("/login");
      }, 3000);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  return (
    <div className="main">
      <div className="container">
        <div className="navigation">
          <ul>
            {user?.role === "user" && (
              <li>
                <a onClick={() => navigate("/main/home")}>Home</a>
              </li>
            )}

            {user?.role === "admin" && (
              <>
                <li>
                  <a onClick={() => navigate("/main/movies")}>Movies</a>
                </li>
                <li>
                  <a onClick={() => navigate("/main/dashboard")}>Dashboard</a>
                </li>
              </>
            )}

            <li className="logout" onClick={handleLogout}>
              Log Out
            </li>
          </ul>
        </div>

        <div className="outlet">
          {isLoggingOut ? <div className="loading-spinner"></div> : <Outlet />}
        </div>
      </div>
    </div>
  );
}

export default Main;
