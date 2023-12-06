import React from "react";
import { Panel, Text } from "@hubspot/ui-extensions";

export default function QuotesPanel() {
  return (
    <>
      <Panel id="quotes-panel" title="Create a new Quote">
        {/* <Flex direction="column" gap="xs">
          {step === Steps.TripDetails && (
            <TripDetails onNext={handleTripDetails} />
          )}
          {step === Steps.BusOptions && (
            <BusOptions passengers={passengers} onNext={handleBusOption} />
          )}
          {step === Steps.QuoteName && (
            <QuoteName
              onNext={handleQuoteName}
              defaultName={`Quote-${sku}-${distance}-x${numberOfBuses}`}
            />
          )}
        </Flex>  */}
        <Text>Test for Panel</Text>
      </Panel>
    </>
  );
}
