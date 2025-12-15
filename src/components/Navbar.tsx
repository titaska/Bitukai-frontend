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
