const axios = require("axios");

exports.main = async (context = {}) => {
  console.log("inside getAsssociatedRecordData");
  const { hs_object_id } = context.parameters;
  const PRIVATE_APP_TOKEN = process.env["PRIVATE_APP_ACCESS_TOKEN"];
  // console.log(process.env);

  try {
    // Fetch associations
    const { data } = await fetchAssociations(
      query,
      PRIVATE_APP_TOKEN,
      hs_object_id
    );

    // Send the response data
    return data;
  } catch (e) {
    return e;
  }
};

const fetchAssociations = (query, token, id) => {
  const body = {
    operationName: "data",
    query,
    variables: { id },
  };

  return axios.post(
    "https://api.hubapi.com/collector/graphql",
    JSON.stringify(body),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// GraphQL query to fetch details for associated asset records
const query = `
query data($id: String!) {
  CRM {
    deal(uniqueIdentifier: "hs_object_id", uniqueIdentifierValue: $id) {
      associations {
        line_item_collection__primary {
          items {
            name
            price
            quantity
          }
        }
        p_shipments_collection__shipment_to_deal {
          items {
            hs_object_id
            hs_lastmodifieddate
            product_data
            shipping_address
            shipping_notes
            shipping_status
            shipping_type
            shipping_vendor
            title
            tracking_number
          }
        }
        company_collection__primary {
          items {
            address
            address2
            city
            country
            state
            zip
          }
        }
      }
    }
  }
}
`;
