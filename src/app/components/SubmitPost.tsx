"use client";
import React, {
  useState,
  useEffect,
  FormEvent,
  RefObject,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import styles from "../style/module/SubmitPost.module.css";
import { sleep } from "../shared";

const MIN_TEXTAREA_HEIGHT = 59;

export function AutoAdjustTextarea({
  ref,
  name,
  textAreaValue,
  setTextAreaValue,
}: {
  ref: RefObject<HTMLTextAreaElement>;
  name: string;
  textAreaValue: string;
  setTextAreaValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  // props?: { name: string | undefined }
  // const textareaRef = React.useRef(null);
  const textareaRef = ref;
  // const [value, setValue] = React.useState("");
  const [value, setValue] = [textAreaValue, setTextAreaValue];
  const onChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setValue(event.target.value);

  React.useLayoutEffect(() => {
    if (textareaRef.current) {
      // Check if ref is valid
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        MIN_TEXTAREA_HEIGHT
      )}px`;
    }
  }, [textareaRef, value]);

  return (
    <textarea
      onChange={onChange}
      ref={textareaRef}
      style={{
        minHeight: MIN_TEXTAREA_HEIGHT,
        resize: "none",
      }}
      value={value}
      name={name}
      placeholder="..."
    />
  );
}

export default function SubmitPost() {
  const router = useRouter();

  // states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status_text, setStatusText] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);

  // refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaValue, setTextAreaValue] = React.useState("");

  // totally not AI generated code... i didnt give up on writing isLoggedIn by myself, what are you talking about?
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const text_content = formData.get("text_content");

    if (isLoggedIn) {
      // Only allow submission if logged in

      if (text_content === "") {
        setStatusText("post cannot be empty");
        await new Promise((r) => setTimeout(r, 2500));
        setStatusText("");
        return;
      }
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post: {
            text: text_content,
            privacy: "public",
          },
        }),
        credentials: "include", // include session cookie
      });
      // show loading
      setLoadingStatus(true);

      if (response.ok) {
        // hide loading
        setLoadingStatus(false);

        // add post to PostList
        // ...TODO...

        //setValue("");

        // clear the value of the textarea
        if (textareaRef.current !== null) {
          setTextAreaValue("");
        }

        setStatusText("post submitted successfully");
        await sleep(1500);
        setStatusText("");
        // alert("post submitted");
        if (location.pathname === "/") {
          // bandage fix, proper solution requires a significant rework of the PostList component, so that'll come later
          router.push("/");
        }
      } else {
        setLoadingStatus(false);
        setStatusText("post submission failed");
        await sleep(3750);
        setStatusText("");
        // alert("post failed");
      }
    } else {
      alert("Please log in to submit a post."); // Or redirect to login page
    }
  }

  return (
    <>
      {isLoggedIn ? (
        <div className={styles.main}>
          {loadingStatus ? (
            <div className="loading_overlay">
              <span className="loader"></span>
            </div>
          ) : (
            <></>
          )}
          <form onSubmit={handleSubmit}>
            <AutoAdjustTextarea
              ref={textareaRef}
              name="text_content"
              textAreaValue={textAreaValue}
              setTextAreaValue={setTextAreaValue}
            />
            <input type="submit" value=">" id="submit-post-btn" />
          </form>

          {/* dont show status text when its empty */}
          {status_text && <p>{status_text}</p>}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
