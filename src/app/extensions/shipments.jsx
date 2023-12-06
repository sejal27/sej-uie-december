import React, { useState, useEffect } from "react";
import {
  hubspot,
  Text,
  EmptyState,
  Button,
  LoadingSpinner,
  DescriptionList,
  DescriptionListItem,
  Accordion,
  StepIndicator,
  Flex,
  Heading,
  Divider,
  Image,
  Tag,
  Link,
} from "@hubspot/ui-extensions";
import { Success } from "./components/Success";
import { ShipmentsWizard } from "./components/ShipmentsWizard";

const logos = {
  FedEx: { src: "https://i.imgur.com/vgDzvqQ.png", width: 50 },
  UPS: { src: "https://i.imgur.com/a1ZfjCT.png", width: 25 },
  default: { src: "https://i.imgur.com/g1skIjH.png", width: 45 },
};

hubspot.extend(({ context, runServerlessFunction, actions }) => (
  <Shipments
    context={context}
    runServerless={runServerlessFunction}
    fetchProperties={actions.fetchCrmObjectProperties}
    sendAlert={actions.addAlert}
  />
));

const Shipments = ({ runServerless, fetchProperties, sendAlert }) => {
  // Holds the record ID of the deal being viewed, used to fetch associations and associate new shipments
  const [objectId, setObjectId] = useState(null);
  // const portalId = context.portal.id;

  const [currentStage, setCurrentStage] = useState("initial");

  const [entries, setEntries] = useState([]);

  const [shippingTitle, setShippingTitle] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingType, setShippingType] = useState("Domestic");
  const [shippingVendor, setshippingVendor] = useState(null);
  const [shippingNotes, setShippingNotes] = useState("");

  const [dealLineItems, setDealLineItems] = useState(null);
  const [shipmentList, setShipmentList] = useState(null);

  const createNewShipment = (newShipmentData) => {
    console.log("new shipment data in create function:", newShipmentData);

    // Random tracking number for now
    let trackingNumber = Math.floor(Math.random() * 1e12);
    console.log("tracking:", trackingNumber);
    runServerless({
      name: "createShipmentRecord_new",
      parameters: {
        dealId: objectId,
        shippingTitle: newShipmentData.shippingTitle,
        shippingAddress: newShipmentData.shippingAddress,
        shippingType: newShipmentData.shippingType,
        shippingVendor: newShipmentData.shippingVendor,
        shippingNotes: newShipmentData.shippingNotes,
        productData: newShipmentData.productData,
        trackingNumber: trackingNumber,
      },
    }).then((resp) => {
      console.log("create response:", resp.response);
      sendAlert({ message: "Shipment Created!" });
      setShipmentList(null);
      setCurrentStage("initial");
    });
  };

  const allStateData = {
    shippingTitle,
    setShippingTitle,
    shippingAddress,
    setShippingAddress,
    shippingType,
    setShippingType,
    shippingVendor,
    setshippingVendor,
    shippingNotes,
    setShippingNotes,
    dealLineItems,
    setDealLineItems,
    shipmentList,
    setCurrentStage,
    entries,
    setEntries,
    createNewShipment,
  };

  const getAssociatedRecordData = (objectId) => {
    runServerless({
      name: "getAssociatedRecordData_new",
      parameters: {
        hs_object_id: objectId,
      },
    }).then((resp) => {
      console.log("all the graphql resp:", resp.response);

      // Grab line item details
      let templineitemlist =
        resp.response.data.CRM.deal.associations.line_item_collection__primary
          .items;
      if (templineitemlist.length > 0) {
        let lineItemsList = templineitemlist.map((item) => ({
          ...item,
          addedToShipment: false,
        }));
        console.log("modded line items list:", lineItemsList);
        setDealLineItems(lineItemsList);
      } else {
        console.log("no line items, pass");
      }

      // Grab existing shipment details
      let tempshipmentlist =
        resp.response.data.CRM.deal.associations
          .p_shipments_collection__shipment_to_deal.items;
      setShipmentList(tempshipmentlist);

      // Get company data for address
      // Just using the first company in the response
      let tempCompanyData =
        resp.response.data.CRM.deal.associations.company_collection__primary
          .items;
      console.log(tempCompanyData);
      let tempcomp = tempCompanyData[0];
      if (tempcomp) {
        let myAddress = `${tempcomp.address}, ${tempcomp.city}, ${tempcomp.state}, ${tempcomp.zip}, ${tempcomp.country}`;
        // console.log("company address:", myAddress);
        if (!shippingAddress) setShippingAddress(myAddress);
      }
    });
  };

  // Runs at start to get the hs_object_id and sets it for objectId
  // Runs after objectId is set to call getAssociatedAssets (if it's not already set form the first run)
  useEffect(() => {
    fetchProperties(["hs_object_id", "dealname"]).then((properties) => {
      setObjectId(properties.hs_object_id);
      // setDealName(properties.dealname);
      if (!shippingTitle)
        setShippingTitle(`New shipment for ${properties.dealname}`);
    });
    if (objectId && !shipmentList) getAssociatedRecordData(objectId);
    console.log("line items:", dealLineItems);
    console.log("shipments:", shipmentList);
  }, [fetchProperties, objectId, dealLineItems, shipmentList]);

  switch (currentStage) {
    case "wizard":
      return <ShipmentsWizard {...allStateData} />;
    case "initial":
      if (shipmentList === null) {
        return <LoadingSpinner layout="centered" label="Loading..." />;
      } else if (shipmentList.length === 0) {
        return (
          <EmptyState
            title="No shipments yet"
            layout="vertical"
            reverseOrder={true}
          >
            <Text>
              You can create shipments for the product lines in this deal
            </Text>
            <Button onClick={() => setCurrentStage("wizard")}>
              Create Shipment
            </Button>
          </EmptyState>
        );
      } else {
        return <ShipmentTable {...allStateData} />;
      }
    case "success":
      // add successful shipment creation UI here
      return <Success {...allStateData} />;
  }
};

const ShipmentTable = (props) => {
  return (
    <>
      <Flex direction="column" align="baseline" gap="medium">
        <Flex direction="column" align="stretch" gap="small">
          {props.shipmentList.map((item, i) => (
            <ShipmentDescription key={i} item={item} />
          ))}
        </Flex>
        <Button onClick={() => props.setCurrentStage("wizard")}>
          Create Shipment
        </Button>
      </Flex>
    </>
  );
};

const statusColors = {
  Created: "default",
  Shipped: "warning",
  "In Transit": "warning",
  "Out for Delivery": "error",
  Delivered: "success",
};

const trackingUrls = {
  UPS: "https://www.ups.com/track?trackNums=",
  FedEx: "https://www.fedex.com/fedextrack/?trknbr=",
};

const ShipmentDescription = ({ item }) => {
  let statusStep = 0;
  if (item.shipping_status) {
    switch (item.shipping_status.label) {
      case "Shipped":
        statusStep = 1;
        break;
      case "In Transit":
        statusStep = 2;
        break;
      case "Out for Delivery":
        statusStep = 3;
        break;
      case "Delivered":
        statusStep = 5;
        break;
    }
  }
  console.log("products", item.product_data);
  // for products: name, quantity, hs_sku
  let productDetails = [];
  try {
    if (item.product_data) productDetails = JSON.parse(item.product_data);
  } catch (error) {
    console.log("no product details or bad formatting");
  }

  const { src, width } = logos[item.shipping_vendor] || logos.default;
  const color =
    statusColors[item.shipping_status && item.shipping_status.label] ||
    "default";

  return (
    <>
      <Heading>{item.title}</Heading>
      <DescriptionList direction="row">
        <DescriptionListItem label="Vendor">
          <Image width={width} src={src} />
        </DescriptionListItem>
        <DescriptionListItem label="Status">
          <Tag variant={color}>
            {item.shipping_status && item.shipping_status.label}
          </Tag>
        </DescriptionListItem>
        <DescriptionListItem label="Tracking#">
          <Link
            href={`${trackingUrls[item.shipping_vendor]}${
              item.tracking_number
            }`}
          >
            {item.tracking_number}
          </Link>
        </DescriptionListItem>
        <DescriptionListItem label="Type">
          <Text>{item.shipping_type}</Text>
        </DescriptionListItem>
        {/* <DescriptionListItem label="Vendor">
              <Text>{item.shipping_vendor}</Text>
            </DescriptionListItem> */}
      </DescriptionList>
      <DescriptionList direction="column">
        <DescriptionListItem label="Address">
          <Text>{item.shipping_address}</Text>
        </DescriptionListItem>
        <DescriptionListItem label="Notes">
          <Text>{item.shipping_notes}</Text>
        </DescriptionListItem>
      </DescriptionList>
      <Accordion size="xs" title="Show details">
        <Flex direction="column" align="stretch" gap="md">
          {productDetails.map((item, i) => {
            return (
              <DescriptionList key={i} direction="row">
                <DescriptionListItem label="Product">
                  <Text>{item.name}</Text>
                </DescriptionListItem>
                <DescriptionListItem label="Quantity">
                  <Text>{item.quantity}</Text>
                </DescriptionListItem>
              </DescriptionList>
            );
          })}
          <StepIndicator
            currentStep={statusStep}
            circleSize="s"
            stepNames={[
              "Created",
              "Shipped",
              "In Transit",
              "Out for Delivery",
              "Delivered",
            ]}
          />
        </Flex>
      </Accordion>
      <Divider disstance="medium" />
    </>
  );
};
