// API Route
// /api/post

import { Decrypt } from "../authv2";
import { SavePost } from "../db";
import { cookies } from "next/headers";

// POST /api/post
export async function POST(request: Request) {
  // saves a post

  // try to get the session
  // const session = await GetSession();

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
    try {
      const body = await request.json();
      body.post.author = decrypted_session.user.name;
      console.log("saving post: ", body.post);
      const sp = await SavePost(body.post);
      if (sp === false) {
        return new Response(
          JSON.stringify({ status: "failed", error: "failed to save post" }),
          {
            status: 500,
          }
        );
      } else {
        return new Response(JSON.stringify({ status: "success", post: sp }), {
          status: 200,
        });
      }
    } catch (error) {
      console.log(error);
      return new Response(JSON.stringify({ status: "failed" }), {
        status: 400,
      });
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
