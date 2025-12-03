import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import Navbar from "./components/Navbar";
import Reservations from "./pages/Reservations/Reservations";
import NewReservation from "./pages/Reservations/NewReservation";
import StaffListPage from "./pages/Staff/StaffListPage";
import StaffDetailsPage from "./pages/Staff/StaffDetailsPage";
import ConfigurationPage from "./pages/ConfigurationPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/reservations/new" element={<NewReservation />} />
        <Route path="/staff" element={<StaffListPage />} />
        <Route path="/staff/:staffId" element={<StaffDetailsPage />} />
        <Route path="/config" element={<ConfigurationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
