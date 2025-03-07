import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DeleteStationeryItems() {
  const [stationeryItems, setStationeryItems] = useState([]);
  const [error, setError] = useState("");

  // Fetch items from the backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/getstationeryitems");
        if (!response.ok) throw new Error("Failed to fetch items");

        const data = await response.json();
        if (!Array.isArray(data['results'])) throw new Error("Invalid data format");

        setStationeryItems(data['results']);
      } catch (error) {
        console.error("❌ Fetch Error:", error);
        setError("Could not load items.");
      }
    };

    fetchItems();
  }, []);

  // Handle item deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/deleteitem/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete item");
      }

      // Remove item from UI
      setStationeryItems((prevItems) => prevItems.filter((item) => item.ItemID !== id));
    } catch (error) {
      console.error("❌ Delete Error:", error);
      setError(`Could not delete item. ${error.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🗑️ Delete Stationery Items</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="list-group">
        {stationeryItems.length > 0 ? (
          stationeryItems.map((item) => (
            <li key={item.ItemID} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{item.ItemName}</span>
              <button className="btn btn-danger" onClick={() => handleDelete(item.ItemID)}>❌ Delete</button>
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted text-center">No items available.</li>
        )}
      </ul>
    </div>
  );
}
