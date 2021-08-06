import React from "react";
import {
  PhoneInput as BasePhoneInput,
  COUNTRIES,
  SIZE,
  CountrySelectDropdown,
  StyledFlag
} from "baseui/phone-input";

function CustomFlag(props) {
  const { children, ...rest } = props;
  return <StyledFlag iso={props.$iso} {...rest} />;
}

const PhoneInput = ({ ...props }) => {
  return (
    <BasePhoneInput
      text={props.text}
      country={props.country}
      onCountryChange={(event) => {
        props.onCountryChange(event);
      }}
      onTextChange={props.onTextChange}
      overrides={{
        FlagContainer: {
          component: CustomFlag
        },
        CountrySelect: {
          props: {
            overrides: {
              Dropdown: {
                component: CountrySelectDropdown
              }
            }
          }
        }
      }}
    />
  );
};

export { COUNTRIES, SIZE };
export default PhoneInput;
