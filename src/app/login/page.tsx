"use client";
import { redirect } from "next/navigation";
import { GetSession, Login, Logout } from "@/app/api/authv2";
import { FormEvent } from "react";
import styles from "../style/module/Login.module.css";

export default function Page() {
  // const session = GetSession();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (response.ok) {
      alert("login good");
      redirect("/");
    } else {
      alert("login bad");
    }
  }

  return (
    <>
      <title>simbl - login</title>
      <form onSubmit={handleSubmit} className={styles.login_form}>
        <h1>login</h1>
        <input type="username" name="username" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">{"< login >"}</button>
      </form>
    </>
  );
}
