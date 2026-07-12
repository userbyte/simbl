import { Post } from "./models/post";
import { User } from "./models/user";

/**
 * Returns info of the currently logged in user.
 */
export async function getUserInfo(): Promise<User | null> {
  const userInfoResult = await fetch("/api/user");
  let res: Response | null;
  try {
    res = await fetch("/api/user", {
      method: "GET",
      credentials: "include",
    });
  } catch (err) {
    res = null;
    console.error(`[UserContext] Error while getting user info: ${err}`);
  }
  if (!res) return null;
  let res_json;
  try {
    res_json = await res.json();
  } catch {
    console.error("[UserContext] Error while parsing user info JSON");
    res_json = {};
    return null;
  }

  if (userInfoResult.status === 200 && res_json.session) {
    return res_json.session.user;
  }

  return null;
}

/**
 * Send a test request to the API.
 */
export async function checkAPI(): Promise<boolean | "CLIENT_OUTDATED"> {
  // return true if all is well, CLIENT_OUTDATED if we are too old, or false

  const res = await fetch("/api").catch((err) => {
    console.error("apiCheck fetch error: ", err);
  });

  // did the fetch fail
  if (!res) return false;

  const res_status = res.status;
  // const res_json: { description?: string; version?: string } = await res.json();

  if (res_status === 200) {
    // only check version if client version was provided
    // if (clientVer) {
    //   // parse client and api versions
    //   const versionString_client = clientVer || "0.0.0";
    //   const versionString_API = res_json.version || "0.0.0";
    //   const [clientVer_major, clientVer_minor, clientVer_patch] =
    //     versionString_client.split(".").map((part) => parseInt(part, 10));
    //   const [apiVer_major, apiVer_minor, apiVer_patch] = versionString_API
    //     .split(".")
    //     .map((part) => parseInt(part, 10));

    //   // check if api version is newer than our client
    //   // because its the same codebase, if the API returns a newer version than us we can assume browser cache is fucking with us
    //   if (Number(apiVer_major) > clientVer_major) {
    //     // major version is higher than our client version, there is a high chance of issues
    //     console.warn("Client outdated (MAJOR_TOO_LOW)");
    //     return "CLIENT_OUTDATED";
    //   }
    //   if (Number(apiVer_minor) > clientVer_minor) {
    //     // minor version is higher than our client version, most things will likely work... but we should warn the user
    //     console.warn("Client outdated  (MINOR_TOO_LOW)");
    //     return "CLIENT_OUTDATED";
    //   }
    //   if (
    //     Number(apiVer_minor) <= clientVer_minor &&
    //     Number(apiVer_patch) < clientVer_patch
    //   ) {
    //     // patch version is higher than our client version, most things will work fine
    //     console.warn("Client outdated  (PATCH_TOO_LOW)");
    //     return "CLIENT_OUTDATED";
    //   }
    // }

    return true;
  } else {
    return false;
  }
}

export async function deletePost(targetID: string): Promise<{
  status: "SUCCESS" | "FAILED";
  error?:
    | "NETWORK_ERR"
    | "MALFORMED_REQUEST"
    | "UNAUTHORIZED"
    | "SERVER_ERR"
    | "UNKNOWN";
}> {
  console.log(`[client] Submitting post delete...`);

  // send request
  let res: Response | null;
  try {
    res = await fetch(`/api/post/${targetID}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (err) {
    res = null;
    console.error(`[client] Error trying to delete post: ${err}`);
  }
  if (!res) return { status: "FAILED", error: "NETWORK_ERR" };

  // process JSON data (hopefully it exists)
  let res_json;
  try {
    res_json = await res.json();
  } catch {
    res_json = {};
  }

  // handle status codes
  switch (res.status) {
    case 200:
      // post delete successful
      return { status: "SUCCESS" };

    case 400:
      // post delete failed: client side error
      return { status: "FAILED", error: "MALFORMED_REQUEST" };

    case 401:
      // post delete failed: unauthorized
      return { status: "FAILED", error: "UNAUTHORIZED" };

    case 500:
      // post delete failed: server error
      return { status: "FAILED", error: "SERVER_ERR" };

    default:
      // post delete failed: unknown error
      if (res_json.error != undefined) {
        return { status: "FAILED", error: "UNKNOWN" };
      }
      return { status: "FAILED", error: "UNKNOWN" };
  }
}

export async function editPost(
  targetID: string,
  ediff: object
): Promise<{
  status: "SUCCESS" | "FAILED";
  error?:
    | "NETWORK_ERR"
    | "MALFORMED_REQUEST"
    | "UNAUTHORIZED"
    | "SERVER_ERR"
    | "UNKNOWN";
  data?: Post;
}> {
  console.log(`[client] Submitting post edit...`);

  // send request
  let res: Response | null;
  try {
    res = await fetch(`/api/post/${targetID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetID: targetID,
        ediff: ediff,
      }),
      credentials: "include",
    });
  } catch (err) {
    res = null;
    console.error(`[client] Error trying to edit post: ${err}`);
  }
  if (!res) return { status: "FAILED", error: "NETWORK_ERR" };

  // process JSON data (hopefully it exists)
  let res_json;
  try {
    res_json = await res.json();
  } catch {
    res_json = {};
  }

  // handle status codes
  switch (res.status) {
    case 200:
      // post edit successful
      return { status: "SUCCESS", data: res_json.data };

    case 400:
      // post edit failed: client side error
      return { status: "FAILED", error: "MALFORMED_REQUEST" };

    case 401:
      // post edit failed: unauthorized
      return { status: "FAILED", error: "UNAUTHORIZED" };

    case 500:
      // post edit failed: server error
      return { status: "FAILED", error: "SERVER_ERR" };

    default:
      // post edit failed: unknown error
      if (res_json.error != undefined) {
        return { status: "FAILED", error: "UNKNOWN" };
      }
      return { status: "FAILED", error: "UNKNOWN" };
  }
}
