"use server";

// appwrite imports
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { InputFile } from "node-appwrite/file";
import { ID, Models, Query } from "node-appwrite";

// utils imports
import { revalidatePath } from "next/cache";
import { constructFileUrl, getFileType, parseStringify } from "../utils";

// actions imports
import { getCurrentUser } from "./user.actions";

/*---------------------- Helper Functions 🧰 ----------------------*/
const handleError = (message: string, error: unknown) => {
  console.error(error, message);
  throw error;
};

const createQueries = (currentUser: Models.Document) => {
  const queries = [
    Query.or([
      Query.equal("ownerId", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  // Todo: Search, sort, limit

  return queries;
};

/*---------------------- Server Actions 💪 ----------------------*/
export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();
  try {
    // read the file data
    const inputFile = InputFile.fromBuffer(file, file.name);
    // upload the file into bucket
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    // specify the file metadata
    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    // store the file
    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError("Failed to upload the file to database", error);
      });

    // refresh page with new data
    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError("Error in uploadFile:", error);
  }
};

export const getFiles = async () => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");
    console.log("Fetching files for user: ", currentUser.fullname);

    // get premade queries
    const queries = createQueries(currentUser);

    // making call to database
    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );
    if (files) {
      console.log("Files fetched successfully", files);
    } else {
      console.log("No files fetched");
    }

    return parseStringify(files);
  } catch (error) {
    handleError("Error in getFiles:", error);
  }
};
