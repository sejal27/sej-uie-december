import React from "react";
import {
  Text,
  Table,
  TableBody,
  Flex,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@hubspot/ui-extensions";

export default function CalendarView({ weeks }) {
  let today = new Date();
  return (
    <>
      <Table bordered={true}>
        <TableHead>
          <TableRow>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <TableHeader width="auto" align="center" key={day}>
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
                  <TableCell align="center" width="auto" key={j}>
                    {day.getDate() === today.getDate() ? (
                      <Flex direction="column">
                        <Text format={{ fontWeight: "bold" }}>
                          {day.getDate()} 🌟
                        </Text>
                      </Flex>
                    ) : day.getDate() === 25 && day.getMonth() === 11 ? (
                      <Flex direction="column">
                        <Text format={{ fontWeight: "bold" }}>
                          {day.getDate()} 🎄
                        </Text>
                      </Flex>
                    ) : (
                      <Flex direction="column">
                        <Text>{day.getDate()}</Text>
                      </Flex>
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
}
