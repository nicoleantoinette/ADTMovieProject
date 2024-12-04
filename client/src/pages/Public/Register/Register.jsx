import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/pages/Register.css";
import axios from "axios";

function Register() {
  const [userData, setUserData] = useState({
    userEmail: "",
    userPassword: "",
    userFirstName: "",
    userLastName: "",
    userMiddleName: "",
    userPhoneNumber: "",
    userRole: "guest", // Default role
  });

  const [formStatus, setFormStatus] = useState("idle");
  const [isFormDirty, setIsFormDirty] = useState(false);
  const navigateTo = useNavigate();

  const handleInputChange = (event) => {
    setIsFormDirty(true);
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitRegistration = async () => {
    if (isFormComplete()) {
      setFormStatus("loading");
      try {
        await axios.post("/user/register", userData, {
          headers: { "Content-Type": "application/json" },
        });

        alert("Account created successfully");

        setTimeout(async () => {
          try {
            const response = await axios.post("/user/login", {
              email: userData.userEmail,
              password: userData.userPassword,
            });
            localStorage.setItem("accessToken", response.data.access_token);
            navigateTo("/dashboard");
          } catch (error) {
            alert("Login failed after registration");
            console.error(error);
          } finally {
            setFormStatus("idle");
          }
        }, 2000);
      } catch (error) {
        alert("Registration failed");
        console.error(error);
        setFormStatus("idle");
      }
    } else {
      setIsFormDirty(true);
      alert("All fields must be filled!");
    }
  };

  const isFormComplete = () => {
    return Object.values(userData).every((field) => field.trim() !== "");
  };

  return (
    <div className="sign-up-container">
      <div className="form-wrapper">
        <h3 className="form-heading">Create Your New Account</h3>
        <form>
          <div className="form-elements">
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="userEmail"
                value={userData.userEmail}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="userPassword"
                value={userData.userPassword}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                name="userFirstName"
                value={userData.userFirstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                name="userLastName"
                value={userData.userLastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                required
              />
            </div>

            <div className="input-group">
              <label>Middle Name</label>
              <input
                type="text"
                name="userMiddleName"
                value={userData.userMiddleName}
                onChange={handleInputChange}
                placeholder="Enter your middle name (optional)"
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="userPhoneNumber"
                value={userData.userPhoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="action-container">
              <button
                className="submit-button"
                type="button"
                onClick={submitRegistration}
                disabled={formStatus === "loading"}
              >
                {formStatus === "loading" ? (
                  <div className="spinner"></div>
                ) : (
                  "Register Now"
                )}
              </button>
            </div>

            <div className="login-prompt">
              <span>Already have an account?</span>
              <a href="/login">Log In</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
