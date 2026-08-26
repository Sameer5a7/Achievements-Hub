import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import "../../Css/DetailStory.css";
import Loader from '../GeneralScreens/Loader';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiEdit, FiArrowLeft } from 'react-icons/fi';
import { FaRegComment } from 'react-icons/fa';
import { BsBookmarkPlus, BsBookmarkFill } from 'react-icons/bs';
import CommentSidebar from '../CommentScreens/CommentSidebar';

const DetailStory = () => {
  const [likeStatus, setLikeStatus] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [activeUser, setActiveUser] = useState({});
  const [story, setStory] = useState({});
  const [sidebarShowStatus, setSidebarShowStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [storyReadListStatus, setStoryReadListStatus] = useState(false);

  const slug = useParams().slug;
  const navigate = useNavigate();

  useEffect(() => {
    const getDetailStory = async () => {
      setLoading(true);
      let activeUserData = {};

      // Get current user
      try {
        const { data } = await axios.get("/auth/private", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        activeUserData = data.user;
        setActiveUser(activeUserData);
      } catch (error) {
        setActiveUser({});
      }

      // Get story details
      try {
        const { data } = await axios.post(`/story/${slug}`, { activeUser: activeUserData });
        setStory(data.data);
        setLikeStatus(data.likeStatus);
        setLikeCount(data.data.likeCount);
        setLoading(false);

        if (activeUserData.readList && activeUserData.readList.includes(data.data._id)) {
          setStoryReadListStatus(true);
        } else {
          setStoryReadListStatus(false);
        }
      } catch (error) {
        setStory({});
        navigate("/not-found");
      }
    };

    getDetailStory();
  }, [slug, navigate]);

  const handleLike = async () => {
    setLikeStatus(!likeStatus);
    try {
      const { data } = await axios.post(`/story/${slug}/like`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setLikeCount(data.data.likeCount);
    } catch (error) {
      setStory({});
      localStorage.removeItem("authToken");
      navigate("/");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Do you want to delete this post?")) {
      try {
        await axios.delete(`/story/${slug}/delete`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const editDate = (createdAt) => {
    const d = new Date(createdAt);
    return d.toLocaleString('eng', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const addStoryToReadList = async () => {
    try {
      const { data } = await axios.post(`/user/${slug}/addStoryToReadList`, { activeUser }, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setStoryReadListStatus(data.status);
      document.getElementById("readListLength").textContent = data.user.readListLength;
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <Loader />;

  // Correct story image path
  const storyImage = story.image
    ? story.image.startsWith("/storyImages") || story.image.startsWith("http")
      ? story.image
      : `/storyImages/${story.image}`
    : "/storyImages/default.jpg";

  // Correct author profile image path
  const userProfileImage = story.author?.photo
    ? story.author.photo.startsWith("/userPhotos") || story.author.photo.startsWith("http")
      ? story.author.photo
      : `/userPhotos/${story.author.photo}`
    : "/userPhotos/defaultUser.jpg";

  return (
    <div className='Inclusive-detailStory-page'>
      <div className="top_detail_wrapper">
        <Link to={'/'}>
          <FiArrowLeft />
        </Link>
        <h5>{story.title}</h5>

        <div className='story-general-info'>
          <ul>
            {story.author &&
              <li className='story-author-info'>
                <img 
                  src={userProfileImage} 
                  alt={story.author.username || "user"} 
                  onError={(e) => e.target.src='/userPhotos/defaultUser.jpg'}
                />
                <span className='story-author-username'>{story.author.username}</span>
              </li>
            }
            <li className='story-createdAt'>{editDate(story.createdAt)}</li>
            <b>-</b>
            <li className='story-readtime'>{story.readtime} min read</li>
          </ul>

          {!activeUser.username &&
            <div className='comment-info-wrap'>
              <i onClick={() => setSidebarShowStatus(!sidebarShowStatus)}>
                <FaRegComment />
              </i>
              <b className='commentCount'>{story.commentCount}</b>
            </div>
          }

          {activeUser && story.author && story.author._id === activeUser._id &&
            <div className="top_story_transactions">
              <Link className='editStoryLink' to={`/story/${story.slug}/edit`}><FiEdit /></Link>
              <span className='deleteStoryLink' onClick={handleDelete}><RiDeleteBin6Line /></span>
            </div>
          }
        </div>
      </div>

      <CommentSidebar
        slug={slug}
        sidebarShowStatus={sidebarShowStatus}
        setSidebarShowStatus={setSidebarShowStatus}
        activeUser={activeUser}
      />

      <div className='story-content'>
        <div className="story-banner-img">
          <img src={storyImage} alt={story.title} />
        </div>

        <div className='content' dangerouslySetInnerHTML={{ __html: story.content }}></div>

        {story.pdf &&
          <div className="story-pdf-download">
            <a href={story.pdf} target="_blank" rel="noopener noreferrer">
              📄 Download PDF
            </a>
          </div>
        }
      </div>

      {activeUser.username &&
        <div className='fixed-story-options'>
          <ul>
            <li>
              <i onClick={handleLike}>{likeStatus ? <FaHeart color="#0063a5" /> : <FaRegHeart />}</i>
              <b className='likecount' style={{ color: likeStatus ? "#0063a5" : "rgb(99, 99, 99)" }}>
                {likeCount}
              </b>
            </li>
            <li>
              <i onClick={() => setSidebarShowStatus(!sidebarShowStatus)}><FaRegComment /></i>
              <b className='commentCount'>{story.commentCount}</b>
            </li>
          </ul>

          <ul>
            <li>
              <i onClick={addStoryToReadList}>
                {storyReadListStatus ? <BsBookmarkFill color='#0205b1' /> : <BsBookmarkPlus />}
              </i>
            </li>
          </ul>
        </div>
      }
    </div>
  );
};

export default DetailStory;
