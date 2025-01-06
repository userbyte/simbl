// API Route
// /api/{postID}

import { NextResponse } from "next/server";
import { TestWrite, GetPost, SavePost, DeletePost, EditPost } from "./db";

// GET /api
export async function GET(request: Request) {
  // Gets a post by ID //
  console.log(request);
  await TestWrite();
  // const gp = await SavePost({
  //   id: "1346ee4438",
  //   timestamp: 1730783724,
  //   author: "userbyte",
  //   text: "test",
  // });
  return NextResponse.json({
    hello: "aaa",
  });
}
