import { createContext, useState } from "react";

export const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <PostContext.Provider value={{ posts, setPosts, loading, setLoading }}>
      {children}
    </PostContext.Provider>
  );
}
