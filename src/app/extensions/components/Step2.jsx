import React, { useState } from "react";
import {
  Heading,
  TextArea,
  Text,
  Flex,
  DescriptionList,
  DescriptionListItem,
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableHeader,
  TableCell,
} from "@hubspot/ui-extensions";

export const Step2 = (props) => {
  console.log("props", props);
  return (
    <>
      <Heading>Review your shipment</Heading>
      <Flex direction="column" align="stretch" gap="small">
        <Text format={{ fontWeight: "bold" }}>{props.shippingTitle}</Text>
        <DescriptionList direction="row">
          <DescriptionListItem label="Shipment type">
            {props.shippingType}
          </DescriptionListItem>
          <DescriptionListItem label="Address">
            {props.shippingAddress}
          </DescriptionListItem>
          <DescriptionListItem label="Vendor">
            {props.shippingVendor}
          </DescriptionListItem>
        </DescriptionList>
        <Text format={{ fontWeight: "bold" }}>Products to ship</Text>
        <Table bordered={true}>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Quantity</TableHeader>
              <TableHeader>Price</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.dealLineItems &&
              props.dealLineItems.map((item, index) => (
                <TableRow>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/* <Text>Notes: {props.shippingNotes}</Text> */}
      </Flex>
      <TextArea
        label="Additional Notes"
        name="notes"
        description="Any additional notes for this shipment can be added here."
        onChange={(value) => {
          props.setShippingNotes(value);
        }}
        value={props.shippingNotes}
      />
    </>
  );
};
