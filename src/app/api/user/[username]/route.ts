// API Route
// /api/user/[username]

// GET /api/user/[username]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  console.log(request);
  console.log(params);
  return new Response(JSON.stringify({ ok: "ok" }), {
    status: 200,
  });
}
