import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Orders from "./pages/Orders";
import NewOrder from "./pages/NewOrder";
import Reservations from "./pages/Reservations";
import NewReservation from "./pages/NewReservation";
import Staff from "./pages/Staff";
import Settings from "./pages/Settings";
import { Login } from "./pages/Login";
import { JSX, useState } from "react";
import { BusinessType } from "./types/business";
import { getBusinessByRegNumber } from "./hooks/getBusinessByRegNumber";
import { StaffRole } from "./types/staff";
import StaffDetailsPage from "./pages/StaffDetailsPage";

function RequireAuth({
  isAuthenticated,
  children,
}: {
  isAuthenticated: boolean;
  children: JSX.Element;
}) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [businessType, setBusinessType] = useState<BusinessType>("BEAUTY");
  const [userRole, setUserRole] = useState<StaffRole>("STAFF");
  const [registrationNumber, setRegistrationNumber] = useState<string | null>(null);

  const isCatering = businessType === "CATERING";

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {isAuthenticated && <Navbar businessType={businessType} userRole={userRole} />}

        <main style={{ marginLeft: "80px", padding: "20px", width: "100%" }}>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login
                    onLogin={async (staffDto) => {
                      const businessDto = await getBusinessByRegNumber(staffDto.registrationNumber);

                      setRegistrationNumber(staffDto.registrationNumber);
                      setBusinessType(businessDto.type);
                      setUserRole(staffDto.role);
                      setIsAuthenticated(true);
                    }}
                  />
                )
              }
            />

            <Route
              path="/"
              element={
                <RequireAuth isAuthenticated={isAuthenticated}>
                  {isCatering ? <Orders /> : <Reservations />}
                </RequireAuth>
              }
            />

            <Route
              path={isCatering ? "/new-order" : "/new-reservation"}
              element={
                <RequireAuth isAuthenticated={isAuthenticated}>
                  {isCatering ? <NewOrder /> : <NewReservation />}
                </RequireAuth>
              }
            />

            {/* STAFF LIST */}
            <Route
              path="/staff"
              element={
                <RequireAuth isAuthenticated={isAuthenticated}>
                  {(userRole === "OWNER" || userRole === "SUPERADMIN") ? (
                    registrationNumber ? (
                      <Staff registrationNumber={registrationNumber} businessType={businessType} />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  ) : (
                    <Navigate to="/" replace />
                  )}
                </RequireAuth>
              }
            />

            {/* STAFF DETAILS */}
            <Route
              path="/staff/:staffId"
              element={
                <RequireAuth isAuthenticated={isAuthenticated}>
                  {(userRole === "OWNER" || userRole === "SUPERADMIN") ? (
                    registrationNumber ? (
                      <StaffDetailsPage registrationNumber={registrationNumber} businessType={businessType}/>
                    ) : (
                      <Navigate to="/" replace />
                    )
                  ) : (
                    <Navigate to="/" replace />
                  )}
                </RequireAuth>
              }
            />

            {/* SETTINGS / PRODUCTS */}
            <Route
              path="/settings"
              element={
                <RequireAuth isAuthenticated={isAuthenticated}>
                  {userRole === "SUPERADMIN" ? (
                    registrationNumber ? (
                      <Settings registrationNumber={registrationNumber} />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  ) : (
                    <Navigate to="/" replace />
                  )}
                </RequireAuth>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
