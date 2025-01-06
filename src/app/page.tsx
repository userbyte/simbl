import PostList from "./components/PostList";
import SubmitPost from "./components/SubmitPost";
// import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      {/* <!doctype html> */}
      <div id="main-content">
        {/* <!-- <h1>posts</h1> --> */}
        <div id="upload-post">
          <SubmitPost />
        </div>
        <PostList />
      </div>
    </>
  );
}
