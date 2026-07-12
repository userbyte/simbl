import { postObj, postRenderSettings } from "../models/post";
import { prettifyUnixTime } from "../shared";
import CopyLinkBtn from "./CopyLinkBtn";
import styles from "@/app/style/module/Post.module.css";

export function Post({
  post,
  renderSettings,
}: {
  post: postObj;
  renderSettings: postRenderSettings | undefined;
}): React.JSX.Element {
  if (!renderSettings) {
    renderSettings = {};
  }
  const id = post.id;
  const timestamp = post.timestamp;
  const author = post.author;
  const text_content = post.text;

  return (
    // <div className="post-container" id={`post-${id}`}>
    //   {/* buttons */}
    //   <form action={handleEdit}>
    //     <button id="edit-post-btn"><i className="fas fa-edit"/></button>
    //   </form>
    //   <form action={handleDelete}>
    //     <button id="delete-post-btn"><i className="fas fa-trash-alt"/></button>
    //   </form>
    //   <div className="post-content">

    //   </div>
    // </div>

    <div className={styles.post_container} id={`post-${id}`} key={id}>
      {/* <button id="edit-post-btn" style="display: block;">
        <i className="fas fa-edit" />
      </button>
      <button
        id="delete-post-btn"
        onclick={handleDelete}
        style="display: block;"
      >
        <i className="fas fa-trash-alt" />
      </button> */}
      <div
        className={styles.post_content}
        // onClick="location.href = 'post.html?id=c23f5c9667'"
      >
        <div className={styles.post_info}>
          <div className={styles.post_author}>
            <picture>
              {/* <source srcset="files/img/webp/default_pfp.webp" type="image/webp"> */}
              <source srcSet={`/api/user/pfp/${author}`} />
              <source srcSet="/img/svg/default_pfp.svg" type="image/svg" />
              <source srcSet="/img/png/default_pfp.png" type="image/png" />
              <img
                src="img/png/default_pfp.png"
                alt="pfp"
                className="banners"
              />
            </picture>
            <p>{author}</p>
          </div>
          <div className={styles.post_timestamp}>
            <p>{prettifyUnixTime(timestamp)}</p>
          </div>
        </div>
        <div className={styles.post_text}>
          <p>{text_content}</p>
        </div>
      </div>
      <CopyLinkBtn link={`/post/${id}`} useOrigin="true" />
    </div>
  );
}
