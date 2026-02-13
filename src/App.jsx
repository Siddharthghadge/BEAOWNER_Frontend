import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- Toast Notifications ---
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Auth ---
import ProtectedRoute from "./routes/ProtectedRoute";
import OwnerRoute from "./routes/OwnerRoute";
import { AuthProvider } from "./auth/AuthProvider";

// --- Layouts ---
import MainLayout from "./layouts/MainLayout";
import CarLayout from "./layouts/CarLayout";

// --- Public Pages ---
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// --- Home Page (PUBLIC) ---
import Home from "./pages/user/Home";

// --- Want to Earn Page ---
import WantToEarn from "./pages/user/WantToEarn";

// --- Admin Pages ---
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookings from "./pages/admin/AdminBookings";

// --- Customer Pages ---
import Dashboard from "./pages/user/Dashboard";
import CarsHome from "./pages/user/CarsHome";
import Cars from "./pages/user/Cars";
import Bikes from "./pages/user/Bikes";
import BikeDetails from "./pages/user/BikeDetails";
import IdentityUpload from "./pages/user/IdentityUpload";

// --- Booking Pages ---
import CarDetails from "./pages/bookings/CarDetails";
import CarWithDriver from "./pages/bookings/CarWithDriver";
import CarBookingWithDriver from "./pages/bookings/CarBookingWithDriver";
import BikeBooking from "./pages/bookings/BikeBooking";
import MyBookings from "./pages/bookings/MyBookings";
import BookingDetails from "./pages/bookings/BookingDetails";

// --- Owner Pages ---
import OwnerHome from "./pages/owner/OwnerHome"; 
import OwnerVehicleHome from "./pages/owner/OwnerVehicleHome"; 
import OwnerVehicleDashboard from "./pages/owner/OwnerDashboard"; 
import MyCars from "./pages/owner/MyCars";
import EditCar from "./pages/owner/EditCar";
import AddCar from "./pages/owner/AddCar";
import AddBike from "./pages/owner/AddBike";
import MyBikes from "./pages/owner/MyBikes";
import EditBike from "./pages/owner/EditBike";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerWallet from "./components/owner/OwnerWallet";
import EditRentalItem from "./pages/owner/EditRentalItem.jsx";

// --- ✅ UPDATED: Generic Rental Components (User Side) ---
import Rentals from "./pages/rentals/Rentals"; // Renamed from RentalElectronics
import ItemDetails from "./pages/rentals/ItemDetails"; // Renamed from ElectronicsDetails

// --- NEW MASTER RENTAL PAGES (FOR OWNER) ---
import AddRentalItem from "./pages/owner/AddRentalItem"; 
import MyRentals from "./pages/owner/MyRentals"; 

/**
 * ✅ Guarded Route for Admin
 */
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "ADMIN" || role === "ROLE_ADMIN"
    ? children
    : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          theme="colored"
        />

        <Routes>
          {/* ✅ PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ✅ ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <AdminRoute>
                <AdminBookings />
              </AdminRoute>
            }
          />

          {/* ✅ MAIN WEBSITE (PUBLIC HOME with MainNavbar) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/want-to-earn" element={<WantToEarn />} />
          </Route>

          {/* ✅ DYNAMIC RENTALS (User Side) */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* These paths match the URL logic in Home.jsx and Rentals.jsx */}
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/item-details/:id" element={<ItemDetails />} />
          </Route>

          {/* ✅ CAR/Bike PAGES (Protected + CarNavbar) */}
          <Route
            element={
              <ProtectedRoute>
                <CarLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/cars-home" element={<CarsHome />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/cars/:id" element={<CarDetails />} />

            <Route path="/car-with-driver" element={<CarWithDriver />} />
            <Route path="/car/:id/book-with-driver" element={<CarBookingWithDriver />} />

            <Route path="/bikes" element={<Bikes />} />
            <Route path="/bike-details/:id" element={<BikeDetails />} />
            <Route path="/customer/book-bike/:id" element={<BikeBooking />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload-identity" element={<IdentityUpload />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/bookings/:id" element={<BookingDetails />} />
          </Route>

          {/* ✅ OWNER ROUTES */}
          <Route path="/owner/home" element={<OwnerRoute><OwnerHome /></OwnerRoute>} />
          <Route path="/owner/vehicle-management" element={<OwnerRoute><OwnerVehicleHome /></OwnerRoute>} />
          <Route path="/owner/dashboard" element={<OwnerRoute><OwnerVehicleDashboard /></OwnerRoute>} />
          
          <Route path="/owner/add-car" element={<OwnerRoute><AddCar /></OwnerRoute>} />
          <Route path="/owner/my-cars" element={<OwnerRoute><MyCars /></OwnerRoute>} />
          <Route path="/owner/edit-car/:id" element={<OwnerRoute><EditCar /></OwnerRoute>} />

          <Route path="/owner/add-bike" element={<OwnerRoute><AddBike /></OwnerRoute>} />
          <Route path="/owner/my-bikes" element={<OwnerRoute><MyBikes /></OwnerRoute>} />
          <Route path="/owner/edit-bike/:id" element={<OwnerRoute><EditBike /></OwnerRoute>} />

          {/* MASTER RENTAL MANAGEMENT */}
          <Route path="/owner/add" element={<OwnerRoute><AddRentalItem /></OwnerRoute>} />
          <Route path="/owner/my-rentals" element={<OwnerRoute><MyRentals /></OwnerRoute>} />
          <Route path="/owner/edit/:id" element={<OwnerRoute><EditRentalItem /></OwnerRoute>} />
          
          <Route path="/owner/my-bookings" element={<OwnerRoute><OwnerBookings /></OwnerRoute>} />
          <Route path="/owner/wallet" element={<OwnerRoute><OwnerWallet /></OwnerRoute>} />

          {/* ✅ FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}