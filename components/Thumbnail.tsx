import React from "react";
import Image from "next/image";

// utils imports
import { cn, getFileIcon } from "@/lib/utils";

const Thumbnail = ({
  type,
  extension,
  url = "",
  imageClassNames,
  classNames,
}: {
  type: string;
  extension: string;
  url: string;
  imageClassNames?: string;
  classNames?: string;
}) => {
  const isImage = type === "image" && extension === "svg";

  return (
    <figure className={cn("thumbnail", classNames)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
        height={100}
        width={100}
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
