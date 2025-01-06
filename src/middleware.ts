import { NextRequest } from "next/server";
import { UpdateSession } from "@/app/api/authv2";

export async function middleware(request: NextRequest) {
  console.log("MIDDLEWARE FIRED");
  return await UpdateSession(request);
}
