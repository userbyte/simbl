// import * from "./setup";
"use client";

import { FormEvent } from "react";
import styles from "./page.module.css";
import { sleep } from "../shared";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();

  async function handleSetup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const status_text = document.getElementById("status_text");
    function setStatus(type: "good" | "meh" | "bad", text: string) {
      if (status_text != null) {
        status_text.style.display = "block";
        status_text.textContent = text;
        status_text.setAttribute("status_type", type);
      } else {
        alert(text);
      }
    }

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    const response_create = await fetch("/api/auth/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const res_json = await response_create.json();

    // I LOVE NESTED IFS!!!! ill fix later... probably
    if (response_create.ok) {
      // ok the account was created successfully, lets set the PFP if they set one
      let response_pfp;
      let res2_json;
      if (!formData.get("file")) {
        // no pfp file was provided, lets pretend it was and move on
        response_pfp = { ok: true };
        res2_json = {};
      } else {
        response_pfp = await fetch("/api/user/setpfp", {
          method: "POST",
          body: formData,
        });
        res2_json = await response_pfp.json();
      }

      if (response_pfp.ok) {
        setStatus(
          "good",
          `user creation success :), navigating back to homepage...`
        );
        await sleep(2000);
        router.push("/");
      } else {
        // report pfp set errors
        setStatus(
          "meh",
          `account was created, but the pfp could not be set: ${res2_json.error}`
        );
      }
    } else {
      // report user create errors
      setStatus("bad", `${res_json.error}`);
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
