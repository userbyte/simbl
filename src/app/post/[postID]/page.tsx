import { GetPost } from "@/app/api/db";
import { PostObjectElement, PrettifyUnixTime } from "@/app/shared";
import BackBtn from "@/app/components/BackBtn";
import styles from "./page.module.css";
import { Metadata } from "next";

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
      type: "article",
      description: `${post.text}

      [${PrettifyUnixTime(post.timestamp)}]`,
      images: "/img/png/logo.png",
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
  if (!post) return <p>post {postID} does not exist</p>;
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
