import React from "react";
import {
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
  differenceInDays,
} from "date-fns";
import { hubspot } from "@hubspot/ui-extensions";
import AdventStart from "./components/AdventStart";

hubspot.extend(({ context }) => <AdventStartTab context={context} />);
const AdventStartTab = ({ context }) => {
  let today = new Date();
  const weeks = eachWeekOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  });

  const christmasThisYear = new Date(today.getFullYear(), 11, 25);
  const daysUntilchristmas = differenceInDays(christmasThisYear, today);

  return (
    <AdventStart
      location={context.location}
      weeks={weeks}
      daysUntilchristmas={daysUntilchristmas}
    />
  );
};
