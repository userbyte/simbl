// "use client";
import { GetPost, GetPosts } from "../api/db";
import { PostObjectElement } from "../shared";
// import { useContext } from "react";
// import { PostListContext } from "./PostListContext";

async function buildPostList() {
  const post_el_list: React.JSX.Element[] = [];
  // i have to await this for the reverse order to work later, i dont understand it but it works so whatever
  await GetPosts().then((posts) => {
    if (posts === false) {
      // no posts could be found, return empty element
      post_el_list.push(<></>);
    } else {
      // sort posts by their timestamp
      posts.sort((a, b) => a.timestamp - b.timestamp);

      // create a post object element for every post
      posts.forEach((post) => {
        GetPost(post.id).then((post_obj) => {
          if (post_obj != false) {
            const post_el = PostObjectElement(post_obj);

            // add post element to list
            post_el_list.push(post_el);
          }
        });
      });
    }
  });
  // reverse array so its newest -> oldest
  const reversed_post_el_list = post_el_list.reverse();
  return reversed_post_el_list;
}

// function BuildPostList2() {
//   const { posts, addPost, editPost } = useContext(PostListContext);
//   return <></>;
// }

// export default async function PostList({ ref }) {
export default async function PostList() {
  return (
    <div id="posts">
      {/* <!-- <div class="post-container">
            <div class="post-content">
                <!- - an example post - ->
                <div class="post-info">
                    <div class="post-author">
                        <picture>
                            <!- - <source srcset="files/img/webp/default_pfp.webp" type="image/webp"> - ->
                            <source srcset="files/img/svg/default_pfp.svg" type="image/svg"> 
                            <source srcset="files/img/png/default_pfp.png" type="image/png"> 
                            <img src="files/img/png/default_pfp.png" alt="pfp" class="banners">
                        </picture>
                        <p>user</p>
                    </div>
                    <div class="post-timestamp"><p>1/1/1970 12:00AM</p></div></div>
                <div class="post-text"><p>this is an example post on simbl, a solo microblogging platform.</p></div>
            </div>
        </div> --> */}
      {await buildPostList()}
    </div>
  );
}
