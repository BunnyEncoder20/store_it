import React from "react";
import Link from "next/link";

// appwrite imports
import { Models } from "node-appwrite";

// component imports
import Thumbnail from "./Thumbnail";
import ActionDropdown from "./ActionDropdown";
import FormattedDateTime from "./FormattedDateTime";

// utils imports
import { convertFileSize } from "@/lib/utils";

// Current component ⚛️
const Card = ({
  file,
}: {
  file: Models.Document;
}) => {
  return (
    <Link href={file.url} target="_blank" className="file-card">
      {/* File Thumbnail, settings and size section */}
      <div className="flex justify-between">
        {/* Circular thumbnail */}
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          classNames="!size-20"
          imageClassNames="!size-11"
        />

        <div className="flex flex-col items-end justify-between">
          <ActionDropdown file={file} />
          <p className="body-1">
            {convertFileSize(file.size)}
          </p>
        </div>
      </div>

      {/* File details section */}
      <div className="file-card-details">
        {/* name */}
        <p className="subtitle-2 line-clamp-1">
          {file.name}
        </p>
        {/* date */}
        <FormattedDateTime
          date={file.$createdAt}
          classnames="body-2 text-light-100"
        />
        {/* owner */}
        <p className="caption line-clamp-1 text-light-200">
          By: {file.ownerId.fullname}
        </p>
      </div>
    </Link>
  );
};

export default Card;
