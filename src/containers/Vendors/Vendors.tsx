import React, { useCallback, useState } from "react";
import dayjs from "dayjs";
import { withStyle } from "baseui";
import { Grid, Row as Rows, Col as Column } from "components/FlexBox/FlexBox";
import { useDrawerDispatch } from "context/DrawerContext";
import Select from "components/Select/Select";
import Input from "components/Input/Input";
import Button from "components/Button/Button";

import { Plus } from "assets/icons/PlusMinus";

import { useQuery, gql } from "@apollo/client";

import { Wrapper, Header, Heading } from "components/Wrapper.style";

import {
  TableWrapper,
  StyledTable,
  StyledHeadCell,
  StyledBodyCell
} from "./Vendors.style";
import NoResult from "components/NoResult/NoResult";

const GET_VENDORS = gql`
  query getVendors($type: String, $offset: Int) {
    vendors(
      type: $type
      offset: $offset
      organisationID: "61740991d5532f3a7d63d9e9"
    ) {
      items {
        _id
        name
        slug
        email
        contact_number
        pincode
        address
        previewUrl
        thumbnailUrl
        description
        createdAt
        updatedAt
      }
    }
  }
`;

const Col = withStyle(Column, () => ({
  "@media only screen and (max-width: 767px)": {
    marginBottom: "20px",

    ":last-child": {
      marginBottom: 0
    }
  }
}));

const Row = withStyle(Rows, () => ({
  "@media only screen and (min-width: 768px)": {
    alignItems: "center"
  }
}));

const roleSelectOptions = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "member", label: "Member" },
  { value: "delivery boy", label: "Delivery boy" }
];

export default function Vendors() {
  const dispatch = useDrawerDispatch();

  const openDrawer = useCallback(
    () => dispatch({ type: "OPEN_DRAWER", drawerComponent: "VENDORS_FORM" }),
    [dispatch]
  );
  const [role, setRole] = useState([]);
  const [search, setSearch] = useState("");

  const { data, error, refetch } = useQuery(GET_VENDORS);
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  console.log(data);

  function handleCategory({ value }) {
    setRole(value);
  }

  function handleSearch(event) {
    const value = event.currentTarget.value;
    setSearch(value);
  }

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={12}>
          <Header
            style={{
              marginBottom: 40,
              boxShadow: "0 0 5px rgba(0, 0 ,0, 0.05)"
            }}
          >
            <Col md={3} xs={12}>
              <Heading>Vendors</Heading>
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
                          borderBottomRightRadius: "3px"
                        })
                      }
                    }}
                  >
                    Add Vendors
                  </Button>
                </Col>
              </Row>
            </Col>
          </Header>

          <Wrapper style={{ boxShadow: "0 0 5px rgba(0, 0 , 0, 0.05)" }}>
            <TableWrapper>
              <StyledTable $gridTemplateColumns="minmax(70px, 70px) minmax(270px, max-content) minmax(270px, max-content) minmax(150px, max-content) minmax(150px, auto) minmax(150px, auto) minmax(150px, auto)">
                <StyledHeadCell>ID</StyledHeadCell>
                <StyledHeadCell>Name</StyledHeadCell>
                <StyledHeadCell>Email</StyledHeadCell>
                <StyledHeadCell>Contact</StyledHeadCell>
                <StyledHeadCell>Joining Date</StyledHeadCell>
                <StyledHeadCell>Address</StyledHeadCell>
                <StyledHeadCell>Pincode</StyledHeadCell>

                {data ? (
                  data.vendors.items.length ? (
                    data.vendors.items.map((row, index) => (
                      <React.Fragment key={index}>
                        <StyledBodyCell>
                          {row["_id"].slice(0, 6)}
                        </StyledBodyCell>
                        <StyledBodyCell>{row["name"]}</StyledBodyCell>
                        <StyledBodyCell>{row["email"]}</StyledBodyCell>
                        <StyledBodyCell>{row["contact_number"]}</StyledBodyCell>
                        <StyledBodyCell>
                          {dayjs(row["createdAt"]).format("DD MMM YYYY")}
                        </StyledBodyCell>
                        <StyledBodyCell>{row["address"]}</StyledBodyCell>
                        <StyledBodyCell>{row["pincode"]}</StyledBodyCell>
                      </React.Fragment>
                    ))
                  ) : (
                    <NoResult
                      hideButton={false}
                      style={{
                        gridColumnStart: "1",
                        gridColumnEnd: "one"
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
