// node-appwrite
"use server";

import { cookies } from "next/headers";

// appwrite import
import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "./config";

export const createSessionClient = async () => {
  /* Always create a seperate client session for each request. Otherwise there is secruity issues: like leaking someone's else's file to thrid parties, etc */

  // fetch client
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  // crate session for client
  const session = (await cookies()).get("appwrite-session");
  if (!session || !session.value) throw new Error("No session");
  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};

// only used on server
export const createAdminClient = async () => {
  // fetch client
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
