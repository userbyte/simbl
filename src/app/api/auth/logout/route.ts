// API Route
// /api/auth/login

import { Logout } from "../../authv2";

export async function GET(request: Request) {
  // logout the user

  await Logout();
  return new Response(JSON.stringify({ status: "success" }), {
    status: 200,
  });
}
