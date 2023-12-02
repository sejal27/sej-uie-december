import React from "react";
import {
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
  differenceInDays,
} from "date-fns";
import {
  hubspot,
  Text,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Heading,
} from "@hubspot/ui-extensions";

hubspot.extend(({ context }) => <CalendarView context={context} />);
const CalendarView = ({ context }) => {
  let today = new Date();
  const weeks = eachWeekOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  });
  console.log("today:", today);

  const christmasThisYear = new Date(today.getFullYear(), 11, 25);
  const daysUntilchristmas = differenceInDays(christmasThisYear, today);

  return (
    <>
      <Text>
        Hello {context.user.firstName}! You have {daysUntilchristmas} remaining until Christmas
        🎄🎄🎄.
      </Text>

      <Table bordered={true}>
        <TableHead>
          <TableRow>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <TableHeader align="center" key={day}>
                {day}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {weeks.map((weekStart, i) => (
            <TableRow key={i}>
              {Array.from({ length: 7 }).map((_, j) => {
                const day = new Date(weekStart);
                day.setDate(day.getDate() + j);
                if (day.getMonth() !== today.getMonth()) {
                  return <TableCell key={j} />;
                }
                return (
                  <TableCell align="center" key={j}>
                    {day.getDate() === today.getDate() ? (
                      <Heading>🏆 {day.getDate()} 🏆</Heading>
                    ) : day.getDate() === 25 && day.getMonth() === 11 ? (
                      <Heading>🎄 {day.getDate()} 🎄</Heading>
                    ) : (
                      <Heading>{day.getDate()}</Heading>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
`;
