import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HeadCookOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/headcook");
        if (!response.ok) throw new Error("Failed to fetch catering orders");

        const data = await response.json();
        if (Array.isArray(data.results)) {
          setOrders(data.results);
        } else {
          console.error("❌ Unexpected response format:", data);
        }
      } catch (error) {
        console.error("❌ Catering Orders Fetch Error:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Ordered Catering Items</h1>
      <div className="card">
        <div className="card-body">
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Item Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Ordered By</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.ItemID}>
                    <td>{order.ItemName}</td>
                    <td>{order.Quantity}</td>
                    <td>{order.CustomerID}</td>
                    <td>{order.Price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
