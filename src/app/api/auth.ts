// authentication module

import crypto from "crypto";
// import { NextRequest } from "next/server";
import { db, GetUser, User } from "./db";

// function GenerateToken(length: number) {
//   // generates a token for hashing purposes
//   let result = "";
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const charactersLength = characters.length;
//   let counter = 0;
//   while (counter < length) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     counter += 1;
//   }
//   return result;
// }

function UsernameToUser(username: string) {
  // get a user object by its username

  // create a map: username -> user
  const map_usernameToUser = new Map<string, User>();
  db.data.users.forEach((user) => {
    map_usernameToUser.set(user.name, user);
  });
  const foundUser = map_usernameToUser.get(username);
  if (foundUser === undefined) {
    return false;
  } else {
    return foundUser;
  }
}

export function HashPW(salt: string, password: string) {
  // password hashing function

  const salted_pw = salt + password;
  const hashed = crypto.createHash("sha256").update(salted_pw).digest("hex");
  return hashed;
}

export function AuthenticateWithCredentials(
  username: string,
  password: string
) {
  const target = UsernameToUser(username);
  if (target != false) {
    // hash entered password
    const hashed = HashPW(target.salt, password);
    // check result against db
    console.log(hashed);
    console.log(target.password);
    if (hashed === target.password) {
      return GetUser(target.id);
    }
  }
  return false;
}
