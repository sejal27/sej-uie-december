import React, { useState } from "react";
import { Flex, StepIndicator, Button } from "@hubspot/ui-extensions";

import { Step0 } from "./Step0";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";

export const ShipmentsWizard = (props) => {
  const [currentStep, setCurrentStep] = useState(0);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step0 {...props} />;
      case 1:
        return <Step1 {...props} />;
      case 2:
        return <Step2 {...props} />;
    }
  };

  // A function to go to the next step
  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  // A function to go to the previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // A function to handle exiting wizard
  const handleCancel = () => {
    props.setCurrentStage("initial");
  };

  // A function to indicate wizard is finished. TODO: Set a flag here later that shipment has been created
  const handleFinish = () => {
    // props.setCurrentStage("success");
    console.log("show success");
    // build JSON blob for storing line item data, only include added items
    let lineItemData = "";
    if (props.dealLineItems) {
      lineItemData = props.dealLineItems.filter((item) => item.addedToShipment);
    }
    console.log(lineItemData);
    let newShipmentData = {
      shippingTitle: props.shippingTitle,
      shippingAddress: props.shippingAddress,
      shippingType: props.shippingType,
      shippingVendor: props.shippingVendor,
      shippingNotes: props.shippingNotes,
      productData: JSON.stringify(lineItemData),
    };
    console.log(console.log("processed newshipdata:", newShipmentData));
    props.createNewShipment(newShipmentData);
  };

  return (
    <>
      {/* Step-by-step flow - Steps container*/}
      <Flex direction="column" gap="xl">
        <StepIndicator
          currentStep={currentStep}
          stepNames={["Select Products", "Shipment Information", "Review"]}
          circleSize="md"
        />

        {/* The content for the step goes here */}
        <Flex direction="column" gap="medium">
          {renderStep()}
        </Flex>

        {/* Button footer container */}
        <Flex direction="row" justify="between">
          {currentStep === 0 ? (
            <Button onClick={handleCancel}>Cancel</Button>
          ) : (
            <Button onClick={prevStep}>Previous</Button>
          )}

          {currentStep === 2 ? (
            <Button variant="primary" onClick={handleFinish}>
              Finish
            </Button>
          ) : (
            <Button variant="primary" onClick={nextStep}>
              Next
            </Button>
          )}
        </Flex>
      </Flex>
    </>
  );
};
