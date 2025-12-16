import { NavLink } from "react-router-dom";
import "./Navbar.css";
import {
  Calendar,
  Settings,
  Users,
  ClipboardPlus,
  ClipboardList,
} from "lucide-react";
import { NavbarProps } from "../types/navbar";

export default function Navbar({ businessType, userRole }: NavbarProps) {
  const cateringLinks = [
      { to: "/", icon: <ClipboardList size={20} />, roles: ["1", "2", "3"] },
      { to: "/new-order", icon: <ClipboardPlus size={20} />, roles: ["1", "2", "3"] },
      { to: "/staff", icon: <Users size={20} />, roles: ["2", "3"] },
      { to: "/settings", icon: <Settings size={20} />, roles: ["3"] },
  ];

  const beautyLinks = [
    { to: "/", icon: <Calendar size={20} />, roles: ["1", "2", "3"] },
    { to: "/new-reservation", icon: <ClipboardPlus size={20} />, roles: ["1", "2", "3"] },
    { to: "/staff", icon: <Users size={20} />, roles: ["2", "3"] },
    { to: "/settings", icon: <Settings size={20} />, roles: ["3"] },
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
