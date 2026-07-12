"use client";
import { useState } from "react";
import { sleep } from "../shared";
import styles from "@/app/style/module/CopyLinkBtn.module.css";

export default function CopyLinkBtn({
  link,
  useOrigin,
}: {
  link: string;
  useOrigin: string;
}) {
  const [textState, setTextState] = useState("copy link");
  async function copyLink(link: string) {
    // console.log(location.origin);
    if (useOrigin === "true") {
      link = location.origin + link;
      console.log(link);
    }
    try {
      // Copy text to clipboard
      console.log("copying", link);
      setTextState("copied");
      await sleep(750);
      setTextState("copy link");
      await navigator.clipboard.writeText(link);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  }

  return (
    <div className={styles.main}>
      <button
        type="button"
        onClick={() => {
          copyLink(link);
        }}
      >
        {textState}
      </button>
    </div>
  );
}
