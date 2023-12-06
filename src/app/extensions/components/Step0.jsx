import React, { useState } from "react";
import {
  Flex,
  Button,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
  Box,
} from "@hubspot/ui-extensions";

export const Step0 = (props) => {
  const handleAdd = (thisIndex) => {
    let templist = [...props.dealLineItems];
    templist[thisIndex]["addedToShipment"] = true;
    props.setDealLineItems(templist);
  };

  const handleRemove = (thisIndex) => {
    let templist = [...props.dealLineItems];
    templist[thisIndex]["addedToShipment"] = false;
    props.setDealLineItems(templist);
  };

  return (
    <>
      <Flex direction="column" gap="small" align="center">
        <Table bordered={true}>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              {/* <TableHeader>SKU#</TableHeader> */}
              <TableHeader>Quantity</TableHeader>
              <TableHeader>Price</TableHeader>
              <TableHeader>Add To Shipment</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.dealLineItems &&
              props.dealLineItems.map((item, index) => (
                <LineItemRow
                  item={item}
                  thisIndex={index}
                  handleAdd={handleAdd}
                  handleRemove={handleRemove}
                />
              ))}
          </TableBody>
        </Table>
      </Flex>
    </>
  );
};

const LineItemRow = ({ item, thisIndex, handleAdd, handleRemove }) => {
  // const [addedToShipment, setAddedToShipment] = useState(false);

  const addItem = () => handleAdd(thisIndex);
  const removeItem = () => handleRemove(thisIndex);

  return (
    <TableRow>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>{item.price}</TableCell>
      <TableCell>
        {item.addedToShipment ? (
          <Button onClick={removeItem} variant="destructive">
            Remove
          </Button>
        ) : (
          <Button onClick={addItem}>Add</Button>
        )}
      </TableCell>
    </TableRow>
  );
};
