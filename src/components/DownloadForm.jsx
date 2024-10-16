import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const DownloadForm = ({ initialRepoUrl, setRepoDetails }) => {
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl || "");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setRepoUrl(initialRepoUrl);
  }, [initialRepoUrl]);

  const normalizeRepoUrl = (url) => {
    if (url.startsWith("https://github.com/")) {
      const parts = url.split("https://github.com/")[1].split("/");
      if (parts.length === 2) {
        return { owner: parts[0], repo: parts[1] };
      }
    } else {
      const parts = url.split("/");
      if (parts.length === 2) {
        return { owner: parts[0], repo: parts[1] };
      }
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const repoInfo = normalizeRepoUrl(repoUrl);
      if (!repoInfo) {
        throw new Error(
          "Invalid repository URL format. It should be either a full GitHub URL or 'username/repo'."
        );
      }

      const { owner, repo } = repoInfo;

      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}`
      );
      setRepoDetails({
        name: response.data.full_name,
        stars: response.data.stargazers_count,
        forks: response.data.forks_count,
        description: response.data.description,
      });

      // Proceed with download logic
      const downloadResponse = await axios.post(
        "http://127.0.0.1:5000/download",
        { repo_url: `${owner}/${repo}` },
        { responseType: "blob" }
      );

      const downloadUrl = window.URL.createObjectURL(
        new Blob([downloadResponse.data])
      );
      const contentDisposition =
        downloadResponse.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : `${repo}.zip`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setMessage("Download started. Check your downloads folder.");
    } catch (error) {
      console.error("Download error:", error);
      setMessage(
        error.response?.data?.error ||
          "An error occurred. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="text-center mb-4">Download GitHub Repository</h1>
          <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
            <div className="form-group">
              <label htmlFor="repoUrl">Repository URL</label>
              <input
                type="text"
                className="form-control"
                id="repoUrl"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="Enter GitHub URL (e.g., https://github.com/user/repo) or 'user/repo'"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-3 w-100"
              disabled={isLoading || !repoUrl}
            >
              {isLoading ? "Downloading..." : "Download"}
            </button>
            {message && (
              <div
                className={`alert mt-3 ${
                  message.startsWith("Failed")
                    ? "alert-danger"
                    : "alert-success"
                }`}
                role="alert"
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DownloadForm;
