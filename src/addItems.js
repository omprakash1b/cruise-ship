import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddItems() {
  const [items, setItems] = useState([]); // Stores fetched items
  const [formData, setFormData] = useState({ name: "", price: "" });
  const [error, setError] = useState("");

  // Fetch items from database
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/getstationeryitems"); // Fetch all items
        if (!response.ok) throw new Error("Failed to fetch items");
        const data = await response.json();
        
        // ✅ Ensure the fetched data is an array
        if (!Array.isArray(data)) throw new Error("Invalid response format");

        setItems(data);
      } catch (error) {
        console.error("❌ Error fetching items:", error);
        setError("Could not load items.");
        setItems([]); // ✅ Prevent TypeError
      }
    };

    fetchItems();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/additems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add item");
      }

      // ✅ Ensure items is an array before updating
      setItems((prevItems) => (Array.isArray(prevItems) ? [...prevItems, { ...formData, id: result.itemId }] : [{ ...formData, id: result.itemId }]));
      
      setFormData({ name: "", price: "" });
      setError("");
    } catch (error) {
      console.error("❌ Error adding item:", error.message);
      
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📌 Add Stationery Items</h2>

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-3 shadow">
        <div className="mb-3">
          <label className="form-label">Item Name</label>
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Price ($)</label>
          <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary w-100">➕ Add Item</button>
      </form>

      <h3 className="mt-4">📦 Added Items</h3>
      <ul className="list-group">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="list-group-item">
              {item.ItemName} - ${item.Price}
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted text-center">No items added yet.</li>
        )}
      </ul>
    </div>
  );
}
