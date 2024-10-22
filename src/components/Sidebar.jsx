import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
      style={{ height: "90vh" }}
    >
      <a
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <span className="fs-4">Sidebar</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : "text-white"}`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/repo-message"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : "text-white"}`
            }
          >
            Repo Message
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
