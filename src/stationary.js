import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function StationeryItems() {
  const [stationeryItems, setStationeryItems] = useState([]);
  const [cart, setCart] = useState({});
  const userId = localStorage.getItem("userId"); // Get userId from localStorage

  useEffect(() => {
    const fetchStationeryItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/getstationeryitems");
        if (!response.ok) throw new Error("Failed to fetch items");
        const data = await response.json();
        setStationeryItems(data.results || []);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchStationeryItems();
  }, []);

  const addToCart = (item) => {
    setCart((prevCart) => ({
      ...prevCart,
      [item.ItemID]: prevCart[item.ItemID]
        ? { ...prevCart[item.ItemID], quantity: prevCart[item.ItemID].quantity + 1 }
        : { ...item, quantity: 1 },
    }));
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[itemId].quantity > 1) {
        updatedCart[itemId].quantity -= 1;
      } else {
        delete updatedCart[itemId];
      }
      return updatedCart;
    });
  };

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
      const customerID = userId;
      const category = 'Stationery';
      const response = await fetch("http://localhost:5000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerID, cart, category }),
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
      <h1>Stationery Items</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stationeryItems.length > 0 ? (
            stationeryItems.map((item) => (
              <tr key={item.ItemID}>
                <td>{item.ItemName}</td>
                <td>${item.Price}</td>
                <td>
                  <button className="btn btn-success" onClick={() => addToCart(item)}>
                    Order
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No items available</td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>Order Summary</h2>
      <ul className="list-group">
        {Object.values(cart).map((item) => (
          <li key={item.ItemID} className="list-group-item d-flex justify-content-between align-items-center">
            {item.ItemName} - ${item.Price} (Quantity: {item.quantity})
            <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.ItemID)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button className="btn btn-primary mt-3 w-100" onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
}
