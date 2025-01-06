// API Route
// /api/{postID}

import getConfig from "next/config";
import { NextResponse } from "next/server";
// import { TestWrite, GetPost, SavePost, DeletePost, EditPost } from "./db";

const { publicRuntimeConfig } = getConfig();

// GET /api
export async function GET() {
  // Gets a post by ID //
  // console.log(request);
  // await TestWrite();
  // const gp = await SavePost({
  //   id: "1346ee4438",
  //   timestamp: 1730783724,
  //   author: "userbyte",
  //   text: "test",
  // });

  const version = publicRuntimeConfig?.version;
  return NextResponse.json({
    api_version: version,
  });
}
