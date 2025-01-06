// API Route
// /api/post/{postID}

import { DeletePost, GetPost } from "../../db";

// GET /api/post/{postID}
export async function GET(
  request: Request,
  { params }: { params: Promise<{ postID: string }> }
) {
  // gets a post by ID

  // get post from parameters
  const postID = (await params).postID;
  console.log(postID);

  const post = await GetPost(postID);
  return new Response(JSON.stringify(post), {
    headers: { "Content-Type": "application/json" },
  });
}

// DELETE /api/post/{postID}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ postID: string }> }
) {
  // TODO: add authentication

  const postID = (await params).postID;
  const x = await DeletePost(postID);
  if (x == true) {
    return new Response("Success", { status: 200 });
  } else {
    return new Response("Failed", { status: 500 });
  }
}
