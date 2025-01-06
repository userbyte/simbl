import { NextResponse } from "next/server";
// import path from "path";
// import { writeFile } from "fs/promises";
// import { GetSession } from "../../authv2";

// POST /api/user/setpfp
// export const POST = async (req, res) => {
export const POST = async () => {
  // TODO: make this work, i think it should kind of work but im disabling this because the build is failing on file.arrayBuffer()
  return NextResponse.json({ Message: "currently disabled", status: 201 });
  // const session = await GetSession();
  // const username = session.name;
  // const formData = await req.formData();

  // const file = formData.get("file");
  // if (!file) {
  //   return NextResponse.json({ error: "No files received." }, { status: 400 });
  // }

  // const buffer = Buffer.from(await file.arrayBuffer());
  // // const filename = file.name.replaceAll(" ", "_");
  // // filename is just the username
  // const filename = username;
  // console.log(filename);
  // try {
  //   await writeFile(
  //     path.join(process.cwd(), "public/pfps/" + filename),
  //     buffer
  //   );
  //   return NextResponse.json({ Message: "Success", status: 201 });
  // } catch (error) {
  //   console.log("Error occured ", error);
  //   return NextResponse.json({ Message: "Failed", status: 500 });
  // }
};
