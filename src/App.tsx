import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Reservations from "./pages/Reservations";
import NewReservation from "./pages/NewReservation";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/reservations/new" element={<NewReservation />} />
      </Routes>
    </Router>
  );
}

export default App;
