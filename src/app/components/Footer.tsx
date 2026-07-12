import getConfig from "next/config";
import Link from "next/link";
import styles from "../style/module/Footer.module.css";

export default function Footer() {
  const { publicRuntimeConfig } = getConfig();
  const curYear = new Date().getFullYear();

  return (
    <footer className={styles.main}>
      <Link href="/login">{"< login >"}</Link>
      <p>v{publicRuntimeConfig?.version}</p>
      <p>
        &copy;{" "}
        <a id="homepageFooterLink" href="https://userbyte.xyz">
          userbyte.xyz
        </a>{" "}
        {curYear}
      </p>
    </footer>
  );
}
