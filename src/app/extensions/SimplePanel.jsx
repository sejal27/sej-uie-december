import React, { useState } from "react";
import { hubspot } from "@hubspot/ui-extensions";
import {
  Button,
  Flex,
  Panel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@hubspot/ui-react";

hubspot.extend(({ runServerlessFunction, actions }) => (
  <Extension runServerlessFunction={runServerlessFunction} actions={actions} />
));

const CellWithDetails = ({ text, onClick }) => {
  return (
    <TableCell>
      <Flex align="center" direction="row" justify="between">
        <Text>{text}</Text>
        <Button
          size="xs"
          onClick={async (__, reations) => {
            onClick();
            reations.openPanel("my-panel");
          }}
        >
          See quotes
        </Button>
      </Flex>
    </TableCell>
  );
};

const nameToQuotes = {
  "Tim Robinson": [
    "No, I eat paper all the time!",
    "Have you been the victim of unfair treatment by a business or a corporation? Has this ever happened to you? You bought a house, it was not disclosed to you that there was a termite infestation in the walls and in the moldings, so you have to take it upon yourself to call your own termite extermination company, but when the guys show up, they immediately ask if they can use your bathroom, then for over two hours, they take turns going in and out of there, taking huge mud pies and over-flushing?",
    "Fine. You win. That's fine. I just wanted to do something good this morning before alcohol class. But you won. That's the last time I try to do something good ever again.",
    "That's a nice motorcycle.",
  ],
  "Patti Harrison": [
    "To this day, I hate bald boys. I can't stand bald boys. Every time I see them, I think I'm back in the pants.",
    "Santa himself brought this here early, with Rudolph, and now it's causing a fight.",
    "Dogs are to Steven what rats are to me.",
    "I sued the city because I was accidentally sewed into the pants of the big Charlie Brown at the Thanksgiving Day parade. I made all my money off the big Charlie Brown, so don't even come and try and tell me any crap! I don't want that!",
  ],
  "Sam Richardson": [
    "All right, you know what? This is dumb. Dump it. Trash it. This one's garbage.",
    "Okay, hes being shy. Everybody clap, so he's gotta come up. See, the're clapping. You got to come. Gotta come up. Hurry up. Come on. Everybody loves it when the boss comes up. It's fun when the boss comes. Everybody loves it.",
    "Who's your carved ham up here? Who's carved up?",
  ],
  "Ruben Rabasa": [
    "A good steering wheel that doesn't fly off your hand while you're driving.",
    "Teacher's pet.",
    "Oh, my God, he admit it!",
  ],
};

const Extension = () => {
  const [selected, setSelected] = useState();

  return (
    <>
      <Panel id="my-panel" title={`${selected} Quotes`}>
        {selected &&
          nameToQuotes[selected].map((quote) => <Text>{quote}</Text>)}
      </Panel>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Role</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Tim Robinson</TableCell>
            <CellWithDetails
              text="Car Salesman"
              onClick={() => setSelected("Tim Robinson")}
            />
          </TableRow>
          <TableRow>
            <TableCell>Patti Harrison</TableCell>
            <CellWithDetails
              text="Tables (vendor)"
              onClick={() => setSelected("Patti Harrison")}
            />
          </TableRow>
          <TableRow>
            <TableCell>Sam Richardson</TableCell>
            <CellWithDetails
              text="Show host"
              onClick={() => setSelected("Sam Richardson")}
            />
          </TableRow>
          <TableRow>
            <TableCell>Ruben Rabasa</TableCell>
            <CellWithDetails
              text="Car imagineer"
              onClick={() => setSelected("Ruben Rabasa")}
            />
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};
