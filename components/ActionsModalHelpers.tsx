import React from "react";
import Image from "next/image";

// appwrite imports
import { Models } from "node-appwrite";

// utils imports
import { convertFileSize, formatDateTime } from "@/lib/utils";

// component imports
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

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
  return (
    <>
      <ImageThumbnail file={file} />

      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">
          Share file with other users
        </p>
        <Input
          type="email"
          placeholder="enter email address"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
          className="share-input-field"
          // disabled={file.ownerId !== currentUser.$id}
        />

        {/* shared with users */}
        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Shared with</p>
            <p className="subtitle-2 text-light-200">
              {file.users.length} users
            </p>
          </div>
          <ul className="pt-2">
            {file.users.map((email: string) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2"
              >
                <p className="subtitle-2">{email}</p>
                <Button
                  onClick={() => onRemove(email)}
                  className="share-remove-user"
                >
                  <Image
                    src="assets/icons/remove.svg"
                    alt="remove"
                    width={24}
                    height={24}
                    className="remove-icon"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export { FileDetails, ShareInput };
