import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Reservations from "./pages/reservationsPage/Reservations";
import NewReservation from "./pages/NewReservation";
import Staff from "./pages/Staff";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        
       
        <Navbar />

        
        <main style={{ marginLeft: "80px", width: "100%" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/new-reservation" element={<NewReservation />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}


