import React, { useState } from "react";
import { hubspot } from "@hubspot/ui-extensions";
import {
  LoadingSpinner,
  Flex,
  Button,
  Box,
  StepIndicator,
} from "@hubspot/ui-extensions";
import { CrmAssociationTable } from "@hubspot/ui-extensions/crm";
import QuotesPanel from "./components/QuotesPanel.jsx";

// import { TripDetails } from "./components/TripDetails.jsx";
// import { BusOptions } from "./components/BusOptions.jsx";
// import { QuotesView } from "./components/QuotesView.jsx";
// import { QuoteName } from "./components/QuoteName.jsx";

// const Steps = {
//   QuotesView: 0,
//   TripDetails: 1,
//   BusOptions: 2,
//   QuoteName: 3,
// };

// Define the extension to be run within the Hubspot CRM
hubspot.extend(({ runServerlessFunction }) => (
  <ShuttleBusQuotes runServerless={runServerlessFunction} />
));

const ShuttleBusQuotes = ({ runServerless }) => {
  // const [step, setStep] = useState(Steps.QuotesView);
  // const [passengers, setPassengers] = useState();
  // const [distance, setDistance] = useState();
  // const [sku, setSku] = useState();
  // const [numberOfBuses, setNumberOfBuses] = useState();
  const [loading, setLoading] = useState(false);

  // const generateQuote = ({ ...payload }) => {
  //   // Execute serverless function to generate a quote
  //   return runServerless({
  //     name: "createQuote",
  //     propertiesToSend: ["hs_object_id"],
  //     payload,
  //   });
  // };

  // const handleTripDetails = ({ passengers, distance }) => {
  //   // Save passengers and distance form data
  //   setPassengers(passengers);
  //   setDistance(distance);
  //   setStep(Steps.BusOptions);
  // };

  // const handleBusOption = ({ sku, numberOfBuses }) => {
  //   // Save bus options form data
  //   setSku(sku);
  //   setNumberOfBuses(numberOfBuses);
  //   setStep(Steps.QuoteName);
  // };

  // const handleQuoteName = ({ quoteName }) => {
  //   setLoading(true);
  //   // Generate a quote and render initial view
  //   generateQuote({ distance, sku, numberOfBuses, quoteName }).then(() => {
  //     setLoading(false);
  //     setStep(Steps.QuotesView);
  //   });
  // };

  return (
    <>
      <QuotesPanel />
      {/* {loading == false && ( */}
      <Flex direction="column" gap="sm">
        <Box>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={(__event, reactions) => {
              reactions.openPanel("quotes-panel");
            }}
          >
            Create Quote
          </Button>
        </Box>
        <CrmAssociationTable
          objectTypeId="0-14"
          propertyColumns={["hs_title", "hs_quote_amount"]}
          quickFilterProperties={["hs_title", "hs_quote_amount"]}
          pageSize={10}
          associationLabelFilter={false}
          sort={[
            {
              direction: 0,
              columnName: "hs_createdate",
            },
          ]}
          searchable={true}
          pagination={true}
        />
      </Flex>
      {/* )} */}
      {/* If loading, show a spinner */}
      {loading === true && <LoadingSpinner />}
    </>
  );
};
