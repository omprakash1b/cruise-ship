import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CateringFoodItems() {
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState({});
  

  // Fetch food items from backend
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/getfooditems");
        if (!response.ok) {
          throw new Error("Failed to fetch food items");
        }
        const data = await response.json();
        setFoodItems(data.results || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    fetchFoodItems();
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
      const customerID = userId;
      const category = 'food';
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
      <h1 className="mb-4">Catering Menu</h1>
      <div className="card mb-4">
        <div className="card-body">
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Item Name</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {foodItems.length > 0 ? (
                foodItems.map((item) => (
                  <tr key={item.ItemID}>
                    <td>{item.ItemName}</td>
                    <td>{item.Price}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => addToCart(item)}>
                        Order
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No food items available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <h2>Order Summary</h2>
      <div className="card">
        <div className="card-body">
          {Object.keys(cart).length > 0 ? (
            <>
              <ul className="list-group mb-3">
                {Object.values(cart).map((item) => (
                  <li key={item.ItemID} className="list-group-item d-flex justify-content-between align-items-center">
                    {item.ItemName} - {item.Price} (Quantity: {item.quantity})
                    <div>
                      <button className="btn btn-danger btn-sm me-2" onClick={() => removeFromCart(item.ItemID)}>
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
            <p>No items ordered yet.</p>
          )}
        </div>
      </div>
      
    </div>
  );
}
