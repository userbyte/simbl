// API Route
// /api/auth/login

import { cookies } from "next/headers";
import { Encrypt, Encrypt_Refresh } from "../../authv2";
import { AuthenticateWithCredentials } from "../../auth";

// POST /api/post
// export async function POST(request: Request) {
//   // logs in a user

//   try {
//     const body = await request.json();
//     console.log("Saving post: ", body);
//     const sp = await SavePost(body.post);
//     if (sp === false) {
//       return false;
//     } else {
//       return new Response(JSON.stringify({ status: "success", post: sp }), {
//         status: 200,
//       });
//     }
//   } catch {
//     return new Response(JSON.stringify({ status: "failed" }), {
//       status: 400,
//     });
//   }
// }

export async function POST(request: Request) {
  // verify credentials & get the user
  const body = await request.json();
  const username = body.username;
  const password = body.password;
  const user = await AuthenticateWithCredentials(username, password);

  console.log(user);
  if (user === false) {
    return new Response(JSON.stringify({ status: "failed" }), {
      status: 400,
    });
  } else {
    // create the session

    // set cookies
    // create the refresh token
    const expire_refresh = new Date(Date.now() + 7776000 * 1000); // 3 months from now
    const session_refresh = await Encrypt_Refresh({ user, expire_refresh });
    // create the access token
    const expire_access = new Date(Date.now() + 900 * 1000); // 15 minutes from now
    const session_access = await Encrypt({ user, expire_access });

    // save tokens into cookies
    (await cookies()).set("tkrefresh", session_refresh, {
      expires: expire_refresh,
      httpOnly: true,
    });
    (await cookies()).set("tkaccess", session_access, {
      expires: expire_access,
      httpOnly: true,
    });

    return new Response(JSON.stringify({ status: "success" }), {
      status: 200,
    });
  }
}
