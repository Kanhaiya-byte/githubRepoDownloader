import React, { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../store/AppContext";
import { CiSearch } from "react-icons/ci";
import "../App.css";

const SearchRepo = ({ setRepoUrl }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setRepoDetails } = useAppContext();

  const fetchRepositories = useCallback(async (query) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.get(
        `https://api.github.com/search/repositories`,
        { params: { q: query, sort: "stars", order: "desc" } }
      );
      setRepos(response.data.items);
      if (response.data.items.length === 0) {
        setMessage("No repositories found.");
      }
    } catch (error) {
      console.error("Error searching repositories:", error);
      setMessage("An error occurred while fetching repositories.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      fetchRepositories(searchQuery);
    }
  };

  const handleSelectRepo = (repo) => {
    const owner = repo.owner.login;
    const repoName = repo.name;

    setRepoUrl(`${owner}/${repoName}`);
    setRepoDetails({
      name: repo.full_name,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      description: repo.description,
    });

    navigate("/repo-message");
  };

  return (
    <div className="container">
      <form
        className="search-form d-flex align-items-center"
        role="search"
        onSubmit={handleSearch}
      >
        <input
          className="form-control me-2"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter username/repo (e.g., Kanhaiya-byte/githubRepoDownloader)"
          aria-label="Search"
        />
        <button
          className="btn btn-dark"
          type="submit"
          disabled={loading || !searchQuery}
        >
          <CiSearch />
        </button>
      </form>
      {loading && (
        <div className="d-flex justify-content-center mt-3">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
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
      <ul className="list-group mt-3">
        {repos.map((repo) => (
          <li
            key={repo.id}
            className="list-group-item list-group-item-action"
            onClick={() => handleSelectRepo(repo)}
            style={{ cursor: "pointer" }}
          >
            {repo.full_name} ⭐ {repo.stargazers_count} 🍴 {repo.forks_count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchRepo;
