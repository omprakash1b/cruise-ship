import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";




const Manager = () => {
  // Sample data (Replace with API or Firebase data)
  const bookings = [
    { id: 1, category: "Resort-Movie", details: "Movie: Avatar 2, Seats: 4" },
    { id: 2, category: "Beauty Salon", details: "Spa Appointment - 3 PM" },
    { id: 3, category: "Fitness Center", details: "Gym Slot: 6-7 AM" },
    { id: 4, category: "Party Hall", details: "Birthday Party, 20 Guests" },
  ];

  const navigate = useNavigate();
  const btn = ()=>{
    navigate('/view-bookings');
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Manager Dashboard</h2>
      <div className="row">
        {bookings.map((booking) => (
          <div key={booking.id} className="col-md-6 mb-3">
            <div className="card shadow-sm p-3">
              <h5 className="card-title">{booking.category}</h5>
              <p className="card-text">{booking.details}</p>
              <button className="btn btn-primary" onClick={btn}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Manager;