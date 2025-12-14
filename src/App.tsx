import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Reservations from "./pages/Reservations";
import NewReservation from "./pages/NewReservation";
import Staff from "./pages/Staff";
import Settings from "./pages/Settings";
import NewOrder from "./pages/NewOrder";
import Orders from "./pages/Orders";
import EditOrder from "./pages/EditOrder";

export default function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        
       
        <Navbar />

        
        <main style={{ marginLeft: "80px", padding: "20px", width: "100%" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/new-reservation" element={<NewReservation />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/create-order" element={<NewOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/edit-order/:orderId" element={<EditOrder />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}


