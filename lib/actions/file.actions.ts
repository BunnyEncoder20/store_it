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

const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number
) => {
  const queries = [
    Query.or([
      Query.equal("ownerId", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  // Todo: Search, sort, limit
  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));

  const [sortBy, orderBy] = sort.split("-");
  queries.push(
    orderBy === "acs" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
  );

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

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit,
}: GetFilesProps) => {
  const { databases } = await createAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");
    // console.log("Fetching files for user: ", currentUser.fullname);

    // get premade queries
    const queries = createQueries(currentUser, types, searchText, sort, limit);

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

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient();
  console.log("Renaming file: ", fileId);
  try {
    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      { name: newName }
    );
    console.log("File renamed successfully: ", updatedFile);
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError("Error in renameFile:", error);
  }
};

export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient();
  console.log(`updating ${fileId} users with:`);
  emails.map((email) => console.log(email));

  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      { users: emails }
    );
    console.log("Users updated successfully");
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    handleError("Error in updateFileUsers:", error);
  }
};

export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps) => {
  const { databases, storage } = await createAdminClient();
  console.log(`deleting file ${fileId}`);
  try {
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    );
    if (deletedFile) {
      console.log("File deleted from databases. Deleting from bucket...");
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }
    console.log("File detelted successfully");
    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError("Error in deleteFile:", error);
  }
};
