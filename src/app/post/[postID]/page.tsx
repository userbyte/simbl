import { GetPost } from "@/app/api/db";
import { PostObjectElement, PrettifyUnixTime } from "@/app/shared";
import BackBtn from "@/app/components/BackBtn";
import styles from "./page.module.css";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postID: string }>;
}): Promise<Metadata> {
  const postID = (await params).postID;
  const post = await GetPost(postID);
  if (!post) {
    return {
      title: "simbl",
      description: "Error: Post does not exist!",
    };
  }
  return {
    title: `${post.author}'s post on simbl`,
    authors: [{ name: post.author }],
    openGraph: {
      siteName: "simbl",
      description: `${post.text}

      [${PrettifyUnixTime(post.timestamp)}]`,
      images: [
        {
          url: "https://simbl.userbyte.xyz/img/png/logo.png",
          width: 175,
          height: 175,
        },
      ],
    },
    twitter: {
      // image too big on discord embed, so we unset
      images: [],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ postID: string }>;
}) {
  const postID = (await params).postID;
  const post = await GetPost(postID);
  if (!post)
    return (
      <>
        <div className={styles.postpage_404}>
          <h1>error: could not find a post by the ID of "{postID}"</h1>
          <Link href="/">back to homepage</Link>
        </div>
      </>
    );
  const postobj = PostObjectElement(post);
  return (
    <>
      <div className={styles.postpage}>
        <BackBtn />
        {postobj}
      </div>
    </>
  );
}
