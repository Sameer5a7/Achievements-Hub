import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SkeletonStory from "../Skeletons/SkeletonStory";
import CardStory from "../StoryScreens/CardStory";
import NoStories from "../StoryScreens/NoStories";
import Pagination from "./Pagination";
import "../../Css/Home.css";

const Home = () => {
  const search = useLocation().search;
  const searchKey = new URLSearchParams(search).get("search");

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [branchFilter, setBranchFilter] = useState("ALL"); 

  const navigate = useNavigate();

  useEffect(() => {
    const getStories = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `/story/getAllStories?search=${searchKey || ""}&branch=${branchFilter}&page=${page}`
        );

        if (searchKey || branchFilter !== "ALL") {
          navigate({
            pathname: "/",
            search: `?search=${searchKey || ""}${branchFilter !== "ALL" ? `&branch=${branchFilter}` : ""}${page > 1 ? `&page=${page}` : ""}`,
          });
        } else {
          navigate({
            pathname: "/",
            search: `${page > 1 ? `page=${page}` : ""}`,
          });
        }

        setStories(data.data);
        setPages(data.pages);
        setLoading(false);
      } catch (error) {
        setLoading(true);
      }
    };
    getStories();
  }, [search, page, branchFilter, navigate]);

  useEffect(() => {
    setPage(1);
  }, [searchKey, branchFilter]);

  return (
    <div className="Inclusive-home-page">
      {/*  Branch Filter Bar */}
      <div className="branch-filters">
        {["ALL", "CSE", "EEE", "ECE", "MECH", "CIVIL"].map((b) => (
          <button
            key={b}
            className={`branch-btn ${branchFilter === b ? "active" : ""}`}
            onClick={() => setBranchFilter(b)}
          >
            {b}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="skeleton_emp">
          {[...Array(6)].map(() => (
            <SkeletonStory key={uuidv4()} />
          ))}
        </div>
      ) : (
        <div>
          <div className="story-card-wrapper">
            {stories.length !== 0 ? (
              stories.map((story) => (
                <CardStory key={uuidv4()} story={story} />
              ))
            ) : (
              <NoStories />
            )}

            <img className="bg-planet-svg" src="planet.svg" alt="planet" />
            <img className="bg-planet2-svg" src="planet2.svg" alt="planet" />
            <img className="bg-planet3-svg" src="planet3.svg" alt="planet" />
          </div>

          <Pagination page={page} pages={pages} changePage={setPage} />
        </div>
      )}
      <br />
    </div>
  );
};

export default Home;
