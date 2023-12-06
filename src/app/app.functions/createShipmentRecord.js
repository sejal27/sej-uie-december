const axios = require("axios");

exports.main = async (context = {}) => {
  // The internal ID of the custom object
  const customObjectId = "p_shipments";

  // The ID of the association from the custom object to contacts
  // Dev sandbox = 99
  // PROD = ????
  const objectToDealAssociationId = "17";

  // get the property data from the parameters
  const { dealId } = context.parameters;
  const { shippingTitle } = context.parameters;
  const { shippingAddress } = context.parameters;
  const { shippingType } = context.parameters;
  const { shippingVendor } = context.parameters;
  const { shippingNotes } = context.parameters;
  const { productData } = context.parameters;
  const { trackingNumber } = context.parameters;

  // get the private app access token from the function context
  const PRIVATE_APP_TOKEN = process.env["PRIVATE_APP_ACCESS_TOKEN"];

  //build the JSON body for the API request
  const requestBody = buildCustomObjectJson(
    dealId,
    shippingTitle,
    shippingAddress,
    shippingType,
    shippingVendor,
    shippingNotes,
    productData,
    trackingNumber,
    objectToDealAssociationId
  );

  try {
    // Create a new object associated with the contact being viewed in the card
    const { data } = await createCustomObject(
      requestBody,
      customObjectId,
      PRIVATE_APP_TOKEN
    );

    // send the request body
    return data;
  } catch (e) {
    return e;
  }
};

const createCustomObject = (requestBody, customObjectIdobjectId, token) => {
  return axios.post(
    `https://api.hubapi.com/crm/v3/objects/${customObjectIdobjectId}`,
    JSON.stringify(requestBody),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Builds the JSON for the API call
const buildCustomObjectJson = (
  dealId,
  shippingTitle,
  shippingAddress,
  shippingType,
  shippingVendor,
  shippingNotes,
  productData,
  trackingNumber,
  associationId
) => {
  return {
    properties: {
      title: shippingTitle,
      shipping_address: shippingAddress,
      shipping_type: shippingType,
      shipping_vendor: shippingVendor,
      shipping_notes: shippingNotes,
      product_data: productData,
      shipping_status: "Created",
      tracking_number: trackingNumber,
    },
    associations: [
      {
        to: {
          id: dealId,
        },
        types: [
          {
            associationCategory: "USER_DEFINED",
            associationTypeId: associationId,
          },
        ],
      },
    ],
  };
};
