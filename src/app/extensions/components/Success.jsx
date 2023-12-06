import React, { useState } from "react";
import {
  Text,
  DescriptionList,
  DescriptionListItem,
  StepIndicator,
  Heading,
  Flex,
  Accordion,
} from "@hubspot/ui-extensions";

export const Success = (props) => {
  return (
    <>
      <Flex direction="column" align="stretch" gap="small">
        <Heading>{props.shippingTitle}</Heading>
        <DescriptionList direction="row">
          <DescriptionListItem label="Shipping Type">
            <Text>{props.shippingType}</Text>
          </DescriptionListItem>
        </DescriptionList>
        <DescriptionList direction="row">
          <DescriptionListItem label="Shipping Address">
            <Text>{props.shippingAddress}</Text>
          </DescriptionListItem>
        </DescriptionList>
        <DescriptionList direction="row">
          <DescriptionListItem label="Shipping Vendor">
            <Text>{props.shippingVendor}</Text>
          </DescriptionListItem>
        </DescriptionList>
        <DescriptionList direction="row">
          <DescriptionListItem label="Shipping Type">
            <Text>{props.shippingNotes}</Text>
          </DescriptionListItem>
        </DescriptionList>       
        {props.dealLineItems.map((item) => <LineItemRow item={item} />)}
        <Accordion size="small" title="Show tracking details">
          <Flex direction="column" align="stretch" gap="md">
            <Text>Tentative delivery date: some date</Text>

            <StepIndicator
              currentStep={0}
              circleSize="xs"
              stepNames={[
                "Created",
                "Shipped",
                "In Transit",
                "Out for Deliver",
                "Delivered",
              ]}
            />
          </Flex>
        </Accordion>
      </Flex>
    </>
  );
};

const LineItemRow = ({item}) =>{
  if (item.addedToShipment) {
    return(
      <DescriptionList direction="row">
        <DescriptionListItem label="Product">
          <Text>{item.name}</Text>
        </DescriptionListItem>
        <DescriptionListItem label="SKU">
          <Text>{item.hs_sku}</Text>
        </DescriptionListItem>
      </DescriptionList>
    )
  } else {
    return <></>
  }
  
}