import React from "react";
import { Outlet } from "react-router-dom";
import { useAppContext } from "./store/AppContext";

const App = () => {
  const { message } = useAppContext() || {};

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">
          GitHub Repo Downloader
        </a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/repo-message">
                Repo Message
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mt-4">
        <Outlet />
      </div>

      {message && (
        <div
          className={`alert mt-3 ${
            message.startsWith("No") ? "alert-warning" : "alert-danger"
          }`}
          role="alert"
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default App;
