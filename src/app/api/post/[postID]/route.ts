// API Route
// /api/post/{postID}

import { Decrypt } from "../../authv2";
import { DeletePost, GetPost } from "../../db";
import { cookies } from "next/headers";

// GET /api/post/{postID}
export async function GET(
  request: Request,
  { params }: { params: Promise<{ postID: string }> }
) {
  // gets a post by ID

  // get post from parameters
  const postID = (await params).postID;

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
  const session = (await cookies()).get("tkaccess")?.value;
  // console.log((await cookies()).getAll());

  // does the session exist?
  if (!session) {
    // if no session is present, return 401
    return new Response(
      JSON.stringify({ status: "failed", error: "unauthorized1" }),
      {
        status: 401,
      }
    );
  }
  // decrypt session
  const decrypted_session = await Decrypt(session);

  // is the user of this session an admin?
  if (decrypted_session.user.role === "admin") {
    // ok, seems the user was admin, carry on...
    const postID = (await params).postID;
    console.log(`deleting post of ID ${postID}...`);
    const x = await DeletePost(postID);
    if (x == true) {
      return new Response("Success", { status: 200 });
    } else {
      return new Response("Failed", { status: 500 });
    }
  } else {
    // if user not admin, return 401
    return new Response(
      JSON.stringify({ status: "failed", error: "unauthorized2" }),
      {
        status: 401,
      }
    );
  }
}
