import React, { useCallback, useState } from "react";
import dayjs from "dayjs";
import { withStyle } from "baseui";
import { Grid, Row as Rows, Col as Column } from "components/FlexBox/FlexBox";
import { useDrawerDispatch } from "context/DrawerContext";
import Select from "components/Select/Select";
import Input from "components/Input/Input";
import Button from "components/Button/Button";

import { Plus } from "assets/icons/PlusMinus";

import { useQuery, gql, useMutation } from "@apollo/client";

import { Wrapper, Header, Heading } from "components/Wrapper.style";

import {
  TableWrapper,
  StyledTable,
  StyledHeadCell,
  StyledBodyCell,
} from "./Slot.style";
import NoResult from "components/NoResult/NoResult";

const GET_SLOTS = gql`
  query getSlots {
    slots(organisationID: "61c59c3620fc430008c3174b", isAllowed: true) {
      _id
      type
      title
      time_slot
      published
    }
  }
`;

const UPADATE_VISIBILITY = gql`
  mutation slotVisibility($slotID: String!, $published: Boolean!) {
    slotVisibility(slotID: $slotID, published: $published) {
      _id
    }
  }
`;
const Col = withStyle(Column, () => ({
  "@media only screen and (max-width: 767px)": {
    marginBottom: "20px",

    ":last-child": {
      marginBottom: 0,
    },
  },
}));

const Row = withStyle(Rows, () => ({
  "@media only screen and (min-width: 768px)": {
    alignItems: "center",
  },
}));

const roleSelectOptions = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "member", label: "Member" },
  { value: "delivery boy", label: "Delivery boy" },
];

export default function StaffMembers() {
  const dispatch = useDrawerDispatch();
  const [updateVisibility] = useMutation(UPADATE_VISIBILITY);

  const openDrawer = useCallback(
    () => dispatch({ type: "OPEN_DRAWER", drawerComponent: "SLOT" }),
    [dispatch]
  );
  const [role, setRole] = useState([]);
  const [search, setSearch] = useState("");

  const { data, error, refetch } = useQuery(GET_SLOTS);
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  function handlePublish(slot) {
    console.log(!slot.published);

    updateVisibility({
      variables: { slotID: slot._id, published: !slot.published },
    });
  }

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={12}>
          <Header
            style={{
              marginBottom: 40,
              boxShadow: "0 0 5px rgba(0, 0 ,0, 0.05)",
            }}
          >
            <Col md={3} xs={12}>
              <Heading>Staff Members</Heading>
            </Col>

            <Col md={9} xs={12}>
              <Row>
                <Col md={3} xs={12}>
                  {/* <Select
                    options={roleSelectOptions}
                    labelKey="label"
                    valueKey="value"
                    placeholder="Role"
                    value={role}
                    searchable={false}
                    onChange={handleCategory}
                  /> */}
                </Col>

                <Col md={5} xs={12}>
                  {/* <Input
                    value={search}
                    placeholder="Ex: Quick Search By Name"
                    onChange={handleSearch}
                    clearable
                  /> */}
                </Col>

                <Col md={4} xs={12}>
                  <Button
                    onClick={openDrawer}
                    startEnhancer={() => <Plus />}
                    overrides={{
                      BaseButton: {
                        style: () => ({
                          width: "100%",
                          borderTopLeftRadius: "3px",
                          borderTopRightRadius: "3px",
                          borderBottomLeftRadius: "3px",
                          borderBottomRightRadius: "3px",
                        }),
                      },
                    }}
                  >
                    Add Time Slot
                  </Button>
                </Col>
              </Row>
            </Col>
          </Header>

          <Wrapper style={{ boxShadow: "0 0 5px rgba(0, 0 , 0, 0.05)" }}>
            <TableWrapper>
              <StyledTable $gridTemplateColumns="minmax(170px, 70px) minmax(470px, max-content) minmax(370px, max-content) minmax(279px, max-content) minmax(179px, max-content)">
                <StyledHeadCell>ID</StyledHeadCell>
                <StyledHeadCell>Title</StyledHeadCell>
                <StyledHeadCell>Type</StyledHeadCell>
                <StyledHeadCell>Time_Slot</StyledHeadCell>
                <StyledHeadCell>Disable</StyledHeadCell>
                {data ? (
                  data.slots.length ? (
                    data.slots.map((row, index) => (
                      <React.Fragment key={index}>
                        <StyledBodyCell>
                          {row["_id"].slice(0, 18)}
                        </StyledBodyCell>
                        <StyledBodyCell>{row["title"]}</StyledBodyCell>
                        <StyledBodyCell>{row["type"]}</StyledBodyCell>
                        <StyledBodyCell>{row["time_slot"]}</StyledBodyCell>
                        <StyledBodyCell>
                          {" "}
                          <Button
                            onClick={() => handlePublish(row)}
                            // startEnhancer={() => <Plus />}
                            overrides={{
                              BaseButton: {
                                style: () => ({
                                  width: "100%",
                                  borderTopLeftRadius: "3px",
                                  borderTopRightRadius: "3px",
                                  borderBottomLeftRadius: "3px",
                                  borderBottomRightRadius: "3px",
                                }),
                              },
                            }}
                          >
                            {row.published ? "Stop" : "Allow"}
                          </Button>
                        </StyledBodyCell>
                      </React.Fragment>
                    ))
                  ) : (
                    <NoResult
                      hideButton={false}
                      style={{
                        gridColumnStart: "1",
                        gridColumnEnd: "one",
                      }}
                    />
                  )
                ) : null}
              </StyledTable>
            </TableWrapper>
          </Wrapper>
        </Col>
      </Row>
    </Grid>
  );
}
