// API Route
// /api/auth/login

import { logout } from "../../authv2";

export async function GET() {
  // logout the user

  await logout();
  return new Response(JSON.stringify({ status: "success" }), {
    status: 200,
  });
}
