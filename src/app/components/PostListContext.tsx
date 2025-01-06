import { createContext /*useState*/ } from "react";
// import { Post } from "../api/db";

export const PostListContext = createContext(null);
export const PostListProvider = (
  {
    /*not implemented */
  }
) => {};

// export const PostListProvider = ({ children }) => {
//   const [posts, setPosts] = useState<Post[]>([]);

//   const addPost = (newPost: Post) => {
//     setPosts([...posts, newPost]);
//   };

//   const editPost = (index: number, updatedPosts: Post) => {
//     const updatedPosts_ = [...posts];
//     updatedPosts_[index] = updatedPosts;
//     setPosts(updatedPosts_);
//   };

//   const deletePost = (index: number) => {
//     const updatedPosts_ = posts.filter((_, i) => i !== index);
//     setPosts(updatedPosts_);
//   };

//   return (
//     <PostListContext.Provider value={{ posts, addPost, editPost, deletePost }}>
//       {children}
//     </PostListContext.Provider>
//   );
// };
