import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const adminOptions = [
  { name: "Add Item", description: "Add new items to the system." },
  { name: "Edit/Delete Item", description: "Modify or remove existing items." },
  { name: "Maintain Menu Items", description: "Manage the availability of menu items." },
  { name: "Voyager Registration", description: "Register new voyagers into the system." },
];

const AdminDashboard = () => {

    const navigate = useNavigate();

    const handleBtn =(val) =>{
      switch(val){
        case"Add Item":
          navigate("/add-items");
        break;
        case "Edit/Delete Item":
          navigate("/delete-items");
        break;
        case "Maintain Menu Items":
          navigate("/maintain-menu");
        break;
        case "Voyager Registration":
          navigate("/voyager-registration");
        break;

        default:
          navigate("/admin-dashboard");
      }
    }


  return (
    <div className="container text-center py-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      <div className="row">
        {adminOptions.map((option, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h3 className="card-title">{option.name}</h3>
                <p className="card-text">{option.description}</p>
                <button className="btn btn-primary" onClick={() => handleBtn(option.name)}  >Manage</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
