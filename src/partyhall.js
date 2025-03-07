import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PartyHallBooking() {
  const [halls, setHalls] = useState([]);
  const [cart, setCart] = useState({});
  const [date, setDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await fetch("http://localhost:5000/getpartyhall");
        if (!response.ok) throw new Error("Failed to fetch halls");
        const data = await response.json();
        setHalls(data.results || []);
      } catch (error) {
        console.error("Error fetching party halls:", error);
        alert("Failed to fetch halls. Please try again.");
      }
    };
    fetchHalls();
  }, []);

  const calculateDuration = (fromTime, toTime) => {
    const from = new Date(`1970-01-01T${fromTime}`);
    const to = new Date(`1970-01-01T${toTime}`);
    return Math.max((to - from) / (1000 * 60 * 60), 0); // Convert ms to hours
  };

  const isValidBookingTime = (selectedDate, fromTime) => {
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate === today) {
      const now = new Date();
      const selectedFromTime = new Date(`1970-01-01T${fromTime}`);
      return selectedFromTime > now;
    }
    return true;
  };

  const checkAvailability = async (hallName, bookingDate, fromTime, toTime) => {
    try {
      const response = await fetch("http://localhost:5000/partyhallavailability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hallName, bookingDate, fromTime, toTime }),
      });
      if (!response.ok) return false;
      const data = await response.json();
      return data.result === true;
    } catch (err) {
      console.error("Error checking availability:", err);
      return false;
    }
  };

  const addToCart = async (hall) => {
    if (!date || !fromTime || !toTime) {
      alert("Please select a date, from time, and to time before booking.");
      return;
    }
    if (!isValidBookingTime(date, fromTime)) {
      alert("You cannot book for a past time today. Please select a future time.");
      return;
    }
    const duration = calculateDuration(fromTime, toTime);
    if (duration <= 0) {
      alert("Invalid time range. 'To Time' must be after 'From Time'.");
      return;
    }
    const isAvailable = await checkAvailability(hall.HallName, date, fromTime, toTime);
    if (!isAvailable) {
      alert("Slot is not available. Please choose another time.");
      return;
    }
    const totalPrice = parseFloat((duration * hall.PricePerHour).toFixed(2));

    setCart((prevCart) => ({
      ...prevCart,
      [hall.HallID]: {
        ...hall,
        bookingDate: date,
        fromTime,
        toTime,
        duration,
        totalPrice,
      },
    }));
  };

  const removeFromCart = (hallId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[hallId];
      return newCart;
    });
  };

  const confirmBooking = async (hall) => {
    try {
      const response = await fetch("http://localhost:5000/bookpartyhall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hallName: hall.HallName,
          bookingDate: hall.bookingDate,
          capacity: hall.Capacity,
          fromTime: hall.fromTime,
          toTime: hall.toTime,
          price: hall.totalPrice,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Booking confirmed successfully!");
        removeFromCart(hall.HallID);
      } else {
        alert(data.message || "Failed to confirm booking. Please try again.");
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Error while confirming booking. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Party Hall Booking</h1>

      {/* Date & Time Selection */}
      <div className="mb-3">
        <label className="form-label">Select Date:</label>
        <input
          type="date"
          className="form-control"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">From:</label>
        <input
          type="time"
          className="form-control"
          value={fromTime}
          onChange={(e) => setFromTime(e.target.value)}
          disabled={!date}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Till:</label>
        <input
          type="time"
          className="form-control"
          value={toTime}
          onChange={(e) => setToTime(e.target.value)}
          disabled={!fromTime}
        />
      </div>

      {/* Hall List */}
      <div className="card mb-4">
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Hall Name</th>
                <th>Capacity</th>
                <th>Price Per Hour</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {halls.length > 0 ? (
                halls.map((hall) => (
                  <tr key={hall.HallID}>
                    <td>{hall.HallName}</td>
                    <td>{hall.Capacity}</td>
                    <td>Rs.{hall.PricePerHour}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => addToCart(hall)}>
                        Book Now
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No halls available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Summary */}
      <h2>Booking Summary</h2>
      <div className="card">
        <div className="card-body">
          {Object.keys(cart).length > 0 ? (
            <ul className="list-group">
              {Object.values(cart).map((hall) => (
                <li key={hall.HallID} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    {hall.HallName} - Rs.{hall.totalPrice} (⏳ {hall.duration} hrs)
                  </div>
                  <div>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => confirmBooking(hall)}>
                      Confirm Booking
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(hall.HallID)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No halls booked yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
