import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function BeautySalonBooking() {
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState({});

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await fetch("http://localhost:5000/getbeautysalonlist");
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(data.results || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchList();
  }, []);

  const addToCart = (service) => {
    setCart((prevCart) => ({
      ...prevCart,
      [service.ServiceID]: prevCart[service.ServiceID]
        ? { ...prevCart[service.ServiceID], quantity: prevCart[service.ServiceID].quantity + 1 }
        : { ...service, quantity: 1 },
    }));
  };

  const removeFromCart = (serviceId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[serviceId].quantity > 1) {
        updatedCart[serviceId].quantity -= 1;
      } else {
        delete updatedCart[serviceId];
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
      const response = await fetch("http://localhost:5000/booksalon", {
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
      <h1 className="mb-4">Beauty Salon Booking</h1>
      
      {/* Services List */}
      <div className="card mb-4">
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {services.length > 0 ? (
                services.map((service) => (
                  <tr key={service.ServiceID}>
                    <td>{service.ServiceName}</td>
                    <td>{service.Category}</td>
                    <td>{service.Price}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => addToCart(service)}>
                        Book Service
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No services available</td>
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
            <>
              <ul className="list-group mb-3">
                {Object.values(cart).map((service) => (
                  <li key={service.ServiceID} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>
                      {service.ServiceName} - ${service.Price} (Quantity: {service.quantity})
                    </span>
                    <button className="btn btn-danger btn-sm ms-3" onClick={() => removeFromCart(service.ServiceID)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <button className="btn btn-primary w-100" onClick={handleCheckout}>
                Checkout
              </button>
            </>
          ) : (
            <p>No services booked yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
