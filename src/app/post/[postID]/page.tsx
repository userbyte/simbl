import { Metadata } from "next";
import Link from "next/link";
import { getPost } from "@/app/api/db";
import { prettifyUnixTime } from "@/app/shared";
import { Post } from "@/app/components/Post";
import BackBtn from "@/app/components/BackBtn";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postID: string }>;
}): Promise<Metadata> {
  const postID = (await params).postID;
  const post = await getPost(postID);
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

      [${prettifyUnixTime(post.timestamp)}]`,
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
  const post = await getPost(postID);
  if (!post)
    return (
      <>
        <div className={styles.postpage_404}>
          <h1>
            error: could not find a post by the ID of &quot;{postID}&quot;
          </h1>
          <Link href="/">back to homepage</Link>
        </div>
      </>
    );

  return (
    <>
      <div className={styles.postpage}>
        <BackBtn />
        <Post post={post} renderSettings={{}} />
      </div>
    </>
  );
}
