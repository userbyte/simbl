"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Post } from "../library/models/post";
import { pad } from "../library/shared";
import { AutoAdjustTextarea } from "./SubmitPost";
import { deletePost, editPost } from "../library/client";
import styles from "@/app/style/module/EditModal.module.css";
import post_styles from "@/app/style/module/Post.module.css";

export default function EditModal({
  targetPost,
  setDisplayEditor,
}: {
  targetPost: Post;
  setDisplayEditor: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();

  // refs
  const postDateRef = useRef<HTMLInputElement>(null);
  const postTextRef = useRef<HTMLTextAreaElement>(null);

  // states
  const [textAreaValue, setTextAreaValue] = useState<string>(targetPost.text);
  const [deleteStep, setDeleteStep] = useState<number>(0);

  const deleteTexts = ["delete", "really?", "last chance...", "deleting!"];
  if (!targetPost) return <></>;

  function tzAdjust(timestamp: number) {
    // convert unix time to a format the date time picker likes
    const dt = new Date(timestamp * 1000);
    // adjust for timezone since the date time picker does not do that for us
    // stolen from: https://stackoverflow.com/a/17415677/10897243
    const ISO_tzoffsetted =
      dt.getFullYear() +
      "-" +
      pad(dt.getMonth() + 1) +
      "-" +
      pad(dt.getDate()) +
      "T" +
      pad(dt.getHours()) +
      ":" +
      pad(dt.getMinutes()) +
      ":" +
      pad(dt.getSeconds());
    return ISO_tzoffsetted;
  }

  async function handleSubmitDelete() {
    if (deleteStep != 2) {
      setDeleteStep((cur) => cur + 1);
      return;
    }
    setDeleteStep((cur) => cur + 1);
    const deleteResult = await deletePost(targetPost.id);
    if (deleteResult.status === "SUCCESS") {
      toast.success("Post deleted");
      if (location.pathname === "/") {
        // bandage fix, proper solution requires a significant rework of the PostList component, so that'll come later
        router.push("/");
      }
      setDisplayEditor(false);
    } else {
      if (deleteResult.error)
        console.error("post delete failed: ", deleteResult.error);
      toast.error("Delete failed 😢");
    }
    setDeleteStep(0);
  }

  async function handleSubmitEdit() {
    const ediff: { timestamp?: number; text?: string; privacy?: string } = {};
    if (textAreaValue) ediff.text = textAreaValue;
    if (postDateRef.current)
      ediff.timestamp =
        Number(postDateRef.current.valueAsNumber) / 1000 +
        new Date().getTimezoneOffset() * 60;
    const editResult = await editPost(targetPost.id, ediff);
    if (editResult.status === "SUCCESS") {
      toast.success("Edit successful");
      // bandage fix, proper solution requires a significant rework of the PostList component, so that'll come later
      router.push(location.pathname);
      setDisplayEditor(false);
      return;
    } else {
      if (editResult.error)
        console.error("post edit failed: ", editResult.error);
      toast.error("Edit failed 😢");
      return;
    }
  }

  return (
    <div
      className={styles.main}
      onClick={() => {
        setDisplayEditor(false);
      }}
    >
      <div
        className={post_styles.post_container}
        id={`post-${targetPost.id}`}
        key={targetPost.id}
        data-editmode="true"
        onClick={(e: React.MouseEvent) => {
          // prevent modal from closing when post is clicked
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <div className={post_styles.post_content}>
          <div className={post_styles.post_info}>
            <div className={post_styles.post_author}>
              <picture>
                <source srcSet={`/api/user/pfp/${targetPost.author}`} />
                <source srcSet="/img/svg/default_pfp.svg" type="image/svg" />
                <source srcSet="/img/png/default_pfp.png" type="image/png" />
                <img
                  src="img/png/default_pfp.png"
                  alt="pfp"
                  className="banners"
                />
              </picture>
              <p>{targetPost.author}</p>
            </div>
            <input
              ref={postDateRef}
              type="datetime-local"
              defaultValue={tzAdjust(targetPost.timestamp)}
              onClick={(e: React.MouseEvent) => {
                // prevent modal from closing when post is clicked, but still allow the time picker to be opened
                e.stopPropagation();
              }}
            />
          </div>
          <div className={post_styles.post_text} data-editmode="true">
            <AutoAdjustTextarea
              ref={postTextRef}
              name="text_content"
              textAreaValue={textAreaValue}
              setTextAreaValue={setTextAreaValue}
            />
          </div>
          <span>
            <input
              type="button"
              value={deleteTexts[deleteStep]}
              onClick={handleSubmitDelete}
            />
            <input
              type="button"
              value={"cancel"}
              onClick={() => {
                setDisplayEditor(false);
              }}
            />
            <input type="button" value={"save"} onClick={handleSubmitEdit} />
          </span>
        </div>
      </div>
    </div>
  );
}
