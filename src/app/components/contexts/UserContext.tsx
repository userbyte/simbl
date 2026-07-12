"use client";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { User } from "@/app/library/models/user";
import { checkAPI, getUserInfo } from "@/app/library/client";

type UserContextType = {
  loggedInUser: User | null | false;
  setLoggedInUser: React.Dispatch<React.SetStateAction<User | null | false>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = (props: { children: React.ReactNode }) => {
  const [loggedInUser, setLoggedInUser] = useState<User | null | false>(false); // null represents a yeah we def not logged in state, false represents a "we dont know yet state"
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // watch the loggedInUser state for changes
    if (loggedInUser) {
      // if its not null, assume we are logged in and set isLoggedIn to true
      setIsLoggedIn(true);
    }
  }, [loggedInUser]);

  useEffect(() => {
    // first, check if the API is alive and working
    checkAPI()
      .then((check) => {
        if (check === "CLIENT_OUTDATED") {
          // client is outdated, carry on normally incase it works but warn the user of potential issues
          toast.warn("Client version is outdated. Try a full page refresh?");
          // if API is working, try login
          getUserInfo().then((user) => {
            if (user) {
              console.log("[UserContext] Authenticated successfully");
              setLoggedInUser(user);
              console.log(
                `[UserContext] Logged in as: ${user.username} (${user.id})`
              );
            } else {
              // API said our authentication failed, we probably dont have token cookies so not logged in
              setLoggedInUser(null);

              toast.error(
                "Please log in to use this application. Nothing will work.",
                {
                  autoClose: 25000,
                }
              );
            }
          });
        } else if (check) {
          // if API is working check try login
          getUserInfo().then((user) => {
            if (user) {
              console.log("[UserContext] Authenticated successfully");
              setLoggedInUser(user);
              console.log(
                `[UserContext] Logged in as: ${user.name} (${user.id})`
              );
            } else {
              // API authentication failed, we probably dont have token cookies so not logged in
              setLoggedInUser(null);
            }
          });
        } else {
          setLoggedInUser(null);
          toast.error("Error: API connection failed", {
            autoClose: 25000,
          });
        }
      })
      .catch((err) => {
        setLoggedInUser(null);
        console.error(`[UserContext] Error: ${err}`);
        toast.error("Error: API connection failed", {
          autoClose: 25000,
        });
      });
  }, []);

  return (
    <UserContext.Provider
      value={{
        loggedInUser: loggedInUser,
        setLoggedInUser: setLoggedInUser,
        isLoggedIn: isLoggedIn,
        setIsLoggedIn: setIsLoggedIn,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
