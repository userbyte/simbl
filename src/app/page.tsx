import PostList from "./components/PostList";
import SubmitPost from "./components/SubmitPost";
// import styles from "./page.module.css";

// enable dynamic rendering cuz PostList
export const revalidate = 0;

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
