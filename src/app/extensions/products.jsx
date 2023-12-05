import React, { useState, useEffect } from "react";
import { CrmCardActions } from "@hubspot/ui-extensions/crm";
import {
  hubspot,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableHeader,
  Flex,
  Text,
  Stack,
  Tag,
  Link,
  LoadingSpinner,
} from "@hubspot/ui-extensions";

const PAGE_SIZE = 5;

const Products = ({ runServerless, fetchProperties, context }) => {
  const [page, setPage] = useState(1);
  const [hsObjectId, setHsObjectId] = useState(null);
  const [lineItems, setlineItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAssociatedRecordData = (objectId) => {
    runServerless({
      name: "getProducts",
      parameters: {
        hs_object_id: hsObjectId,
      },
    })
      .then((resp) => {
        console.log(resp);
        setlineItems(resp.response);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    setLoading(true);
    fetchProperties(["hs_object_id"]).then((properties) => {
      setHsObjectId(properties.hs_object_id);
    });
    console.log(hsObjectId);
    if (hsObjectId) {
      getAssociatedRecordData(hsObjectId);
    }
  }, [fetchProperties, hsObjectId]);

  const totalPages = Math.ceil((lineItems || []).length / PAGE_SIZE);
  const paginatedItems = (lineItems || []).slice(
    (page - 1) * PAGE_SIZE,
    (page - 1) * PAGE_SIZE + PAGE_SIZE
  );

  const dealLink =
    "https://app.hubspot.com/contacts/" + context.portal.id + "/record/0-3/";

  return (
    <>
      <CrmCardActions
        actionConfigs={[
          {
            type: "action-library-button",
            label: "Add Deal",
            actionType: "OPEN_RECORD_ASSOCIATION_FORM",
            actionContext: {
              objectTypeId: "0-3",
              association: {
                objectTypeId: "0-2",
                objectId: hsObjectId,
              },
            },
          },
        ]}
      />
      <Flex direction="column" gap="small" align="stretch">
        {loading ? (
          <LoadingSpinner layout="centered" />
        ) : (
          <Table
            page={page}
            bordered={true}
            paginated={totalPages > 1}
            onPageChange={setPage}
            pageCount={totalPages}
          >
            <TableHead>
              <TableRow>
                <TableHeader>Line Item</TableHeader>
                <TableHeader>Quantity</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader width={350}>Deal</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Stack>
                      <Text format={{ fontWeight: "bold" }}>{item.name}</Text>
                      {/* <Text variant="microcopy">{item.description}</Text> */}
                    </Stack>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {item.price ? parseFloat(item.price).toFixed(2) : ""}
                  </TableCell>
                  <TableCell width={350}>
                    <Stack>
                      <Link href={dealLink + item.dealid}>{item.dealname}</Link>
                      <Tag>{item.dealstage.label}</Tag>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Flex>
    </>
  );
};

hubspot.extend(({ runServerlessFunction, actions, context }) => (
  <Products
    runServerless={runServerlessFunction}
    fetchProperties={actions.fetchCrmObjectProperties}
    context={context}
  />
));
