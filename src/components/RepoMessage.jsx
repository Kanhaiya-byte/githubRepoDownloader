import React from "react";
import { useAppContext } from "../store/AppContext";

const RepoMessage = () => {
  const { repoDetails, message } = useAppContext();

  return (
    <div className="container mt-4">
      <h1 className="repo-details">Repository Details</h1>
      {repoDetails ? (
        <div>
          <h2>{repoDetails.name}</h2>
          <p>
            <strong>Stars:</strong> {repoDetails.stars} ⭐
          </p>
          <p>
            <strong>Forks:</strong> {repoDetails.forks} 🍴
          </p>
          <p>
            <strong>Description:</strong> {repoDetails.description}
          </p>
        </div>
      ) : (
        <p>No repository details available.</p>
      )}
      {message && (
        <div
          className={`alert ${
            message.startsWith("No") ? "alert-warning" : "alert-danger"
          } mt-3`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default RepoMessage;
