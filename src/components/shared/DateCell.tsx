import React from "react";
import type { DateCellProps } from "../../types";
import dayjs from "dayjs";

const DateCell: React.FC<DateCellProps> = ({ date }) => {
  const formattedDate = dayjs(date).format("MMM D, YYYY");

  return <>{formattedDate}</>;
};
export default DateCell;
