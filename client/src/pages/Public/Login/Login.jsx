import { useState, useRef, useCallback, useEffect } from "react";
import "../../../styles/pages/Login.css";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Importing icons

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState("idle");
  const navigate = useNavigate();

  const userInputDebounce = useDebounce({ email, password }, 2000);

  const toggleShowPassword = useCallback(() => {
    setIsShowPassword((prev) => !prev);
  }, []);

  const handleChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);
    type === "email"
      ? setEmail(event.target.value)
      : setPassword(event.target.value);
  };

  const handleLogin = async () => {
    const data = { email, password };
    setStatus("loading");

    try {
      const res = await axios.post("/user/login", data, {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
      localStorage.setItem("accessToken", res.data.access_token);
      setTimeout(() => {
        setStatus("idle");
        navigate("/home");
      }, 3000);
    } catch (e) {
      setTimeout(() => {
        setStatus("idle");
        const errorMessage =
          e.response?.status === 401
            ? "Invalid email or password. Please try again."
            : "Something went wrong.";
        alert(errorMessage);
      }, 3000);
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="login-page">
      <div className="main-container">
        <h3>Sign In</h3>
        <form>
          <div className="form-container">
            <div className="form-group">
              <label>E-mail:</label>
              <div className="input-with-icon">
                <input
                  icon={<FaEnvelope style={{ color: "#00796b" }} />}
                  type="text"
                  ref={emailRef}
                  onChange={(e) => handleChange(e, "email")}
                  placeholder="Enter your email"
                />
              </div>
              {debounceState && isFieldsDirty && !email && (
                <span className="errors">This field is required</span>
              )}
            </div>

            <div className="form-group">
              <label>Password:</label>
              <div className="input-with-icon">
                <input
                  icon={<FaLock style={{ color: "#00796b" }} />}
                  type={isShowPassword ? "text" : "password"}
                  ref={passwordRef}
                  onChange={(e) => handleChange(e, "password")}
                  placeholder="Enter your password"
                />
                <span className="eye-icon" onClick={toggleShowPassword}>
                  {isShowPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {debounceState && isFieldsDirty && !password && (
                <span className="errors">This field is required</span>
              )}
            </div>
            <div className="submit-container">
              <button
                className="btn-primary"
                type="button"
                disabled={status === "loading"}
                onClick={() => {
                  if (email && password) {
                    setStatus("loading");
                    handleLogin();
                  } else {
                    setIsFieldsDirty(true);
                    email === "" && emailRef.current.focus();
                    password === "" && passwordRef.current.focus();
                  }
                }}
              >
                {status === "loading" ? (
                  <div className="loading-spinner"></div>
                ) : (
                  "Login"
                )}
              </button>
            </div>
            <div className="register-container">
              <small>Don't have an account? </small>
              <a href="/register">
                <small>Sign Up</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
