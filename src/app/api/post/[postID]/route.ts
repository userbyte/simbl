// API Route
// /api/post/{postID}

import { decryptJWT } from "../../authv2";
import { deletePost, editPost, getPost } from "../../../library/db";
import { cookies } from "next/headers";

// GET /api/post/{postID}
export async function GET(
  request: Request,
  { params }: { params: Promise<{ postID: string }> }
) {
  // gets a post by ID

  // get post from parameters
  const postID = (await params).postID;

  const post = await getPost(postID);
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
  const decrypted_session = await decryptJWT(session);

  // is the user of this session an admin?
  if (decrypted_session.user.role === "admin") {
    // ok, seems the user was admin, carry on...
    const postID = (await params).postID;

    console.log(`deleting post of ID ${postID}...`);
    const x = await deletePost(postID);
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

// PATCH /api/post/{postID}
export async function PATCH(
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
  const decrypted_session = await decryptJWT(session);

  // is the user of this session an admin?
  if (decrypted_session.user.role === "admin") {
    // ok, seems the user was admin, carry on...

    const reqBody = await request.json();

    if (!reqBody) return new Response("Missing request body", { status: 400 });

    const postID = (await params).postID;
    if (!postID)
      return new Response("Request missing required param: postID", {
        status: 400,
      });
    if (!reqBody.ediff)
      return new Response("Request missing required property: ediff", {
        status: 400,
      });

    console.log(`editing post of ID ${postID}...`);
    const x = await editPost(postID, reqBody.ediff);
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
