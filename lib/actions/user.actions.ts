/* Create account flow
-----------------------
1. enter email and name 
2. check if email/user already exists
3. send OTP to users email
4. This will make screat key for making a session
5. Create new user document if new
6. return user's id to complete login
7. verify OTP and aithenticate user
*/

"use server";
import { cookies } from "next/headers";

// appwrite imports
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Query } from "node-appwrite";

// utils imports
import { parseStringify } from "@/lib/utils";
import { avatarPlaceholder } from "@/constants";

/*---------------------- helper functions ----------------------*/
const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("email", [email])]
  );
  console.log("Got users by email: ", email);
  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.error(error, message);
  throw error;
};

export const sendEmailOTP = async (email: string) => {
  const { account } = await createAdminClient();
  try {
    const session = await account.createEmailToken(ID.unique(), email);
    console.log("OTP sent successfully");
    return session.userId;
  } catch (error) {
    handleError(error, "There was a error in sendEmailOTP");
  }
};

/*---------------------- Server Actions 💪 ----------------------*/
export const createAccount = async ({
  fullname,
  email,
}: {
  fullname: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);
  const accountId = await sendEmailOTP(email);
  if (!accountId) throw new Error("Failed to send OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        fullname,
        email,
        avatar: avatarPlaceholder,
        accountId,
      }
    );
    console.log("User account created successfully");
  }

  return parseStringify({ accountId });
};

export const verifySecret = async (accountId: string, password: string) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    console.log("User verified");
    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "There was a error in verifySecret action");
  }
};

export const getCurrentUser = async () => {
  try {
    const { account, databases } = await createSessionClient();

    // Get the account details
    const result = await account.get();
    console.log("Account Details:", result);

    // Query user document
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", result.$id)]
    );

    console.log("User Query Result:", user);

    if (user.total <= 0) {
      console.warn("User document not found in database");
      return null;
    }

    console.log("Current user found");
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
};

export const signOutUser = async () => {
  try {
    const { account } = await createSessionClient();

    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");

    console.log("User logged out successfully");
  } catch (error) {
    handleError(error, "Error in signOutUser: ");
  }
};

export const SignInUser = async (email: string) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      console.log("User exists. Sending OTP");
      await sendEmailOTP(email);
      return parseStringify({ accountId: existingUser.accountId });
    }

    console.log("SignIn email User does not exist.");
    return parseStringify({ accountId: null, error: "User not found." });
  } catch (error) {
    handleError(error, "There was a Error in SignInUser");
  }
};
