import Link from "next/link";
import styles from "../style/module/Header.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
      <h1>
        <Link href="/">simbl</Link>
      </h1>
      <p>a solo microblogging platform</p>
    </div>
  );
}
