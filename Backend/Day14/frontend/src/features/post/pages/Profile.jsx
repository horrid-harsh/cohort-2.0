import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useAuth } from "../../auth/hooks/useAuth";
import { getMyPostsApi, getUserPostsApi } from "../services/post.api";
import {
  getUserProfileApi,
  getFollowersApi,
  getFollowingApi,
} from "../../auth/services/user.api";
import CreatePost from "../components/CreatePost";
import ImageModal from "../components/ImageModal";
import EditProfile from "../components/EditProfile";
import FollowListModal from "../components/FollowListModal";
import { usePosts } from "../hooks/usePosts";
import "../style/profile.scss";

const Profile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const { user: authUser } = useAuth();
  const isOwner = !username || username === authUser?.username;

  const { deletePost } = usePosts();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [followListData, setFollowListData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeOptions, setActiveOptions] = useState(null);

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const data = isOwner
        ? await getMyPostsApi()
        : await getUserPostsApi(username);
      setPosts(data.posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileStats = async () => {
    const targetUsername = username || authUser?.username;
    if (!targetUsername) return;
    try {
      const data = await getUserProfileApi(targetUsername);
      setProfileUser(data.user);
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handlePostCreated = () => {
    fetchUserPosts();
    fetchProfileStats();
  };

  useEffect(() => {
    fetchUserPosts();
    fetchProfileStats();
  }, [username, authUser?.username]);

  const deleteMyPost = async (postId) => {
    try {
      await deletePost(postId);
      fetchMyPosts();
      fetchProfileStats();
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const toggleOptions = (e, postId) => {
    e.stopPropagation();
    setActiveOptions(activeOptions === postId ? null : postId);
  };

  const openFollowModal = async (title) => {
    const targetUsername = username || authUser?.username;
    if (!targetUsername) return;
    setModalTitle(title);
    setIsFollowModalOpen(true);
    setModalLoading(true);
    setFollowListData([]);

    try {
      if (title === "Followers") {
        const data = await getFollowersApi(targetUsername);
        setFollowListData(data);
      } else {
        const data = await getFollowingApi(targetUsername);
        setFollowListData(data);
      }
    } catch (error) {
      console.error(`Failed to fetch ${title.toLowerCase()}:`, error);
    } finally {
      setModalLoading(false);
    }
  };

  const displayUser = isOwner ? authUser : profileUser;

  return (
    <div className="profile-page">
      <div className="back-nav" onClick={() => navigate(-1)}>
        <IoArrowBack size={24} />
        <span>Go back</span>
      </div>
      {isOwner && (
        <>
          <CreatePost
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPostCreated={handlePostCreated}
          />

          <EditProfile
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
          />
        </>
      )}

      <ImageModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <FollowListModal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
        title={modalTitle}
        users={followListData}
        loading={modalLoading}
      />

      <div className="user-profile-info">
        <div className="profile-image-container">
          <img src={displayUser?.profileImage} alt={displayUser?.username} />
        </div>

        <div className="profile-details">
          <div className="username-row">
            <h2>{displayUser?.username}</h2>
            {isOwner && (
              <>
                <button
                  className="edit-profile-btn"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Edit Profile
                </button>
                <button
                  className="edit-profile-btn create-post-btn"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create Post
                </button>
              </>
            )}
          </div>

          <div className="stats-row">
            <span>
              <strong>{stats.postsCount}</strong> posts
            </span>
            <span
              className="stat-clickable"
              onClick={() => openFollowModal("Followers")}
            >
              <strong>{stats.followersCount}</strong> followers
            </span>
            <span
              className="stat-clickable"
              onClick={() => openFollowModal("Following")}
            >
              <strong>{stats.followingCount}</strong> following
            </span>
          </div>

          <div className="bio-section">
            {displayUser?.bio ? <p>{displayUser.bio}</p> : <p>No bio yet</p>}
          </div>
        </div>
      </div>

      <div className="posts-grid">
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="post-item"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedImage(post.imgUrl)}
            >
              {isOwner && (
                <div
                  className="post-options-btn"
                  onClick={(e) => toggleOptions(e, post._id)}
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    height="20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="256" cy="256" r="48"></circle>
                    <circle cx="416" cy="256" r="48"></circle>
                    <circle cx="96" cy="256" r="48"></circle>
                  </svg>

                  {activeOptions === post._id && (
                    <div className="options-dropdown">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              "Are you sure you want to delete this post?",
                            )
                          ) {
                            deleteMyPost(post._id);
                            setActiveOptions(null);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}

              <img src={post.imgUrl} alt={post.caption} />
              <p className="caption">{post.caption}</p>
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
