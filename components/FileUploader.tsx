"user client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

// UI imports
import { Button } from "./ui/button";

// utils imports
import { cn } from "@/lib/utils";

// current component ⚛️
const FileUploader = ({
  ownerId,
  accountId,
  classNames,
}: {
  ownerId: string;
  accountId: string;
  classNames?: string;
}) => {
  // states
  const [files, setFiles] = useState<File[]>([]);

  // hook🪝
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />

      {/* upload button */}
      <Button type="button" className={cn("uploader-button", classNames)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          height={24}
          width={24}
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uplaoding</h4>
          {files.map((file) => {
            const { type, extension } = getFileType(file.name);
          })}
        </ul>
      )}
      {isDragActive
        ? <p>Drop the files here ...</p>
        : <p>Drag 'n' drop some files here, or click to select files</p>}
    </div>
  );
};

export default FileUploader;
