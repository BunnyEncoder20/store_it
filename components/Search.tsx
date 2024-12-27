"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next/navigation";

// UI imports
import { Input } from "./ui/input";

// server actions
import { getFiles } from "@/lib/actions/file.actions";

// appwrite imports
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";

// utils imports
import FormattedDateTime from "./FormattedDateTime";

// Current Component ⚛️
const Search = () => {
  // states & hooks
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams(); // cause we in client comp, we need to get search quries through useSearchParams hook
  const searchQuery = searchParams.get("query") || "";

  // useEffects
  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!query) {
        setResults([]);
        setOpen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }
      const files = await getFiles({ searchText: query });
      setResults(files.documents);
      setOpen(true);
    };
    fetchFiles();
  }, [query]);

  // handlers
  const handleClickedItem = (file: Models.Document) => {
    setOpen(false);
    setResults([]);
    router.push(
      `/${
        file.type === "video" || file.type === "audio"
          ? "media"
          : file.type + "s" // casue other types end with an 's'
      }?query=${file.name}`,
    );
  };

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          height={24}
          width={24}
        />
        <Input
          value={query}
          placeholder="search..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />

        {open && (
          <ul className="search-result">
            {results.length > 0
              ? (
                results.map((file) => (
                  <li
                    key={file.$id}
                    className="flex items-center justify-between"
                    onClick={() => handleClickedItem(file)}
                  >
                    <div className="flex cursor-pointer items-center gap-4">
                      <Thumbnail
                        type={file.type}
                        extension={file.extension}
                        url={file.url}
                        classNames="size-9 min-w-9"
                      />
                      <p className="subtitle-2 line-clamp-1 text-light-100">
                        {file.name}
                      </p>
                    </div>

                    <FormattedDateTime
                      date={file.$createdAt}
                      classnames="caption line-clamp-1"
                    />
                  </li>
                ))
              )
              : <p className="empty-result">No files found</p>}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
