import React from "react";
import { Statistics, StatisticsItem } from "@hubspot/ui-extensions";
import CalendarView from "./CalendarView";

export default function AdventStart({ location, weeks, daysUntilchristmas }) {
  console.log(location, weeks, daysUntilchristmas);
  return (
    <>
      <Statistics>
        <StatisticsItem
          label="🎄 Days until christmas 🎄"
          number={daysUntilchristmas}
        ></StatisticsItem>
      </Statistics>

      {location === "crm.record.tab" && <CalendarView weeks={weeks} />}
    </>
  );
}
