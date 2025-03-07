import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MoviesBooking() {
  const [movies, setMovies] = useState([]);
  const [cart, setCart] = useState({});
  

  useEffect(() => {
    // Mock data since no backend is used
    
    const fetchMoviesList = async () => {
      try {
        const response = await fetch("http://localhost:5000/getmovieslist");
        if (!response.ok) {
          throw new Error("Failed to fetch Movies");
        }
        const data = await response.json();
        setMovies(data.results || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching stationery items:", error);
      }
    };

      fetchMoviesList();
  }, []);

  const addToCart = (movie) => {
    setCart((prevCart) => ({
      ...prevCart,
      [movie.MovieID]: prevCart[movie.MovieID]
        ? { ...prevCart[movie.MovieID], quantity: prevCart[movie.MovieID].quantity + 1 }
        : { ...movie, quantity: 1 },
    }));
  };

  const removeFromCart = (movieId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[movieId].quantity > 1) {
        updatedCart[movieId].quantity -= 1;
      } else {
        delete updatedCart[movieId];
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
      
      //const category = 'movies';
      const response = await fetch("http://localhost:5000/bookmovies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, cart}),
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
      <h1 className="mb-4">Movies Booking</h1>
      <div className="card mb-4">
        <div className="card-body">
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Movie Name</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <tr key={movie.MovieID}>
                    <td>{movie.MovieName}</td>
                    <td>{movie.Genre}</td>
                    <td>{movie.Price}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => addToCart(movie)}>
                        Book Ticket
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No movies available</td>
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
                {Object.values(cart).map((movie) => (
                  <li key={movie.MovieID} className="list-group-item d-flex justify-content-between align-items-center">
                    {movie.MovieName} - {movie.Price} (Quantity: {movie.quantity})
                    <div>
                      <button className="btn btn-danger btn-sm me-2" onClick={() => removeFromCart(movie.MovieID)}>
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
            <p>No tickets booked yet.</p>
          )}
        </div>
      </div>

    </div>
  );
}
