import { useState, useRef, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isFormDirty, setIsFormDirty] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingState, setLoadingState] = useState("idle");
  const navigateTo = useNavigate();

  const debouncedUserInput = useDebounce({ userEmail, userPassword }, 2000);

  const togglePasswordVisibility = () => {
    setShowPassword((currentState) => !currentState);
  };

  const handleInputChange = (event, inputType) => {
    setIsTyping(false);
    setIsFormDirty(true);
    if (inputType === "email") {
      setUserEmail(event.target.value);
    } else {
      setUserPassword(event.target.value);
    }
  };

  const loginUser = async () => {
    const requestData = { email: userEmail, password: userPassword };
    setLoadingState("loading");

    try {
      const response = await axios.post("/user/login", requestData, {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
      localStorage.setItem("accessToken", response.data.access_token);
      setTimeout(() => {
        setLoadingState("idle");
        navigateTo("/home");
      }, 3000);
    } catch (error) {
      setTimeout(() => {
        setLoadingState("idle");
        const errorText =
          error.response?.status === 401
            ? "Invalid credentials. Try again."
            : "An error occurred. Please try again.";
        alert(errorText);
      }, 3000);
    }
  };

  useEffect(() => {
    setIsTyping(true);
  }, [debouncedUserInput]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h3>Please sign in for better experience</h3>
        <form>
          <div className="form-section">
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  ref={emailInputRef}
                  onChange={(e) => handleInputChange(e, "email")}
                  placeholder="Your email here"
                />
              </div>
              {isTyping && isFormDirty && !userEmail && (
                <span className="error-message">Email is required</span>
              )}
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  ref={passwordInputRef}
                  onChange={(e) => handleInputChange(e, "password")}
                  placeholder="Your password here"
                />
                <span
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {isTyping && isFormDirty && !userPassword && (
                <span className="error-message">Password is required</span>
              )}
            </div>

            <div className="action-section">
              <button
                type="button"
                disabled={loadingState === "loading"}
                onClick={() => {
                  if (userEmail && userPassword) {
                    setLoadingState("loading");
                    loginUser();
                  } else {
                    setIsFormDirty(true);
                    if (!userEmail) emailInputRef.current.focus();
                    if (!userPassword) passwordInputRef.current.focus();
                  }
                }}
              >
                {loadingState === "loading" ? (
                  <div className="spinner"></div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
            <div className="register-link">
              <span>Don't have an account? </span>
              <a href="/register">
                <small>Register</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
