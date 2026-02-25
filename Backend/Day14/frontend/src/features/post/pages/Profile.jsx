import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { getMyPostsApi } from "../services/post.api";
import CreatePost from "../components/CreatePost";
import ImageModal from "../components/ImageModal";
import "../style/profile.scss";

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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

  useEffect(() => {
    fetchMyPosts();
  }, []);

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
        <img src={user?.profileImage} alt={user?.username} />
        <h2>{user?.username}</h2>
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
