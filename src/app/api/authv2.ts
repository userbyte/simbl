import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const ACCESS_TOKEN_EXPIRE = "5 min from now";
export const REFRESH_TOKEN_EXPIRE = "90 days from now";

let secretKey = process.env.JWT_SECRET;
if (secretKey === undefined) {
  // if the key does not exist in the env, set one
  console.error(
    "missing JWT_SECRET env var! this is required, please create a .env file and set JWT_SECRET"
  );
  console.log("falling back to a default secret key...");
  secretKey = "simblsimblsimblsimbl";
}
const key = new TextEncoder().encode(secretKey);

export async function Encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRE)
    .sign(key);
}

export async function Encrypt_Refresh(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRE)
    .sign(key);
}

export async function Decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// export async function Login(formData: FormData) {
//   // Verify credentials && get the user

//   // const user = AuthenticateWithCredentials(
//   //   `${formData.get("username")}`,
//   //   `${formData.get("password")}`
//   // );

//   const username = formData.get("username");
//   const password = formData.get("password");

//   const response = await fetch("/api/auth/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username, password }),
//   });

//   if (response.ok) {
//     // router.push("/profile");
//     console.log("ok");
//   } else {
//     console.log("error");
//     // Handle errors
//   }

//   // // Create the session
//   // const expires = new Date(Date.now() + 10 * 1000);
//   // const session = await Encrypt({ user, expires });

//   // // Save the session in a cookie
//   // (
//   //   await // Save the session in a cookie
//   //   cookies()
//   // ).set("tkaccess", session, { expires, httpOnly: true });
// }

export async function Logout() {
  // Destroy the session
  (await cookies()).set("tkaccess", "", { expires: new Date(0) });
  (await cookies()).set("tkrefresh", "", { expires: new Date(0) });
}

export async function GetSession() {
  const session = (await cookies()).get("tkaccess")?.value;
  if (!session) return null;
  return await Decrypt(session);
}

export async function UpdateSession(request: NextRequest) {
  // get refresh token
  const session = (await cookies()).get("tkrefresh")?.value;
  if (!session) return;

  // create a fresh access token for the user
  const parsed = await Decrypt(session);
  // expire 15 minutes from now
  parsed.expires = new Date(Date.now() + 900 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "tkaccess",
    value: await Encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
    sameSite: "lax",
  });
  console.log(`refreshed access token for "${parsed.user.name}"`);
  return res;
}
