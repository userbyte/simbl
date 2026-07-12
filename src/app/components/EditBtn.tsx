"use client";
import { useContext, useState } from "react";
import EditModal from "./EditModal";
import { Post } from "../library/models/post";
import styles from "@/app/style/module/EditBtn.module.css";
import { UserContext } from "./contexts/UserContext";

export default function EditBtn({ targetPost }: { targetPost: Post }) {
  // context
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("EditBtn must be used within a UserContext provider");
  }
  const { isLoggedIn } = context;

  // states
  const [displayEditor, setDisplayEditor] = useState<boolean>(false);

  function handleEdit() {
    setDisplayEditor(true);
  }

  return (
    <>
      {isLoggedIn ? (
        <div className={styles.main}>
          {displayEditor ? (
            <EditModal
              setDisplayEditor={setDisplayEditor}
              targetPost={targetPost}
            />
          ) : (
            <></>
          )}
          <button type="button" onClick={handleEdit}>
            edit
          </button>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
