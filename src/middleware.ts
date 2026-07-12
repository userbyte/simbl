// import { NextRequest } from "next/server";
import { updateSession } from "@/app/api/authv2";

export async function middleware() {
  console.log("MIDDLEWARE FIRED");
  return await updateSession();
}
