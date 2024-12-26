import React from "react";

// components imports
import Sort from "@/components/Sort";

// Current Page 📄
const page = async ({ params }: SearchParamProps) => {
  // get the current page type
  const type = (await params)?.type as string || "";

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

      {/* render the files here */}
    </div>
  );
};

export default page;
