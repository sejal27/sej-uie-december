import React from "react";
import { ToggleGroup, Select, Input } from "@hubspot/ui-extensions";

export const Step1 = (props) => {
  const shipmentTypeOptions = [
    {
      label: "Domestic",
      value: "Domestic",
      initialIsChecked: true,
    },
    {
      label: "International",
      value: "International",
      description: "Additional charges may apply.",
      initialIsChecked: false,
    },
  ];

  const vendorOptions = [
    { label: "UPS", value: "UPS" },
    { label: "FedEx", value: "FedEx" },
  ];
  return (
    <>
      <Input
        name="title"
        label="Shipment Title"
        placeholder="ex. Shipment for dealname/date"
        onChange={(value) => {
          props.setShippingTitle(value);
        }}
        value={props.shippingTitle}
      />
      <ToggleGroup
        name="shipment-type"
        label="Shipment Type"
        error={false}
        options={shipmentTypeOptions}
        tooltip="Type of the shipment"
        // validationMessage=""
        required={true}
        inline={true}
        toggleType="radioButtonList"
        variant="default"
        onChange={(value) => {
          props.setShippingType(value);
        }}
        value={props.shipppingType}
      />

      <Select
        label="Vendor"
        name="vendor"
        tooltip="Vendor selection"
        description="Regular vendor charges as per agreements"
        required={true}
        options={vendorOptions}
        onChange={(value) => {
          props.setshippingVendor(value);
        }}
        value={props.shippingVendor}
      />

      <Input
        name="address"
        label="Delivery address"
        placeholder=""
        onChange={(value) => {
          props.setShippingAddress(value);
        }}
        value={props.shippingAddress}
      />
    </>
  );
};
