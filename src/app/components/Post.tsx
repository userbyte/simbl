import { Post, PostRenderSettings } from "../library/models/post";
import { prettifyUnixTime } from "../library/shared";
import CopyLinkBtn from "./CopyLinkBtn";
import EditBtn from "./EditBtn";
import styles from "@/app/style/module/Post.module.css";

export function Post_({
  post,
  renderSettings,
}: {
  post: Post;
  renderSettings: PostRenderSettings | undefined;
}): React.JSX.Element {
  if (!renderSettings) {
    renderSettings = {};
  }

  return (
    <div className={styles.post_container} id={`post-${post.id}`} key={post.id}>
      <div
        className={styles.post_content}
        // onClick="location.href = 'post.html?id=c23f5c9667'"
      >
        <div className={styles.post_info}>
          <div className={styles.post_author}>
            <picture>
              {/* <source srcset="files/img/webp/default_pfp.webp" type="image/webp"> */}
              <source srcSet={`/api/user/pfp/${post.author}`} />
              <source srcSet="/img/svg/default_pfp.svg" type="image/svg" />
              <source srcSet="/img/png/default_pfp.png" type="image/png" />
              <img
                src="img/png/default_pfp.png"
                alt="pfp"
                className="banners"
              />
            </picture>
            <p>{post.author}</p>
          </div>
          <div className={styles.post_timestamp}>
            <p>{prettifyUnixTime(post.timestamp)}</p>
          </div>
        </div>
        <div className={styles.post_text}>
          <p>{post.text}</p>
        </div>
      </div>
      <span>
        <EditBtn targetPost={post} />
        <CopyLinkBtn link={`/post/${post.id}`} useOrigin="true" />
      </span>
    </div>
  );
}
