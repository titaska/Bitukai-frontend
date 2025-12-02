import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Button color="inherit" component={Link} to="/reservations">
          Reservations
        </Button>
        <Button color="inherit" component={Link} to="/reservations/new">
          New Reservation
        </Button>
      </Toolbar>
    </AppBar>
  );
}
