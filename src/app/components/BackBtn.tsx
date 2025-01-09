"use client";
import { useRouter } from "next/navigation";
import styles from "@/app/style/module/BackBtn.module.css";

export default function BackBtn() {
  const router = useRouter();

  return (
    <div className={styles.backbtn}>
      <button type="button" onClick={() => router.back()}>
        ⬅
      </button>
    </div>
  );
}
