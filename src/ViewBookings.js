import React, { useState, useEffect } from "react";
import { data, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewBookings = () => {
  const [movieBookings, setMovieBookings] = useState([]);
  const [salonBookings, setSalonBookings] = useState([]);
  const [fitnessBookings, setFitnessBookings] = useState([]);
  const [partyHallBookings, setPartyHallBookings] = useState([]);
  const [error, setError] = useState("");

  // Fetch Movie Bookings
  useEffect(() => {
    const fetchMovieBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/getMovieBookings");
        if (!response.ok) throw new Error("Failed to fetch movie bookings");

        const data = await response.json();
        setMovieBookings(data['results']);
      } catch (error) {
        alert(data)
        console.error("❌ Movie Fetch Error:", error);
        setError("Could not load movie bookings.");
      }
    };

    fetchMovieBookings();
  }, []);

  // Fetch Salon Bookings
  useEffect(() => {
    const fetchSalonBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/getSalonBookings");
        if (!response.ok) throw new Error("Failed to fetch salon bookings");

        const data = await response.json();
        setSalonBookings(data.results);
      } catch (error) {
        console.error("❌ Salon Fetch Error:", error);
        setError("Could not load salon bookings.");
      }
    };

    fetchSalonBookings();
  }, []);

  // Fetch Fitness Center Bookings
  useEffect(() => {
    const fetchFitnessBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/getFitnessBookings");
        if (!response.ok) throw new Error("Failed to fetch fitness bookings");

        const data = await response.json();
        setFitnessBookings(data.results);
      } catch (error) {
        console.error("❌ Fitness Fetch Error:", error);
        setError("Could not load fitness bookings.");
      }
    };

    fetchFitnessBookings();
  }, []);

  // Fetch Party Hall Bookings
  useEffect(() => {
    const fetchPartyHallBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/getPartyHallBookings");
        if (!response.ok) throw new Error("Failed to fetch party hall bookings");

        const data = await response.json();
        setPartyHallBookings(data['results']);
      } catch (error) {
        console.error("❌ Party Hall Fetch Error:", error);
        setError("Could not load party hall bookings.");
      }
    };

    fetchPartyHallBookings();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📋 View All Bookings</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Movie Bookings */}
      <h3 className="mt-4">🎬 Movie Bookings</h3>
      <div className="row">
        {movieBookings.map((booking) => (
          <div key={booking.BookingID} className="col-md-6 mb-3">
            <div className="card shadow-sm p-3">
              <h5 className="card-title">🎬 {booking.MovieName}</h5>
              <p className="card-text">
                🎭 <strong>Genre:</strong> {booking.Genre} <br />
                🎟️ <strong>Seats Booked:</strong> {booking.Quantity} <br />
                💰 <strong>Price:</strong> ₹{booking.Price} per ticket
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Salon Bookings */}
      <h3 className="mt-4">💇 Beauty Salon Bookings</h3>
      <div className="row">
        {salonBookings.map((booking) => (
          <div key={booking.ReservationID} className="col-md-6 mb-3">
            <div className="card shadow-sm p-3">
              <h5 className="card-title">💆 {booking.ServiceName}</h5>
              <p className="card-text">⏳ <strong>Price:</strong> {booking.Price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Fitness Center Bookings */}
      <h3 className="mt-4">🏋️ Fitness Center Bookings</h3>
      <div className="row">
        {fitnessBookings.map((booking) => (
          <div key={booking.ReservationID} className="col-md-6 mb-3">
            <div className="card shadow-sm p-3">
              <h5 className="card-title">🏋️ Gym Booking</h5>
              <p className="card-text">⏳ <strong>ServiceName:</strong> {booking.ServiceName}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Party Hall Bookings */}
      <h3 className="mt-4">🎉 Party Hall Bookings</h3>
      <div className="row">
        {partyHallBookings.map((booking) => (
          <div key={booking.ReservationID} className="col-md-6 mb-3">
            <div className="card shadow-sm p-3">
              <h5 className="card-title">🎈 {booking.HallName}</h5>
              <p className="card-text">
                👥 <strong>Guests:</strong> {booking.Capacity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Back to Dashboard Button */}
      <div className="text-center mt-4">
        <Link to="/" className="btn btn-secondary">🔙 Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default ViewBookings;
