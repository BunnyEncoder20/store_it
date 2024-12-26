import React from "react";

// utils imports
import { cn, formatDateTime } from "@/lib/utils";

// current component ⚛️
const FormattedDateTime = ({
  date,
  classnames,
}: {
  date: string;
  classnames?: string;
}) => {
  return (
    <p className={cn("body-1 text-light-200", classnames)}>
      {formatDateTime(date)}
    </p>
  );
};

export default FormattedDateTime;
