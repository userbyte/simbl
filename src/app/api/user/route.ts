// API Route
// /api/user

import { getSession } from "../authv2";

// GET /api/user
export async function GET() {
  // gets user information from the session

  const session = await getSession();
  if (session != null) {
    return new Response(
      JSON.stringify({ status: "success", session: session }),
      {
        status: 200,
      }
    );
  } else {
    return new Response(JSON.stringify({ status: "failed" }), {
      status: 400,
    });
  }
}
