import React, { useCallback } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import { Scrollbars } from "react-custom-scrollbars";
import { useDrawerDispatch } from "context/DrawerContext";
import Input from "components/Input/Input";
import Button, { KIND } from "components/Button/Button";

import DrawerBox from "components/DrawerBox/DrawerBox";
import { Row, Col } from "components/FlexBox/FlexBox";
import {
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from "../DrawerItems/DrawerItems.style";
import { groupBy } from "../../utilities/group-by";

const GET_ORDER_DETAILS = gql`
  query($orderID: String!) {
    getOrderDetails(orderID: $orderID) {
      _id
      product {
        _id
        name
        price
      }
      vendor {
        _id
        name
      }
      status
      quantity
    }
  }
`;

type Props = any;

const OrderDetails: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), [
    dispatch,
  ]);

  const { data: orderDetails, error, loading } = useQuery(GET_ORDER_DETAILS, {
    variables: { orderID: props.data._id },
  });

  console.log(orderDetails);

  // let ordersGrouped;

  // if (orderDetails && orderDetails.getOrderDetails) {
  //   ordersGrouped = groupBy(orderDetails.getOrderDetails);
  // }

  // console.log(ordersGrouped, "group product");

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Order</DrawerTitle>
      </DrawerTitleWrapper>

      <Scrollbars
        autoHide
        renderView={(props) => (
          <div {...props} style={{ ...props.style, overflowX: "hidden" }} />
        )}
        renderTrackHorizontal={(props) => (
          <div
            {...props}
            style={{ display: "none" }}
            className="track-horizontal"
          />
        )}
      >
        <Row>
          <Col lg={12}>
            <DrawerBox>
              <Row>
                <Col lg={3}>Product Name</Col>
                <Col lg={3}>Quantity</Col>
                <Col lg={3}>Status</Col>
                <Col lg={3}>Status</Col>

              </Row>
              {orderDetails &&
                orderDetails.getOrderDetails.length &&
                orderDetails.getOrderDetails.map((orderedProduct, index) => (
                  <Row>
                    <Col lg={3}>{orderedProduct.product.name}</Col>
                    <Col lg={3}>{orderedProduct.quantity}</Col>
                    <Col lg={3}>{orderedProduct.status}</Col>
                    <Col lg={3}>{orderedProduct.vendor.name}</Col>
                  </Row>
                ))}
            </DrawerBox>
          </Col>
        </Row>
      </Scrollbars>
    </>
  );
};

export default OrderDetails;
