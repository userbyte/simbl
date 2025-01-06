// import { NextRequest } from "next/server";
import { UpdateSession } from "@/app/api/authv2";

export async function middleware() {
  console.log("MIDDLEWARE FIRED");
  return await UpdateSession();
}
