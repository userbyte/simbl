import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { GetSession } from "../../authv2";

// POST /api/user/setpfp
export const POST = async (req: Request) => {
  const session = await GetSession();
  const username = session.user.name;
  const formData = await req.formData();

  const file: FormDataEntryValue | File | null = formData.get("file");
  // dumb typing bs, i have to accept that file may be a string here
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "no files received" }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  // const filename = file.name.replaceAll(" ", "_");
  // filename is just the username
  const filename = username.replaceAll(" ", "_");
  console.log("setting the pfp of:", username);
  try {
    await writeFile(
      path.join(process.cwd(), "public/img/pfp/" + filename),
      buffer
    );
    return NextResponse.json({ status: "success" }, { status: 201 });
  } catch (error) {
    console.log("/api/user/setpfp :: error:", error);
    return NextResponse.json(
      { status: "error", error: "internal server error :(" },
      { status: 500 }
    );
  }
};
