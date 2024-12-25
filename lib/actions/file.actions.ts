"use server";

// appwrite imports
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { InputFile } from "node-appwrite/file";
import { ID } from "node-appwrite";

// utils imports
import { revalidatePath } from "next/cache";
import { constructFileUrl, getFileType, parseStringify } from "../utils";

// helper functions
const handleError = (message: string, error: unknown) => {
  console.error(error, message);
  throw error;
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
