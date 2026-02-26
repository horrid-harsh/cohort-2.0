import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { getMyPostsApi } from "../services/post.api";
import { getUserProfileApi } from "../../auth/services/user.api";
import CreatePost from "../components/CreatePost";
import ImageModal from "../components/ImageModal";
import EditProfile from "../components/EditProfile";
import { usePosts } from "../hooks/usePosts";
import "../style/profile.scss";

const Profile = () => {
  const { user } = useAuth();
  const { deletePost } = usePosts();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeOptions, setActiveOptions] = useState(null);

  const fetchMyPosts = async () => {
    try {
      const data = await getMyPostsApi();
      setPosts(data.posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileStats = async () => {
    if (!user?.username) return;
    try {
      const data = await getUserProfileApi(user.username);
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handlePostCreated = () => {
    fetchMyPosts();
    fetchProfileStats();
  };

  useEffect(() => {
    fetchMyPosts();
    fetchProfileStats();
  }, [user?.username]);

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

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button
          className="create-post-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Create New Post
        </button>
      </div>

      <CreatePost
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />

      <EditProfile
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <ImageModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <div className="user-profile-info">
        <div className="profile-image-container">
          <img src={user?.profileImage} alt={user?.username} />
        </div>

        <div className="profile-details">
          <div className="username-row">
            <h2>{user?.username}</h2>
            <button
              className="edit-profile-btn"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Profile
            </button>
          </div>

          <div className="stats-row">
            <span>
              <strong>{stats.postsCount}</strong> posts
            </span>
            <span>
              <strong>{stats.followersCount}</strong> followers
            </span>
            <span>
              <strong>{stats.followingCount}</strong> following
            </span>
          </div>

          <div className="bio-section">
            {user?.bio ? (
              <p>{user.bio}</p>
            ) : (
              <>
                <p>🖤 #F*King bitches keep distance 🖤</p>
                <p>☠️ No love No pain stay single only gain ☠️</p>
              </>
            )}
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
