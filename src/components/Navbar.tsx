import { NavLink } from "react-router-dom";
import "./Navbar.css";
import {
  Calendar,
  Settings,
  Users,
  ClipboardPlus,
  ShoppingCart
} from "lucide-react";
import { NavbarProps } from "../types/navbar";

export default function Navbar({ businessType, userRole }: NavbarProps) {
  const cateringLinks = [
    { to: "/", icon: <ShoppingCart size={20} />, roles: ["STAFF", "OWNER", "SUPERADMIN"] },
    { to: "/new-order", icon: <ClipboardPlus size={20} />, roles: ["STAFF", "OWNER", "SUPERADMIN"] },
    { to: "/staff", icon: <Users size={20} />, roles: ["OWNER", "SUPERADMIN"] },
    { to: "/settings", icon: <Settings size={20} />, roles: ["SUPERADMIN"] },
  ];

  const beautyLinks = [
    { to: "/", icon: <Calendar size={20} />, roles: ["STAFF", "OWNER", "SUPERADMIN"] },
    { to: "/new-reservation", icon: <ClipboardPlus size={20} />, roles: ["STAFF", "OWNER", "SUPERADMIN"] },
    { to: "/staff", icon: <Users size={20} />, roles: ["OWNER", "SUPERADMIN"] },
    { to: "/settings", icon: <Settings size={20} />, roles: ["SUPERADMIN"] },
  ];

  const allLinks = businessType === "CATERING" ? cateringLinks : beautyLinks;
  const links = allLinks.filter(link => link.roles.includes(userRole));

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
