import React from "react";

// appwrite imports
import { Models } from "node-appwrite";

// utils imports
import { convertFileSize, formatDateTime } from "@/lib/utils";

// component imports
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";

// helper Components for Modal actions
const ImageThumbnail = ({ file }: { file: Models.Document }) => (
  <div className="file-details-thumbnail">
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col">
      <p className="subtitle-2 mb-1">{file.name}</p>
      <FormattedDateTime date={file.$createdAt} classnames="caption" />
    </div>
  </div>
);

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex">
    <p className="file-details-label text-left">{label}</p>
    <p className="file-details-value text-left">{value}</p>
  </div>
);

const FileDetails = ({
  file,
}: {
  file: Models.Document;
}) => {
  return (
    <>
      {/* File thumbnail */}
      <ImageThumbnail file={file} />

      {/* File detials  */}
      <div className="space-y-4 px-2 pt-2">
        <DetailRow label="Format:" value={file.extension} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Owner:" value={file.ownerId.fullname} />
        <DetailRow
          label="Last edited:"
          value={formatDateTime(file.$updatedAt)}
        />
      </div>
    </>
  );
};

const ShareInput = ({
  file,
  onInputChange,
  onRemove,
}: {
  file: Models.Document;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}) => {
  return <div>ShareInput</div>;
};

export { FileDetails, ShareInput };
