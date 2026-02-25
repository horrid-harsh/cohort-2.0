import { useContext } from "react";
import { PostContext } from "../post.context";
import { getFeedApi, likePostApi, dislikePostApi } from "../services/post.api";

export const usePosts = () => {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }

  const { posts, setPosts, loading, setLoading } = context;

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const data = await getFeedApi();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Failed to fetch feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePostLike = async (postId, currentlyLiked) => {
    // 1. Optimistic Update (Update UI immediately)
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            isLiked: !currentlyLiked,
            likesCount: currentlyLiked
              ? (post.likesCount || 1) - 1
              : (post.likesCount || 0) + 1,
          };
        }
        return post;
      }),
    );

    // 2. Perform API call
    try {
      if (currentlyLiked) {
        await dislikePostApi(postId);
      } else {
        await likePostApi(postId);
      }
    } catch (error) {
      console.error("Like toggle failed, rolling back:", error);
      // 3. Rollback on failure
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              isLiked: currentlyLiked,
              likesCount: currentlyLiked
                ? (post.likesCount || 0) + 1
                : (post.likesCount || 1) - 1,
            };
          }
          return post;
        }),
      );
    }
  };

  return {
    posts,
    loading,
    fetchFeed,
    updatePostLike,
    setPosts,
  };
};
