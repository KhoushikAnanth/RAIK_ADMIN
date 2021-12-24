import React, { useState } from "react";
import { styled, withStyle, createThemedUseStyletron } from "baseui";
import dayjs from "dayjs";
import { Grid, Row as Rows, Col as Column } from "components/FlexBox/FlexBox";
import Select from "components/Select/Select";
import Input from "components/Input/Input";

import { useQuery, gql, useLazyQuery } from "@apollo/client";
import { Wrapper, Header, Heading } from "components/Wrapper.style";
import Checkbox from "components/CheckBox/CheckBox";
import { FaEye } from "react-icons/fa";

import {
  TableWrapper,
  StyledTable,
  StyledHeadCell,
  StyledCell,
} from "./Orders.style";
import NoResult from "components/NoResult/NoResult";
import Button, { KIND, SIZE, SHAPE } from "components/Button/Button";
import { useDrawerDispatch } from "context/DrawerContext";

const GET_ORDERS = gql`
  query getOrders($status: String, $limit: Int, $searchText: String) {
    orders(
      status: $status
      limit: $limit
      searchText: $searchText
      organisationID: "61c59c3620fc430008c3174b"
    ) {
      _id
      customer {
        _id
        name
      }
      creation_date
      address
      contact_number
      pincode
      amount
      payment_method
      status
      deliveryTime
    }
  }
`;

const GET_CUSTOMER = gql`
  query customer($id: String) {
    customer(id: $id) {
      _id
      contacts {
        type
        number
      }
      addresses {
        name
        address
        pincode
      }
    }
  }
`;

type CustomThemeT = { red400: string; textNormal: string; colors: any };
const themedUseStyletron = createThemedUseStyletron<CustomThemeT>();

const Status = styled("div", ({ $theme }) => ({
  ...$theme.typography.fontBold14,
  color: $theme.colors.textDark,
  display: "flex",
  alignItems: "center",
  lineHeight: "1",
  textTransform: "capitalize",

  ":before": {
    content: '""',
    width: "10px",
    height: "10px",
    display: "inline-block",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    borderBottomRightRadius: "10px",
    borderBottomLeftRadius: "10px",
    backgroundColor: $theme.borders.borderE6,
    marginRight: "10px",
  },
}));

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

export default function Orders() {
  const dispatch = useDrawerDispatch();

  const openDrawer = React.useCallback(
    (data) =>
      dispatch({
        type: "OPEN_DRAWER",
        drawerComponent: "ORDER_DETAILS",
        data: data,
      }),
    [dispatch]
  );

  const [checkedId, setCheckedId] = useState([]);
  const [checked, setChecked] = useState(false);

  const [useCss, theme] = themedUseStyletron();
  const sent = useCss({
    ":before": {
      content: '""',
      backgroundColor: theme.colors.primary,
    },
  });
  const failed = useCss({
    ":before": {
      content: '""',
      backgroundColor: theme.colors.red400,
    },
  });
  const processing = useCss({
    ":before": {
      content: '""',
      backgroundColor: theme.colors.textNormal,
    },
  });
  const paid = useCss({
    ":before": {
      content: '""',
      backgroundColor: theme.colors.blue400,
    },
  });

  const [status, setStatus] = useState([]);
  const [limit, setLimit] = useState([]);
  const [search, setSearch] = useState([]);

  const { data, error, refetch } = useQuery(GET_ORDERS);

  if (error) {
    return <div>Error! {error.message}</div>;
  }

  console.log(data);

  function handleStatus({ value }) {
    setStatus(value);
    if (value.length) {
      refetch({
        status: value[0].value,
        limit: limit.length ? limit[0].value : null,
      });
    } else {
      refetch({ status: null });
    }
  }

  function handleLimit({ value }) {
    setLimit(value);
    if (value.length) {
      refetch({
        status: status.length ? status[0].value : null,
        limit: value[0].value,
      });
    } else {
      refetch({
        limit: null,
      });
    }
  }
  function handleSearch(event) {
    const { value } = event.currentTarget;
    setSearch(value);
    refetch({ searchText: value });
  }
  function onAllCheck(event) {
    if (event.target.checked) {
      const idx = data && data.orders.map((order) => order.id);
      setCheckedId(idx);
    } else {
      setCheckedId([]);
    }
    setChecked(event.target.checked);
  }

  function handleCheckbox(event) {
    const { name } = event.currentTarget;
    if (!checkedId.includes(name)) {
      setCheckedId((prevState) => [...prevState, name]);
    } else {
      setCheckedId((prevState) => prevState.filter((id) => id !== name));
    }
  }
  return (
    <Grid fluid={true}>
      <Row>
        <Col md={12}>
          <Header
            style={{
              marginBottom: 30,
              boxShadow: "0 0 8px rgba(0, 0 ,0, 0.1)",
            }}
          >
            <Col md={3} xs={12}>
              <Heading>Orders</Heading>
            </Col>

            <Col md={9} xs={12}>
              {/* <Row>
                <Col md={3} xs={12}>
                  <Select
                    options={statusSelectOptions}
                    labelKey="label"
                    valueKey="value"
                    placeholder="Status"
                    value={status}
                    searchable={false}
                    onChange={handleStatus}
                  />
                </Col>

                <Col md={3} xs={12}>
                  <Select
                    options={limitSelectOptions}
                    labelKey="label"
                    valueKey="value"
                    value={limit}
                    placeholder="Order Limits"
                    searchable={false}
                    onChange={handleLimit}
                  />
                </Col>

                <Col md={6} xs={12}>
                  <Input
                    value={search}
                    placeholder="Ex: Search By Address"
                    onChange={handleSearch}
                    clearable
                  />
                </Col>
              </Row> */}
            </Col>
          </Header>

          <Wrapper style={{ boxShadow: "0 0 5px rgba(0, 0 , 0, 0.05)" }}>
            <TableWrapper>
              <StyledTable $gridTemplateColumns="minmax(70px, 70px) minmax(150px, auto) minmax(150px, auto) minmax(200px, max-content) minmax(150px, auto) minmax(150px, auto) minmax(150px, auto) minmax(150px, auto) minmax(70px, 100px)  minmax(70px, 100px) minmax(70px, 100px)">
                {/* <StyledHeadCell>
                  <Checkbox
                    type="checkbox"
                    value="checkAll"
                    checked={checked}
                    onChange={onAllCheck}
                    overrides={{
                      Checkmark: {
                        style: {
                          borderTopWidth: "2px",
                          borderRightWidth: "2px",
                          borderBottomWidth: "2px",
                          borderLeftWidth: "2px",
                          borderTopLeftRadius: "4px",
                          borderTopRightRadius: "4px",
                          borderBottomRightRadius: "4px",
                          borderBottomLeftRadius: "4px"
                        }
                      }
                    }}
                  />
                </StyledHeadCell> */}
                <StyledHeadCell>ID</StyledHeadCell>
                <StyledHeadCell>Customer Name</StyledHeadCell>
                <StyledHeadCell>Time</StyledHeadCell>
                <StyledHeadCell>Delivery Address</StyledHeadCell>
                <StyledHeadCell>Delivery Time</StyledHeadCell>
                <StyledHeadCell>Pincode</StyledHeadCell>
                <StyledHeadCell>Contact</StyledHeadCell>
                <StyledHeadCell>Amount</StyledHeadCell>
                <StyledHeadCell>PayM</StyledHeadCell>
                <StyledHeadCell>Status</StyledHeadCell>
                <StyledHeadCell>View</StyledHeadCell>
                {data ? (
                  data.orders.length ? (
                    data.orders.map((row, index) => (
                      <React.Fragment key={index}>
                        {/* <StyledCell>
                          <Checkbox
                            name={row["_id"]}
                            checked={checkedId.includes(row[1])}
                            onChange={handleCheckbox}
                            overrides={{
                              Checkmark: {
                                style: {
                                  borderTopWidth: "2px",
                                  borderRightWidth: "2px",
                                  borderBottomWidth: "2px",
                                  borderLeftWidth: "2px",
                                  borderTopLeftRadius: "4px",
                                  borderTopRightRadius: "4px",
                                  borderBottomRightRadius: "4px",
                                  borderBottomLeftRadius: "4px"
                                }
                              }
                            }}
                          />
                        </StyledCell> */}
                        <StyledCell>{row["_id"].slice(0, 6)}</StyledCell>
                        <StyledCell>{row.customer.name}</StyledCell>
                        <StyledCell>
                          {dayjs(row["creation_date"]).format("DD MMM YYYY")}
                        </StyledCell>
                        <StyledCell>{row["address"]}</StyledCell>
                        <StyledCell>{row["deliveryTime"]}</StyledCell>
                        <StyledCell>{row["pincode"]}</StyledCell>
                        <StyledCell>{row["contact_number"]}</StyledCell>
                        <StyledCell>₹{row["amount"]}</StyledCell>
                        <StyledCell>{row["payment_method"]}</StyledCell>
                        <StyledCell style={{ justifyContent: "center" }}>
                          <Status
                            className={
                              row["status"].toLowerCase() === "delivered"
                                ? sent
                                : row["status"].toLowerCase() === "pending"
                                ? paid
                                : row["status"].toLowerCase() === "processing"
                                ? processing
                                : row["status"].toLowerCase() === "failed"
                                ? failed
                                : ""
                            }
                          >
                            {row["status"]}
                          </Status>
                        </StyledCell>
                        <StyledCell>
                          <Button
                            kind={KIND.minimal}
                            size={SIZE.compact}
                            shape={SHAPE.round}
                            onClick={() => {
                              openDrawer(row);
                            }}
                          >
                            <FaEye />
                          </Button>
                        </StyledCell>
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
