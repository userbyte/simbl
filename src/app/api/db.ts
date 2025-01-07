// database module

import { JSONFilePreset } from "lowdb/node";

// import crypto from "crypto";
import { GeneratePostID, UnixTimestampNow } from "../shared";
import { HashPW } from "./auth";
import fs from "fs";
import path from "path";

// db schema
export type User = {
  id: number;
  name: string;
  role: string;
  salt: string;
  password: string;
};
export type Post = {
  id: string;
  timestamp: number;
  author: string;
  text: string;
  // images: base64[]; // idk how to add this one
};
export type Data = {
  users: User[];
  posts: Post[];
};

// initial db
const defaultData: Data = { users: [], posts: [] };
const db_file = path.resolve("./data/db.json");
export const db = await JSONFilePreset<Data>(db_file, defaultData);

/// database functions ///
export async function InitializeDB() {
  // ensure data dir exists
  const dir = "./data";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // write to the database: creates the file, and pulls in defaultData
  await db.write();

  console.log(`initialized db: ${db_file}`);
}

export function GenerateSalt(length: number) {
  // generates salt for hashing purposes
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export async function GetUser(id: string | number) {
  // get a user from the database

  const foundUser = db.data.users.find((user) => user.id === id);
  if (foundUser != undefined) {
    // omit sensitive shit
    const foundUser_ = {
      id: foundUser.id,
      name: foundUser.name,
      role: foundUser.role,
    };
    return foundUser_;
  } else {
    return false;
  }
}

export async function CreateUser(
  username: string,
  password: string,
  role: string
) {
  // create a user in the database

  if (username.length === 0) return [false, "missing_username"];
  if (password.length === 0) return [false, "missing_password"];

  // usernames have to be unique
  const foundUser = db.data.users.find((user) => user.name === username);
  if (foundUser != undefined) {
    return [false, "exists"];
  }

  // get the current amount of users, and add 1 to it for the new user ID
  const new_userID = db.data.users.length + 1;

  // salt and hash the password
  const salt = GenerateSalt(10);
  const hashed = HashPW(salt, password);

  // add the new user to the database
  db.data.users.push({
    id: new_userID,
    name: username,
    role: role,
    salt: salt,
    password: hashed,
  });
  await db.write();
  return [
    true,
    {
      id: new_userID,
      name: username,
      role: role,
      // token: token,
    },
  ];
}

export async function TestWrite() {
  const post_id = GeneratePostID();
  const test_post = {
    id: post_id,
    timestamp: UnixTimestampNow(),
    author: "userbyte",
    text: "test",
  };
  db.data.posts.push(test_post);
  await db.write();
}

export async function GetPost(postID: string) {
  const post = db.data.posts.find((p) => p.id === postID);
  if (post === undefined) {
    return false;
  }
  return post;
}

export async function GetPosts() {
  // gets all posts
  const posts = db.data.posts;
  if (posts === undefined) {
    return false;
  }
  return posts;
}

export async function SavePost(post: Post) {
  // saves a post to the DB
  try {
    const post_id = GeneratePostID();
    // create a temporary post object, and pull in data from the post passed to this function
    // prevents client-set timestamp and ID, and ensures correct schema
    const post_ = {
      id: post_id,
      timestamp: UnixTimestampNow(),
      author: post.author,
      text: post.text,
    };
    // save to database
    db.data.posts.push(post_);
    await db.write();
    return post_;
  } catch (error) {
    console.log("SavePost err:", error);
    return false;
  }
}

export async function DeletePost(postID: string) {
  // deletes a post from the DB (by ID)

  // const post = db.data.posts.find((p) => p.id === postID);

  const filteredArray = db.data.posts.filter((e) => e["id"] !== postID);

  // await db.update(({ posts }) => (db.data.posts = filteredArray));
  db.data.posts = filteredArray;
  await db.write();
  console.log(db.data.posts.filter((e) => e["id"] !== postID));
  return true;
}

export async function EditPost(postID: string) {
  // edits a post in-place in the DB (by ID)

  const post = db.data.posts.find((p) => p.id === postID);
  return post;
}
