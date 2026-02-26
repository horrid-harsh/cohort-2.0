import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { getMyPostsApi } from "../services/post.api";
import CreatePost from "../components/CreatePost";
import ImageModal from "../components/ImageModal";
import { usePosts } from "../hooks/usePosts";
import "../style/profile.scss";

const Profile = () => {
  const { user } = useAuth();
  const { deletePost } = usePosts();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const deleteMyPost = async (postId) => {
    try {
      await deletePost(postId);
      fetchMyPosts();
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

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
        onPostCreated={fetchMyPosts}
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
            <button className="edit-profile-btn">Edit Profile</button>
          </div>

          <div className="stats-row">
            <span>
              <strong>{posts.length}</strong> posts
            </span>
            <span>
              <strong>39</strong> followers
            </span>
            <span>
              <strong>65</strong> following
            </span>
          </div>

          <div className="bio-section">
            <p>🖤 #F*King bitches keep distance 🖤</p>
            <p>☠️ No love No pain stay single only gain ☠️</p>
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
