import { createContext, useState } from "react";
import { Post } from "../api/db";

export const PostListContext = createContext(null);

export const PostListProvider = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  const addPost = (newPost) => {
    setPosts([...posts, newPost]);
  };

  const editPost = (index, updatedPosts) => {
    const updatedPosts_ = [...posts];
    updatedPosts_[index] = updatedPosts;
    setPosts(updatedPosts_);
  };

  const deletePost = (index) => {
    const updatedPosts_ = posts.filter((_, i) => i !== index);
    setPosts(updatedPosts_);
  };

  return (
    <PostListContext.Provider value={{ posts, addPost, editPost, deletePost }}>
      {children}
    </PostListContext.Provider>
  );
};
