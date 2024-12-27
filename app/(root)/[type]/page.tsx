import React from "react";

// components imports
import Sort from "@/components/Sort";
import Card from "@/components/Card";

// actions imports
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import { convertFileSize, getFileTypesParams } from "@/lib/utils";

// Current Page 📄
const page = async ({ params, searchParams }: SearchParamProps) => {
  // get the current page type
  const type = (await params)?.type as string || "";
  const types = getFileTypesParams(type) as FileType[];

  // get the search params
  const searchText = ((await searchParams)?.query) as string || "";
  const sort = ((await searchParams)?.sort) as string || "";

  // call server aciton
  // const files = await getFiles({ types, searchText, sort });
  const [files, totalSpace] = await Promise.all([
    getFiles({ types, searchText, sort }),
    getTotalSpaceUsed(),
  ]);

  // Calculate the total size for the current type
  const currentTypeSize = types.reduce((total, fileType) => {
    return total + (totalSpace[fileType]?.size || 0);
  }, 0);

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total:{" "}
            <span className="h5">
              {convertFileSize(currentTypeSize) || "0 MB"}
            </span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>

            <Sort />
          </div>
        </div>
      </section>

      {/* Render the files */}
      {files.total > 0
        ? (
          <section className="file-list">
            {files.documents.map((file: Models.Document) => (
              <Card key={file.$id} file={file} />
            ))}
          </section>
        )
        : <p className="empty-list">No files uploaded</p>}
    </div>
  );
};

export default page;
