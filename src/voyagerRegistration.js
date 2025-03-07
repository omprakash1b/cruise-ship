import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function VoyagerRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    cabinNumber: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const generateCabinNumber = () => "CAB" + Math.floor(1000 + Math.random() * 9000);

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, cabinNumber: generateCabinNumber() }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      return "All fields are required.";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      setSuccess("Registration successful!");
      setError("");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        cabinNumber: generateCabinNumber(),
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-3" style={{ maxWidth: "450px", maxHeight: "550px", width: "100%" }}>
        <h4 className="text-center mb-3">🚢 Voyager Registration</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label small">Full Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="mb-2">
            <label className="form-label small">Email</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="mb-2">
            <label className="form-label small">Phone</label>
            <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="mb-2">
            <label className="form-label small">Cabin Number</label>
            <input type="text" className="form-control" name="cabinNumber" value={formData.cabinNumber} readOnly />
          </div>

          <div className="mb-2">
            <label className="form-label small">Password</label>
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="mb-2">
            <label className="form-label small">Confirm Password</label>
            <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          {error && <div className="alert alert-danger py-1 text-center small">{error}</div>}
          {success && <div className="alert alert-success py-1 text-center small">{success}</div>}

          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
      </div>
    </div>
  );
}
