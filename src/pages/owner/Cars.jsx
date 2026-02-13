import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import carService from "../../api/carService"; // ✅ Correct default import
import userService from "../../api/userService";
//import "../../styles/Cars.css";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchCars = async () => {
      try {
        let response;

        // ✅ FIXED: carApi → carService
        if (userRole === "OWNER") {
          response = await carService.get("/api/cars/my-cars");
        } else {
          response = await carService.get("/api/cars/available");
        }

        setCars(response.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [userRole]);

  const handleBookingClick = async (carId) => {
    try {
      const res = await userService.getProfile();

      if (!res.data.isVerified) {
        alert(
          "🔒 Identity Verification Required: Please upload your License and Aadhar card before booking."
        );
        navigate("/upload-identity");
      } else {
        navigate(`/book-car/${carId}`);
      }
    } catch (err) {
      console.error("Verification check failed:", err);
      alert("Could not verify identity status. Please login again.");
      navigate("/login");
    }
  };

  if (loading) return <div className="loader">Loading vehicles...</div>;

  return (
    <div className="cars-container">
      <h2 className="page-title">
        {userRole === "OWNER"
          ? "My Managed Fleet"
          : "Available Vehicles for Rent"}
      </h2>

      <div className="cars-grid">
        {cars.length > 0 ? (
          cars.map((car) => {
            // ✅ DEBUG LOG
            console.log("Car object:", car);

            return (
              <div key={car.carId} className="car-card">
                {/* ✅ Tailwind Proper Image Container */}
                <div className="relative w-full h-56 overflow-hidden rounded-xl">
                  <img
                    src={
                      car.imageUrls?.length > 0
                        ? car.imageUrls[0]
                        : "https://via.placeholder.com/400x250?text=No+Image"
                    }
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover"
                  />

                  <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-white shadow">
                    {car.availabilityStatus}
                  </span>
                </div>

                <div className="car-details">
                  <h3>
                    {car.brand} {car.model}
                  </h3>
                  <p className="location">📍 {car.location}</p>

                  <div className="price-info">
                    <span>₹{car.pricePerHour}/hr</span>
                    <span>₹{car.pricePerKm}/km</span>
                  </div>

                  <div className="card-actions">
                    {userRole === "OWNER" ? (
                      <>
                        <button
                          onClick={() =>
                            navigate(`/owner/edit-car/${car.carId}`)
                          }
                          className="edit-btn"
                        >
                          Edit Details
                        </button>
                        <button className="delete-btn">Delete</button>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          handleBookingClick(car.carId)
                        }
                        disabled={
                          car.availabilityStatus !== "AVAILABLE"
                        }
                        className="book-btn"
                      >
                        {car.availabilityStatus === "AVAILABLE"
                          ? "Book Now"
                          : "Unavailable"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-cars">
            No vehicles found at the moment.
          </p>
        )}
      </div>
    </div>
  );
}
