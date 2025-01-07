// API Route
// /api/post

import { cookies } from "next/headers";
import { Encrypt, Encrypt_Refresh } from "../../authv2";
import { CreateUser, InitializeDB } from "../../db";
import { db } from "../../db";

// POST /api/post
export async function POST(request: Request) {
  // creates a user

  try {
    const body = await request.json();
    console.log("creating user: ", body.username);
    let role = "user";
    // is this the first user
    if (db.data.users.length === 0) {
      // if it is, make em admin
      role = "admin";
      // also, make sure db is initialized... just incase
      await InitializeDB();
    }
    const cu = await CreateUser(body.username, body.password, role);
    if (cu[0] === false) {
      if (cu[1] === "exists") {
        // user creation failed, user already exists
        throw "user creation failed: user exists";
      } else {
        // user creation failed for an unknown reason
        throw "user creation failed: an unknown error has occurred";
      }
    } else {
      // user creation was successful

      // the newly created user
      const user = cu[1];

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

      return new Response(JSON.stringify({ status: "success", user: user }), {
        status: 200,
      });
    }
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ status: "failed", error: err }), {
      status: 400,
    });
  }
}
