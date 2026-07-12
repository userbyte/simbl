// "use client";
import { getPost, getPosts } from "../library/db";
import { Post_ } from "./Post";
// import { useContext } from "react";
// import { PostListContext } from "./PostListContext";
import styles from "@/app/style/module/PostList.module.css";

async function buildPostList() {
  const post_el_list: React.JSX.Element[] = [];
  // i have to await this for the reverse order to work later, i dont understand it but it works so whatever
  await getPosts().then((posts) => {
    if (posts === false) {
      // no posts could be found, return empty element
      post_el_list.push(<></>);
    } else {
      // sort posts by their timestamp
      posts.sort((a, b) => a.timestamp - b.timestamp);

      // create a post object element for every post
      posts.forEach((post) => {
        getPost(post.id).then((postObj) => {
          if (postObj != false) {
            // add post element to list
            post_el_list.push(
              <Post_ key={post.id} post={postObj} renderSettings={{}} />
            );
          }
        });
      });
    }
  });
  // reverse array so its newest -> oldest
  const reversed_post_el_list = post_el_list.reverse();
  return reversed_post_el_list;
}

export default async function PostList() {
  return (
    <div id="posts" className={styles.main}>
      {await buildPostList()}
    </div>
  );
}
