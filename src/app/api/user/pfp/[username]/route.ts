// API Route
// /api/user/pfp

import fs from "fs";
import path from "path";

// GET /api/user/pfp
export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  // gets the pfp of a user

  try {
    const username = (await params).username;
    console.log("getting pfp: ", username);
    const filePath = path.resolve(`./public/img/pfp/${username}`);
    const imageBuffer = fs.readFileSync(filePath);

    return new Response(imageBuffer);
  } catch {
    // if there was an error, return the default pfp
    const filePath = path.resolve("./public/img/png/default_pfp.png");
    const imageBuffer = fs.readFileSync(filePath);

    return new Response(imageBuffer);
  }
}
