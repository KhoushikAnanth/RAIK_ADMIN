import React from "react";
import { withStyle, useStyletron } from "baseui";
import { Grid, Row, Col as Column } from "components/FlexBox/FlexBox";
import RadialBarChart from "components/Widgets/RadialBarChart/RadialBarChart";
import LineChart from "components/Widgets/LineChart/LineChart";
import ColumnChart from "components/Widgets/ColumnChart/ColumnChart";
import DonutChart from "components/Widgets/DonutChart/DonutChart";
import GraphChart from "components/Widgets/GraphChart/GraphChart";
import GradiantGraphChart from "components/Widgets/GradiantGraphChart/GradiantGraphChart";
import MapWidget from "components/Widgets/MapWidget/MapWidget";
import StickerCard from "components/Widgets/StickerCard/StickerCard";

import { Revenue } from "assets/icons/Revenue";
import { Refund } from "assets/icons/Refund";
import { CoinIcon } from "assets/icons/CoinIcon";
import { CartIconBig } from "assets/icons/CartIconBig";
import { UserIcon } from "assets/icons/UserIcon";
import { DeliveryIcon } from "assets/icons/DeliveryIcon";

const Col = withStyle(Column, () => ({
  "@media only screen and (max-width: 574px)": {
    marginBottom: "30px",

    ":last-child": {
      marginBottom: 0
    }
  }
}));

const Dashboard = () => {
  const [css] = useStyletron();
  const mb30 = css({
    "@media only screen and (max-width: 990px)": {
      marginBottom: "16px"
    }
  });
  return (
    <Grid fluid={true}>
      <Row>
        <Col md={5} lg={4} sm={6}>
          <RadialBarChart
            widgetTitle="Target"
            series={[0, 0]}
            label={["0", "0"]}
            colors={["#03D3B5", "#666d92"]}
            helperText={["Weekly Targets", "Monthly Targets"]}
          />
        </Col>
        <Col md={7} lg={8} sm={6}>
          <LineChart
            widgetTitle="Subscribed User"
            color={["#03D3B5"]}
            categories={[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
            ]}
            seriesName="Unique visitors"
            series={[0]}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={3} sm={6} xs={12} className={mb30}>
          <StickerCard
            title="Total Revenue"
            subtitle="(Last 30 Days)"
            icon={<CoinIcon />}
            price="0"
            indicator="up"
            indicatorText="Revenue up"
            note="(previous 30 days)"
            // link="#"
            // linkText="Full Details"
          />
        </Col>
        <Col lg={3} sm={6} xs={12} className={mb30}>
          <StickerCard
            title="Total Order"
            subtitle="(Last 30 Days)"
            icon={<CartIconBig />}
            price="0"
            indicator="up"
            indicatorText="Order up"
            note="(previous 30 days)"
            // link="#"
            // linkText="Full Details"
          />
        </Col>
        <Col lg={3} sm={6} xs={12}>
          <StickerCard
            title="New Customer"
            subtitle="(Last 30 Days)"
            icon={<UserIcon />}
            price="0"
            indicator="up"
            indicatorText="Customer up"
            note="(previous 30 days)"
            // link="#"
            // linkText="Full Details"
          />
        </Col>
        <Col lg={3} sm={6} xs={12}>
          <StickerCard
            title="Total Delivery"
            subtitle="(Last 30 Days)"
            icon={<DeliveryIcon />}
            price="0"
            indicator="up"
            indicatorText="Delivery up"
            note="(previous 30 days)"
            // link="#"
            // linkText="Full Details"
          />
        </Col>
      </Row>

      <Row>
        {/* <Col md={7} lg={8}>
          <GraphChart
            widgetTitle="Sales From Social Media"
            colors={["#03D3B5"]}
            series={[25, 30, 14, 30, 55, 60, 48]}
            labels={[
              "2019-05-12",
              "2019-05-13",
              "2019-05-14",
              "2019-05-15",
              "2019-05-16",
              "2019-05-17",
              "2019-05-18"
            ]}
          />
        </Col> */}

        <Col md={5} lg={4}>
          <DonutChart
            widgetTitle="Target"
            series={[0, 0]}
            labels={["Todays Revenue", "Todays Refund"]}
            colors={["#03D3B5", "#666d92"]}
            helperText={["Weekly Targets", "Monthly Targets"]}
            icon={[<Revenue />, <Refund />]}
            prefix="₹"
          />
        </Col>
        <Col md={7} lg={8}>
          <ColumnChart
            widgetTitle="Sale History"
            colors={["#03D3B5"]}
            prefix="₹"
            totalValue="0"
            position="up"
            percentage="0%"
            text="More than last year"
            series={[0]}
            categories={[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December"
            ]}
          />
        </Col>
      </Row>

      <Row></Row>
      <Row>
        <Col md={6} lg={5}>
          <GradiantGraphChart
            colors={["#03D3B5"]}
            series={[0]}
            labels={["2021-08-07"]}
            topRowTitle="Performance"
            bottomRowData={[
              {
                label: "Last Week Profit",
                valueText: "0%",
                value: 0,
                color: "#03D3B5"
              },
              {
                label: "This Week Losses",
                valueText: "0%",
                value: 0,
                color: "#FC747A"
              }
            ]}
          />
        </Col>

        {/* <Col md={7} lg={8}>
          <MapWidget
            data={[
              {
                name: "Williamburgs",
                value: 69922,
                color: "#2170FF"
              },
              {
                name: "Brooklyn",
                value: 41953,
                color: "#29CAE4"
              },
              {
                name: "New York",
                value: 23307,
                color: "#666D92"
              },
              {
                name: "Jersey City",
                value: 20200,
                color: "#03D3B5"
              }
            ]}
            totalText="Total Client"
          />
        </Col> */}
      </Row>
    </Grid>
  );
};

export default Dashboard;
