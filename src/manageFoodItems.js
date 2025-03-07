import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ManageFoodItems() {
  const [foodItems, setFoodItems] = useState([]);
  const [formData, setFormData] = useState({ name: "", price: "" });
  const [editPrice, setEditPrice] = useState({});
  const [error, setError] = useState("");

  // Fetch food items
  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/getfooditems");
      if (!response.ok) throw new Error("Failed to fetch items");

      const data = await response.json();
      if (!Array.isArray(data.results)) throw new Error("Invalid data format");

      setFoodItems(data.results);
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      setError("Could not load items.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle add item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/addfooditem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add item");

      await fetchItems();
      setFormData({ name: "", price: "" });
    } catch (error) {
      console.error("❌ Add Error:", error);
      setError("Could not add item.");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/deletefooditem/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete item");

      await fetchItems();
    } catch (error) {
      console.error("❌ Delete Error:", error);
      setError("Could not delete item.");
    }
  };

  // Handle price update
  const handlePriceChange = (id, value) => {
    setEditPrice({ ...editPrice, [id]: value });
  };

  const updatePrice = async (id) => {
    try {
      const newPrice = editPrice[id];

      const response = await fetch(`http://localhost:5000/updatefooditem/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: newPrice }),
      });

      if (!response.ok) throw new Error("Failed to update price");

      await fetchItems();
      setEditPrice({ ...editPrice, [id]: "" });
    } catch (error) {
      console.error("❌ Update Error:", error);
      setError("Could not update price.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Food Items</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Food Item Name</label>
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Price (₹)</label>
          <input type="text" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Add Food Item</button>
      </form>

      <h3 className="mt-4">Food Menu</h3>
      <ul className="list-group">
        {foodItems.map((item) => (
          <li key={item.ItemID} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{item.ItemName} - ₹{item.Price}</span>
            <div>
              <input
                type="text"
                className="form-control d-inline-block w-25 me-2"
                value={editPrice[item.ItemID] || item.Price}
                onChange={(e) => handlePriceChange(item.ItemID, e.target.value)}
              />
              <button className="btn btn-success me-2" onClick={() => updatePrice(item.ItemID)}>Update</button>
              <button className="btn btn-danger" onClick={() => handleDelete(item.ItemID)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
