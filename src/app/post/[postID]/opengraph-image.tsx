import { ImageResponse } from "@vercel/og";
import { getPost } from "@/app/library/db";
import { prettifyUnixTime } from "@/app/library/shared";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontsPromise = Promise.all([
  fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/source-code-pro@latest/latin-400-normal.ttf"
  ).then(async (res) => {
    if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
    return { weight: 400 as const, data: await res.arrayBuffer() };
  }),
  fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/source-code-pro@latest/latin-500-normal.ttf"
  ).then(async (res) => {
    if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
    return { weight: 500 as const, data: await res.arrayBuffer() };
  }),
  fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/source-code-pro@latest/latin-700-normal.ttf"
  ).then(async (res) => {
    if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
    return { weight: 700 as const, data: await res.arrayBuffer() };
  }),
]);

export default async function Image({
  params,
}: {
  params: { postID: string };
}) {
  const post = await getPost(params.postID);
  const [regular, medium, bold] = await fontsPromise;

  const fonts = [
    {
      name: "Source Code Pro",
      data: regular.data,
      style: "normal" as const,
      weight: regular.weight,
    },
    {
      name: "Source Code Pro",
      data: medium.data,
      style: "normal" as const,
      weight: medium.weight,
    },
    {
      name: "Source Code Pro",
      data: bold.data,
      style: "normal" as const,
      weight: bold.weight,
    },
  ];

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: "#000000",
            border: "12px solid #ef4444",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Source Code Pro",
          }}
        >
          <p style={{ color: "white", fontSize: 48 }}>Post not found</p>
        </div>
      ),
      {
        ...size,
        fonts,
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          margin: "auto",
          width: "100%",
          height: "100%",
          background: "#000000",
          border: "4px solid #ffffff",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Source Code Pro",
          fontSize: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#ffffff",
            border: "3px solid #ffffff",
            width: "95%",
            height: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              height: "auto",
              justifyContent: "space-between",
              borderBottom: "3px solid #ffffff",
              padding: "0 1em",
            }}
          >
            <p style={{ fontWeight: 700 }}>{post.author}</p>
            <p style={{ color: "#8e8e8e" }}>
              {prettifyUnixTime(post.timestamp)}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              padding: "0 1em",
            }}
          >
            <p
              style={{
                display: "-webkit-box",
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordBreak: "break-word",
                lineClamp: 6,
                boxOrient: "vertical",
                WebkitLineClamp: 6,
                WebkitBoxOrient: "vertical",
              }}
            >
              {post.text}
            </p>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}
