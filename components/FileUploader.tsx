"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

// UI imports
import { Button } from "./ui/button";
import Thumbnail from "./Thumbnail";

// utils imports
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";

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
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // functions
  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string,
  ) => {
    e.stopPropagation();
    // filter out the filename from the prevFiles state
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

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
          <h4 className="h4 text-light-100">Uploading</h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex items-center gap-3">
                  {/* circle filetype icon */}
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />
                  {/* file name */}
                  <div className="preview-item-name">
                    {file.name}

                    {/* uploading gif */}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      alt="loader"
                      height={26}
                      width={80}
                    />
                  </div>
                </div>

                {/* Remove file from upload */}
                <Image
                  src="/assets/icons/remove.svg"
                  alt="remove"
                  height={24}
                  width={24}
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
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
