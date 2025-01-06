// import * from "./setup";
"use client";

import { FormEvent } from "react";
import styles from "./page.module.css";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function uploadHandler(event: { target: { files: (string | Blob)[] } }) {
  const data = new FormData();
  data.append("file", event.target.files[0]);
}

export default function SetupPage() {
  async function handleSetup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    const response = await fetch("/api/auth/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const status_text = document.getElementById("status_text");
    const res_json = await response.json();
    if (response.ok) {
      // router.push("/profile");
      if (status_text != null) {
        status_text.style.display = "block";
        status_text.textContent = `user creation success`;
        status_text.setAttribute("status_type", "good");
      }
    } else {
      // handle errors
      if (status_text != null) {
        status_text.style.display = "block";
        status_text.textContent = `${res_json.error}`;
        status_text.setAttribute("status_type", "bad");
      }
    }
  }

  return (
    <>
      <div className={styles.main}>
        <div className={styles.login_form}></div>
      </div>
      <div className={styles.main}>
        <h1>simbl setup</h1>
        <div className={styles.intro_text}>
          <hr />
          <p>
            hello! thank you for using simbl :)
            <br />
            simbl is a solo microblogging platform, designed with simplicity in
            mind.
            <br />
            <br />
            to get everything setup, you just need to setup the account which
            will be the primary admin of this simbl instance.
          </p>
          <hr />
        </div>
        <br />
        <form onSubmit={handleSetup}>
          <label>author profile picture</label>
          <input
            type="file"
            name="file"
            // onChange={uploadHandler}
            accept="image/jpeg,image/png,image/webp"
          />
          <label htmlFor="username_input">username</label>
          <input
            id="username_input"
            type="username"
            name="username"
            placeholder="Username"
            required
          />
          <label htmlFor="password_input">password</label>
          <input
            id="password_input"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <p id="status_text" className={styles.status_text}></p>
          <button type="submit">{"< run setup >"}</button>
        </form>
      </div>
    </>
  );
}
