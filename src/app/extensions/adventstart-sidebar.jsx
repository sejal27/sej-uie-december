import React from "react";
import {
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
  differenceInDays,
} from "date-fns";
import { hubspot, Text } from "@hubspot/ui-extensions";
import AdventStart from "./components/AdventStart";

hubspot.extend(({ context }) => <AdventStartSidebar context={context} />);
const AdventStartSidebar = ({ context }) => {
  let today = new Date();
  const weeks = eachWeekOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  });

  const christmasThisYear = new Date(today.getFullYear(), 11, 25);
  const daysUntilchristmas = differenceInDays(christmasThisYear, today);

  return (
    <>
      <Text>
        🔥 This too is added in local dev mode for the calendar view card.
      </Text>
      <AdventStart
        location={context.location}
        weeks={weeks}
        daysUntilchristmas={daysUntilchristmas}
      />
    </>
  );
};
