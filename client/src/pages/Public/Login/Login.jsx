import { useState, useRef, useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle");
  const [alertMessage, setAlertMessage] = useState("");
  const [debounceState, setDebounceState] = useState(false);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const navigate = useNavigate();
  const { setAuthData } = useContext(AuthContext);
  const userInputDebounce = useDebounce({ email, password }, 2000);

  const handleShowPassword = useCallback(() => {
    setShowPassword((prevState) => !prevState);
  }, []);

  const handleInputChange = (event, type) => {
    setDebounceState(false);
    setIsFormDirty(true);
    if (type === "email") setEmail(event.target.value);
    else if (type === "password") setPassword(event.target.value);
  };

  const apiEndpoint = window.location.pathname.includes("/admin")
    ? "/admin/login"
    : "/user/login";

  const handleLogin = async () => {
    const data = { email, password };
    setStatus("loading");
    try {
      const res = await axios.post(apiEndpoint, data, {
        headers: { "Access-Control-Allow-Origin": "*" },
      });
      processLoginSuccess(res);
    } catch (e) {
      processLoginError(e);
    }
  };

  const processLoginSuccess = (res) => {
    localStorage.setItem("accessToken", res.data.access_token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setAuthData({
      accessToken: res.data.access_token,
      user: res.data.user,
    });
    setAlertMessage(res.data.message);
    navigateAfterDelay(res.data.user.role);
  };

  const processLoginError = (e) => {
    setAlertMessage(e.response?.data?.message || e.message);
    setTimeout(() => {
      setAlertMessage("");
      setStatus("idle");
    }, 3000);
  };

  const navigateAfterDelay = (role) => {
    setTimeout(() => {
      if (role === "admin") {
        navigate("/main/dashboard");
      } else {
        navigate("/home");
      }
      setStatus("idle");
    }, 3000);
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  const handleSubmit = () => {
    if (email && password) {
      setStatus("loading");
      handleLogin();
    } else {
      setIsFormDirty(true);
      if (!email) emailInputRef.current.focus();
      if (!password) passwordInputRef.current.focus();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h3>Please sign in for better experience</h3>
        <form>
          <div className="form-section">
            {renderInputField(
              "Email Address",
              "email",
              emailInputRef,
              handleInputChange,
              debounceState,
              isFormDirty,
              email
            )}
            {renderPasswordField(
              "Password",
              passwordInputRef,
              handleInputChange,
              handleShowPassword,
              showPassword,
              debounceState,
              isFormDirty,
              password
            )}
            {renderActionButton(status, handleSubmit)}
            <div className="register-link">
              <span>Don't have an account? </span>
              <a href="/register">
                <small>Register</small>
              </a>
            </div>
          </div>
        </form>
        {alertMessage && <div className="text-message-box">{alertMessage}</div>}
      </div>
    </div>
  );
}

const renderInputField = (
  label,
  type,
  ref,
  onChange,
  debounceState,
  isFormDirty,
  value
) => (
  <div className="input-group">
    <label>{label}</label>
    <div className="input-wrapper">
      <input
        type="text"
        ref={ref}
        onChange={(e) => onChange(e, type)}
        placeholder={`Your ${label.toLowerCase()} here`}
      />
    </div>
    {debounceState && isFormDirty && value === "" && (
      <span className="error-message">{`${label} is required`}</span>
    )}
  </div>
);

const renderPasswordField = (
  label,
  ref,
  onChange,
  handleShowPassword,
  showPassword,
  debounceState,
  isFormDirty,
  value
) => (
  <div className="input-group">
    <label>{label}</label>
    <div className="input-wrapper">
      <input
        type={showPassword ? "text" : "password"}
        ref={ref}
        onChange={(e) => onChange(e, "password")}
        placeholder={`Your ${label.toLowerCase()} here`}
      />
      <span className="toggle-password" onClick={handleShowPassword}>
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>
    {debounceState && isFormDirty && value === "" && (
      <span className="error-message">{`${label} is required`}</span>
    )}
  </div>
);

const renderActionButton = (status, onSubmit) => (
  <div className="action-section">
    <button type="button" disabled={status === "loading"} onClick={onSubmit}>
      {status === "loading" ? <div className="spinner"></div> : "Sign In"}
    </button>
  </div>
);

export default Login;
