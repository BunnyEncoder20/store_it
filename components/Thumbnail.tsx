import React from "react";
import Image from "next/image";

// utils imports
import { cn, getFileIcon } from "@/lib/utils";

const Thumbnail = ({
  type,
  extension,
  url = "",
  classNames,
  imageClassNames,
}: {
  type: string;
  extension: string;
  url: string;
  classNames?: string;
  imageClassNames?: string;
}) => {
  const isImage = type === "image" && extension !== "svg";

  return (
    <figure className={cn("thumbnail", classNames)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain",
          imageClassNames,
          isImage && "thumbnail-image",
        )}
      />
    </figure>
  );
};

export default Thumbnail;
