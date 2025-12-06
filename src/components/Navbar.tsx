import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { BusinessType } from "../types/business";
import {
  Home,
  Calendar,
  Settings,
  Users,
  ClipboardPlus,
  ShoppingCart
} from "lucide-react";

// TEMPORARY — mock business type
const businessType: BusinessType = "beauty";
// Change to "catering" to test

export default function Navbar() {
  const cateringLinks = [
    { to: "/",  icon: <Home size={20} /> },
    { to: "/create-order", icon: <ClipboardPlus size={20} /> },
    { to: "/orders", icon: <ShoppingCart size={20} /> },
    { to: "/staff", icon: <Users size={20} /> },
    { to: "/settings", icon: <Settings size={20} /> },
  ];

  const beautyLinks = [
    { to: "/", icon: <Home size={20} /> },
    { to: "/new-reservation", icon: <ClipboardPlus size={20} /> },
    { to: "/reservations", icon: <Calendar size={20} /> },
    { to: "/staff", icon: <Users size={20} /> },
    { to: "/settings", icon: <Settings size={20} /> },
  ];

  const links = businessType === "catering" ? cateringLinks : beautyLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" />

      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <div className="icon">{link.icon}</div>
            
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
