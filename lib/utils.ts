import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (data: unknown) => {
  return JSON.parse(JSON.stringify(data));
};

export const getFileType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  let type = "unknown";

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const videoExtensions = ["mp4", "mkv", "mov", "avi", "wmv"];
  const audioExtensions = ["mp3", "wav", "aac", "flac", "ogg"];
  const documentExtensions = [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
  ];

  if (imageExtensions.includes(extension)) {
    type = "image";
  } else if (videoExtensions.includes(extension)) {
    type = "video";
  } else if (audioExtensions.includes(extension)) {
    type = "audio";
  } else if (documentExtensions.includes(extension)) {
    type = "document";
  }

  return { type, extension };
};
