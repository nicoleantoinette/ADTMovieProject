import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/pages/Register.css";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    middleName: "",
    contactNo: "",
    role: "user", // Default role
  });

  const [status, setStatus] = useState("idle");
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (event) => {
    setIsFieldsDirty(true);
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    if (Object.values(formData).every((value) => value.trim() !== "")) {
      setStatus("loading");

      try {
        await axios.post("/user/register", formData, {
          headers: { "Content-Type": "application/json" },
        });

        alert("User registered successfully");

        setTimeout(async () => {
          try {
            const res = await axios.post("/user/login", {
              email: formData.email,
              password: formData.password,
            });
            localStorage.setItem("accessToken", res.data.access_token);
            navigate("/home");
          } catch (e) {
            alert("Failed to log in after registration");
            console.log(e);
          } finally {
            setStatus("idle");
          }
        }, 3000);
      } catch (error) {
        alert("Failed to register");
        console.log(error);
        setStatus("idle");
      }
    } else {
      setIsFieldsDirty(true);
      alert("All fields are required!");
    }
  };

  return (
    <div className="container-register">
      <div className="main-container">
        <h3 className="register-title">Create Your Account</h3>
        <form>
          <div className="form-container">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleOnChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleOnChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleOnChange}
                placeholder="Enter your first name"
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleOnChange}
                placeholder="Enter your last name"
                required
              />
            </div>

            <div className="form-group">
              <label>Middle Name</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleOnChange}
                placeholder="Enter your middle name (optional)"
              />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="text"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleOnChange}
                placeholder="Enter your contact number"
                required
              />
            </div>

            <div className="submit-container">
              <button
                className="btn-register"
                type="button"
                onClick={handleRegister}
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <div className="loading-spinner"></div>
                ) : (
                  "Register"
                )}
              </button>
            </div>

            <div className="login-link">
              <span>Already have an account?</span>
              <a href="/login">Sign In</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
