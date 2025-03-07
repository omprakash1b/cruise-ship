import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SupervisorOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/orderedstatoneryitems"); 
        if (!response.ok) throw new Error("Failed to fetch items");

        const data = await response.json();
        setOrders(Array.isArray(data.result) ? data.result : []);
      } catch (error) {
        console.error("Error fetching items:", error);
        setOrders([]); // Ensure empty state if fetch fails
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">📦 Ordered Stationery Items</h1>

      <div className="card shadow">
        <div className="card-body">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th scope="col">📌 Item Name</th>
                <th scope="col">📦 Quantity</th>
                <th scope="col">👤 Ordered By</th>
                <th scope="col">📊 Order ID</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.OrderItemID || order.ItemID}>
                    <td className="fw-bold">{order.ItemName}</td>
                    <td>{order.Quantity}</td>
                    <td>{order.CustomerID || "N/A"}</td>
                    <td>
                      <span className="badge bg-primary">{order.OrderID}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">No orders found 🛒</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
