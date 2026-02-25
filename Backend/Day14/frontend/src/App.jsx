import "./features/shared/global.scss";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./features/auth/auth.context";
import { PostProvider } from "./features/post/post.context";
import { router } from "./app.routes";

const App = () => {
  return (
    <AuthProvider>
      <PostProvider>
        <RouterProvider router={router} />
      </PostProvider>
    </AuthProvider>
  );
};

export default App;
