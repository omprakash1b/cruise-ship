import React from "react";
import { useNavigate } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";


//const [bttn, setBttn] = useState(""); // Role selection


const categories = [
  { name: "Catering", description: "Order snacks, food, and beverages." },
  { name: "Stationery", description: "Order gift items, chocolates, and tale books." },
  { name: "Resort-Movies", description: "Book movie tickets and check seating availability." },
  { name: "Beauty Salon", description: "Book an appointment at the beauty salon." },
  { name: "Fitness Center", description: "Select training equipment and schedule gym time." },
  { name: "Party Hall", description: "Reserve a hall for various types of gatherings." },
];




const Categories = () => {

    const navigate = useNavigate();

    const handleBtn = (val)=>{
        
        //console.log(val)
    switch(val){
        case "Catering":
            navigate("/catering-dashboard");
            break;

        case "Stationery":
            navigate("/stationary-dashboard");
            break;

        case "Resort-Movies":
          navigate("/movies-dashboard");
          break;

        case "Beauty Salon":
          navigate("/beautySalon-dashboard");
          break;

        case "Fitness Center":
          navigate("/gym-dashboard");
          break;

        case "Party Hall":
          navigate("/partyHall-dashboard");
          break;

        default:
            navigate("/voyager-dashboard")
        }
    }

  return (
    <div className="container text-center py-4">
      <h2 className="mb-4">Order & Booking Categories</h2>
      <div className="row">
        {categories.map((category, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h3 className="card-title">{category.name}</h3>
                <p className="card-text">{category.description}</p>
                <button className="btn btn-primary" onClick={() => handleBtn(category.name)}>Explore</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
