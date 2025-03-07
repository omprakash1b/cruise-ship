import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [role, setRole] = useState(""); // Role selection
  const navigate = useNavigate(); // Navigation hook

  async function login(email, password) {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      return data;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login(email, password);

    if (!data) {
      alert("Invalid login credentials");
      return;
    }

    const userRole = data["type"]?.toLowerCase(); // Ensure lowercase matching
    const userId = data["id"];
    localStorage.setItem("userId", userId);
    switch (userRole) {
      case "voyager":
        navigate("/voyager-dashboard");
        break;
      case "admin":
        navigate("/admin-dashboard");
        break;
      case "manager":
        navigate("/manager-dashboard");
        break;
      case "cook": // Fixed typo from "coock"
        navigate("/headcook-dashboard");
        break;
      case "supervisor":
        navigate("/supervisor-dashboard");
        break;
      default:
        alert("Invalid role!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
