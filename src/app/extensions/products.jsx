import React, { useState, useEffect } from "react";
import { CrmCardActions } from "@hubspot/ui-extensions/crm";
import {
  hubspot,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Heading,
  TableHeader,
  Flex,
  Panel,
  Tag,
  Link,
  Text,
  LoadingSpinner,
  DescriptionList,
  DescriptionListItem,
} from "@hubspot/ui-extensions";

const PAGE_SIZE = 5;

const Products = ({ runServerless, fetchProperties, context }) => {
  const [page, setPage] = useState(1);
  const [hsObjectId, setHsObjectId] = useState(null);
  const [deals, setDeals] = useState([]);
  // const [lineItems, setLineItems] = useState([]);
  const [selectedDealName, setSelectedDealName] = useState(null);
  const [selectedDealLineItems, setSelectedDealLineItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const LineitemsPanel = ({ dealname, lineitems }) => {
    return (
      <Panel title="Product Line Items" id="linetimes-detail" width="medium">
        <Flex direction="column" gap="md">
          <Heading>Product line items associated with {dealname}</Heading>
          {lineitems.map((item, index) => (
            <DescriptionList direction="row" key={index}>
              <DescriptionListItem label="Product Name">
                {item.name}
              </DescriptionListItem>
              <DescriptionListItem label="Quantity">
                {item.quantity}
              </DescriptionListItem>
              <DescriptionListItem label="Description">
                {item.description}
              </DescriptionListItem>
            </DescriptionList>
          ))}
        </Flex>
      </Panel>
    );
  };

  const getAssociatedRecordData = () => {
    runServerless({
      name: "getProducts",
      parameters: {
        hs_object_id: hsObjectId,
      },
    })
      .then((resp) => {
        setDeals(resp.response);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchProperties(["hs_object_id"]).then((properties) => {
      setHsObjectId(properties.hs_object_id);
    });
    if (hsObjectId) {
      getAssociatedRecordData(hsObjectId);
    }
  }, [fetchProperties, hsObjectId]);

  const totalPages = Math.ceil((deals || []).length / PAGE_SIZE);
  const paginatedItems = (deals || []).slice(
    (page - 1) * PAGE_SIZE,
    (page - 1) * PAGE_SIZE + PAGE_SIZE
  );

  const dealLink =
    "https://app.hubspot.com/contacts/" + context.portal.id + "/record/0-3/";

  return (
    <>
      <LineitemsPanel
        dealname={selectedDealName}
        lineitems={selectedDealLineItems}
      />

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
      <Text>
        🔥 This too is added in local dev mode for the calendar view card.
      </Text>
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
                <TableHeader>Deal Name</TableHeader>
                <TableHeader>Deal Stage</TableHeader>
                <TableHeader>Line Items</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Link href={dealLink + item.dealid}>{item.dealname}</Link>
                  </TableCell>
                  <TableCell>
                    <Tag>{item.dealstage.label}</Tag>
                  </TableCell>
                  <TableCell>
                    {item.associations.line_item_collection__primary.items
                      .length > 0 ? (
                      <Link
                        href=""
                        preventDefault
                        onClick={(__event, reactions) => {
                          setSelectedDealName(item.dealname);
                          setSelectedDealLineItems(
                            item.associations.line_item_collection__primary
                              .items
                          );
                          reactions.openPanel("linetimes-detail");
                        }}
                      >
                        {
                          item.associations.line_item_collection__primary.items
                            .length
                        }
                      </Link>
                    ) : (
                      "0"
                    )}
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
