import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function GymBooking() {
  const [sessions, setSessions] = useState([]);
  const [cart, setCart] = useState({});
  const [orderHistory, setOrderHistory] = useState([]);
  const [recentOrder, setRecentOrder] = useState(null);

  useEffect(() => {
    // Mock data since no backend is used
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/getgymservices");
        if (!response.ok) {
          throw new Error("Failed to fetch Movies");
        }
        const data = await response.json();
        setSessions(data.results || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching stationery items:", error);
      }
    };
    fetchServices();
  }, []);

  const addToCart = (session) => {
    setCart((prevCart) => ({
      ...prevCart,
      [session.ServiceID]: prevCart[session.ServiceID]
        ? { ...prevCart[session.ServiceID], quantity: prevCart[session.ServiceID].quantity + 1 }
        : { ...session, quantity: 1 },
    }));
  };

  const removeFromCart = (sessionId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[sessionId].quantity > 1) {
        updatedCart[sessionId].quantity -= 1;
      } else {
        delete updatedCart[sessionId];
      }
      return updatedCart;
    });
  };

  const userId = localStorage.getItem("userId");

  const handleCheckout = async () => {
    if (!userId) {
      alert("User ID is missing. Please log in again.");
      return;
    }
    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      console.log("Cart Data Sent:", JSON.stringify(cart, null, 2));
      const response = await fetch("http://localhost:5000/bookgymservice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, cart }),
      });

      if (!response.ok) throw new Error("Checkout failed");
      const data = await response.json();
      alert("Checkout successful! Order ID: " + data.orderId);
      setCart({});
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Checkout failed. Please try again.");
    }
  };


  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gym Session Booking</h1>
      <div className="card mb-4">
        <div className="card-body">
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Session Name</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <tr key={session.ServiceID}>
                    <td>{session.ServiceName}</td>
                    <td>{session.Category}</td>
                    <td>{session.Price}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => addToCart(session)}>
                        Book Session
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No sessions available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <h2>Booking Summary</h2>
      <div className="card">
        <div className="card-body">
          {Object.keys(cart).length > 0 ? (
            <>
              <ul className="list-group mb-3">
                {Object.values(cart).map((session) => (
                  <li key={session.ServiceID} className="list-group-item d-flex justify-content-between align-items-center">
                    {session.ServiceName} - {session.Price} (Quantity: {session.quantity})
                    <div>
                      <button className="btn btn-danger btn-sm me-2" onClick={() => removeFromCart(session.ServiceID)}>
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="btn btn-primary w-100" onClick={handleCheckout}>
                Checkout
              </button>
            </>
          ) : (
            <p>No sessions booked yet.</p>
          )}
        </div>
      </div>

      <h2 className="mt-4">Recent Booking</h2>
      <div className="card">
        <div className="card-body">
          {recentOrder ? (
            <ul className="list-group">
              {recentOrder.map((session) => (
                <li key={session.id} className="list-group-item">
                  {session.ServiceName} - {session.Price} (Quantity: {session.quantity})
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent bookings.</p>
          )}
        </div>
      </div>

      <h2 className="mt-4">Booking History</h2>
      <div className="card">
        <div className="card-body">
          {orderHistory.length > 0 ? (
            <ul className="list-group">
              {orderHistory.map((session, index) => (
                <li key={index} className="list-group-item">
                  {session.ServiceName} - {session.Price} (Quantity: {session.quantity})
                </li>
              ))}
            </ul>
          ) : (
            <p>No booking history.</p>
          )}
        </div>
      </div>
    </div>
  );
}
