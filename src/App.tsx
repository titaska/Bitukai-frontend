import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Reservations from "./pages/Reservations";
import NewReservation from "./pages/NewReservation";
import Staff from "./pages/Staff";
import Settings from "./pages/Settings";
import {Login} from "./pages/Login";
import { useState } from "react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {isAuthenticated && <Navbar />}
       
        <main style={{ marginLeft: "80px", padding: "20px", width: "100%" }}>
          <Routes>
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)}/>} />
            <Route
              path="/"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/reservations"
              element={isAuthenticated ? <Reservations /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/new-reservation"
              element={isAuthenticated ? <NewReservation /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/staff"
              element={isAuthenticated ? <Staff /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/settings"
              element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </main>

      </div>
    </Router>
  );
}


