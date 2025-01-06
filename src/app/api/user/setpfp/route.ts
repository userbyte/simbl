import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { GetSession } from "../../authv2";

export const POST = async (req, res) => {
  const user = await GetSession().name;
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  // const filename = file.name.replaceAll(" ", "_");
  // filename is just the username
  const filename = user;
  console.log(filename);
  try {
    await writeFile(
      path.join(process.cwd(), "public/pfps/" + filename),
      buffer
    );
    return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
