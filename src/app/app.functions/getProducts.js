const axios = require("axios");

exports.main = async (context = {}) => {
  const { hs_object_id } = context.parameters;
  const PRIVATE_APP_TOKEN = process.env["PRIVATE_APP_ACCESS_TOKEN"];
  try {
    // Fetch produccts
    const { data } = await fetchProducts(
      query,
      PRIVATE_APP_TOKEN,
      hs_object_id
    );
    // console.log("resp:", data);
    let deals =
      data.data.CRM.company.associations.deal_collection__company_to_deal.items;

    // console.log("deals", deals);

    const lineItems = deals.flatMap((record) =>
      record.associations.line_item_collection__primary.items.map((item) => ({
        amount: record.amount,
        dealname: record.dealname,
        dealstage: record.dealstage,
        description: item.description,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        dealid: record.hs_object_id,
      }))
    );
    // console.log(lineItems);

    // Send the response data
    return lineItems;
  } catch (e) {
    return e;
  }
};

const fetchProducts = (query, token, id) => {
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

const query = `
query data($id: String!) {
    CRM {
        company(uniqueIdentifier: "hs_object_id", uniqueIdentifierValue: $id) {
          associations {
            deal_collection__company_to_deal {
              items {
                hs_object_id
                amount
                dealname
                dealstage
                associations {
                  line_item_collection__primary {
                    items {
                      description
                      name
                      price
                      quantity
                    }
                  }
                }
              }
            }
          }
        }
      }
}`;
