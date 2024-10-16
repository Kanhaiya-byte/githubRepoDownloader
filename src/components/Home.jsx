import React from "react";
import SearchRepo from "./SearchRepo";
import DownloadForm from "./DownloadForm";
import { useAppContext } from "../store/AppContext";

const Home = () => {
  const [repoUrl, setRepoUrl] = React.useState("");
  const { setRepoDetails } = useAppContext();

  return (
    <div className="container mt-4">
      <SearchRepo setRepoUrl={setRepoUrl} />
      <DownloadForm initialRepoUrl={repoUrl} setRepoDetails={setRepoDetails} />
    </div>
  );
};

export default Home;
