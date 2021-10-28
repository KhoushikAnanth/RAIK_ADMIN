import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import {
  SidebarWrapper,
  NavLink,
  MenuWrapper,
  Svg,
  LogoutBtn
} from "./Sidebar.style";
import {
  DASHBOARD,
  PRODUCTS,
  CATEGORY,
  ORDERS,
  CUSTOMERS,
  COUPONS,
  STAFF_MEMBERS,
  SETTINGS,
  VENDORS
} from "settings/constants";
import { AuthContext } from "context/auth";

import { DashboardIcon } from "assets/icons/DashboardIcon";
import { ProductIcon } from "assets/icons/ProductIcon";
import { SidebarCategoryIcon } from "assets/icons/SidebarCategoryIcon";
import { OrderIcon } from "assets/icons/OrderIcon";
import { CustomerIcon } from "assets/icons/CustomerIcon";
import { CouponIcon } from "assets/icons/CouponIcon";
// import staff member icon
import { SettingIcon } from "assets/icons/SettingIcon";
import { LogoutIcon } from "assets/icons/LogoutIcon";

const sidebarMenus = [
  {
    name: "Dashboard",
    path: DASHBOARD,
    exact: true,
    icon: <DashboardIcon />,
    disabled: false
  },
  {
    name: "Products",
    path: PRODUCTS,
    exact: false,
    icon: <ProductIcon />,
    disabled: false
  },
  {
    name: "Category",
    path: CATEGORY,
    exact: false,
    icon: <SidebarCategoryIcon />,
    disabled: false
  },
  {
    name: "Orders",
    path: ORDERS,
    exact: false,
    icon: <OrderIcon />,
    disabled: false
  },
  {
    name: "Customers",
    path: CUSTOMERS,
    exact: false,
    icon: <CustomerIcon />,
    disabled: false
  },
  {
    name: "Coupons",
    path: COUPONS,
    exact: false,
    icon: <CouponIcon />,
    disabled: true
  },
  {
    name: "Staff Member",
    path: STAFF_MEMBERS,
    exact: false,
    icon: <CustomerIcon />,
    disabled: false
  },
  {
    name: "Menu",
    path: VENDORS,
    exact: false,
    icon: <CustomerIcon />,
    disabled: false
  },
  {
    name: "Settings",
    path: SETTINGS,
    exact: false,
    icon: <SettingIcon />,
    disabled: false
  }
];

export default withRouter(function Sidebar({
  refs,
  style,
  onMenuItemClick
}: any) {
  const { signout } = useContext(AuthContext);
  return (
    <SidebarWrapper ref={refs} style={style}>
      <MenuWrapper>
        {sidebarMenus.map((menu: any, index: number) => (
          <NavLink
            to={menu.disabled ? window.location.pathname : menu.path}
            key={index}
            exact={menu.exact}
            activeStyle={
              menu.disabled
                ? {
                    color: "lightgray",
                    borderRadius: "50px 0 0 50px"
                  }
                : {
                    color: "#00C58D",
                    backgroundColor: "#f7f7f7",
                    borderRadius: "50px 0 0 50px"
                  }
            }
            onClick={onMenuItemClick}
          >
            {menu.icon ? <Svg>{menu.icon}</Svg> : ""}
            {menu.name}
          </NavLink>
        ))}
      </MenuWrapper>

      <LogoutBtn
        onClick={() => {
          signout();
        }}
      >
        <Svg>
          <LogoutIcon />
        </Svg>
        Logout
      </LogoutBtn>
    </SidebarWrapper>
  );
});
