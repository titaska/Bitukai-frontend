import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import Reservations from "./pages/Reservations";
import NewReservation from "./pages/NewReservation";
import StaffListPage from "./pages/StaffListPage";
import StaffDetailsPage from "./pages/StaffDetailsPage";
import ConfigurationPage from "./pages/ConfigurationPage";

export default function App() {

  const isAuthenticated = true;

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {isAuthenticated && <Navbar />}

        <main style={{ marginLeft: "80px", padding: "20px", width: "100%" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/reservations" replace />} />

            <Route path="/reservations" element={<Reservations />} />
            <Route path="/reservations/new" element={<NewReservation />} />

            <Route path="/staff" element={<StaffListPage />} />
            <Route path="/staff/:staffId" element={<StaffDetailsPage />} />

            <Route path="/config" element={<ConfigurationPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
