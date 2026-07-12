// database module

import fs from "fs";
import path from "path";
import { JSONFilePreset } from "lowdb/node";
// import crypto from "crypto";
import { generatePostID, unixTimestampNow } from "./shared";
import { hashPW } from "../api/auth";
import { User } from "./models/user";
import { Post } from "./models/post";

export type Data = {
  users: User[];
  posts: Post[];
};

// initial db
const defaultData: Data = { users: [], posts: [] };
const db_file = path.resolve("./data/db.json");
export const db = await JSONFilePreset<Data>(db_file, defaultData);

/// database functions ///
export async function initializeDB() {
  // ensure data dir exists
  const dir = "./data";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  // ensure data dir exists
  const pfpdir = "./data/pfp";
  if (!fs.existsSync(pfpdir)) {
    fs.mkdirSync(pfpdir);
  }

  // write to the database: creates the file, and pulls in defaultData
  await db.write();

  console.log(`initialized db: ${db_file}`);
}

export function generateSalt(length: number) {
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

export async function getUser(id: string | number) {
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

export async function createUser(
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
  const salt = generateSalt(10);
  const hashed = hashPW(salt, password);

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

export async function testWrite() {
  const post_id = generatePostID();
  const test_post = {
    id: post_id,
    timestamp: unixTimestampNow(),
    author: "userbyte",
    text: "test",
  };
  db.data.posts.push(test_post);
  await db.write();
}

export async function getPost(postID: string) {
  const post = db.data.posts.find((p) => p.id === postID);
  if (post === undefined) {
    return false;
  }
  return post;
}

export async function getPosts() {
  // gets all posts
  const posts = db.data.posts;
  if (posts === undefined) {
    console.error("GetPosts: database error, posts is undefined");
    return false;
  }
  return posts;
}

export async function savePost(post: Post) {
  // saves a post to the DB
  try {
    const post_id = generatePostID();
    // create a temporary post object, and pull in data from the post passed to this function
    // prevents client-set timestamp and ID, and ensures correct schema
    const post_ = {
      id: post_id,
      timestamp: unixTimestampNow(),
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

export async function deletePost(postID: string) {
  // deletes a post from the DB (by ID)

  // const post = db.data.posts.find((p) => p.id === postID);

  const filteredArray = db.data.posts.filter((e) => e["id"] !== postID);

  // await db.update(({ posts }) => (db.data.posts = filteredArray));
  db.data.posts = filteredArray;
  await db.write();
  console.log(db.data.posts.filter((e) => e["id"] !== postID));
  return true;
}

export async function editPost(
  postID: string,
  ediff: { timestamp?: string; text?: string; privacy?: string }
) {
  // edits a post in-place in the DB (by ID)

  // get post index
  const postIndex = db.data.posts.findIndex((p) => p.id === postID);

  // apply ediff
  try {
    for (const [key, value] of Object.entries(ediff)) {
      console.log(
        `editing post ${postID}: ${key}=${db.data.posts[postIndex][key]} --> ${postID}=${value}`
      );
      db.data.posts[postIndex][key] = value;
    }

    await db.write();

    return true;
  } catch (err) {
    console.error("error editing post: ", err);
    return false;
  }
}
