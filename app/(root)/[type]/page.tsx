import React from "react";

// components imports
import Sort from "@/components/Sort";
import Card from "@/components/Card";

// actions imports
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";

// Current Page 📄
const page = async ({ params }: SearchParamProps) => {
  // get the current page type
  const type = (await params)?.type as string || "";

  // call server aciton
  const files = await getFiles();

  return (
    <div className="page-container">
      {/* Type, size and sort menu bar section */}
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>
        <div className="total-size-section">
          <p className="body-1">
            Total:{" "}
            <span className="h5">
              {/* {totalSize} */}
              0 MB
            </span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      {/* Render the files list */}
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
