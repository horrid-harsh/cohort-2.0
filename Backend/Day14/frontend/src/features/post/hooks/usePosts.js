import { useContext, useCallback } from "react";
import { PostContext } from "../post.context";
import {
  getFeedApi,
  likePostApi,
  dislikePostApi,
  createPostApi,
  deletePostApi,
} from "../services/post.api";

export const usePosts = () => {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }

  const { posts, setPosts, loading, setLoading } = context;

  const createPost = useCallback(
    async (formData) => {
      try {
        const data = await createPostApi(formData);
        // Optimistically add to top if appropriate, or just return data
        setPosts((prev) => [data.post, ...prev]);
        return data;
      } catch (error) {
        console.error("Failed to create post:", error);
        throw error;
      }
    },
    [setPosts],
  );

  const deletePost = useCallback(
    async (postId) => {
      try {
        await deletePostApi(postId);
        setPosts((prev) => prev.filter((post) => post._id !== postId));
      } catch (error) {
        console.error("Failed to delete post:", error);
        throw error;
      }
    },
    [setPosts],
  );

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFeedApi();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Failed to fetch feed:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setPosts]);

  const updatePostLike = useCallback(
    async (postId, currentlyLiked) => {
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
    },
    [setPosts],
  );

  return {
    posts,
    loading,
    fetchFeed,
    updatePostLike,
    createPost,
    deletePost,
    setPosts,
  };
};
