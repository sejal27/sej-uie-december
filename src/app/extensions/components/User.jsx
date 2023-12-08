import React from "react";
import { Text, Image, Flex } from "@hubspot/ui-extensions";

const User = ({ name, photo }) => {
  // console.log(name);
  return (
    <>
      <Flex gap="extra-small">
        <Image src={photo} />
        <Text>{name}</Text>
      </Flex>
    </>
  );
};

export default User;
