import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useMutation, gql } from "@apollo/client";
import { Scrollbars } from "react-custom-scrollbars";
import { useDrawerDispatch } from "context/DrawerContext";
import Input from "components/Input/Input";
import Checkbox from "components/CheckBox/CheckBox";
import PhoneInput from "components/PhoneInput/PhoneInput";
import Button, { KIND } from "components/Button/Button";

import DrawerBox from "components/DrawerBox/DrawerBox";
import { Row, Col } from "components/FlexBox/FlexBox";
import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from "../DrawerItems/DrawerItems.style";
import { FormFields, FormLabel } from "components/FormFields/FormFields";

const CREATE_SLOT = gql`
  mutation createSlot($slotInput: AddSlotInput!) {
    createSlot(
      slotInput: $slotInput
      organisationID: "61c59c3620fc430008c3174b"
    ) {
      title
      type
      time_slot
    }
  }
`;

type Props = any;

const StaffMemberForm: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), [
    dispatch,
  ]);
  const { register, handleSubmit } = useForm();
  const [createStaff] = useMutation(CREATE_SLOT);
  const onSubmit = (data) => {
    const newSlot = {
      title: data.title,
      type: data.type,
      time_slot: data.time_slot,
      published: false
    };
    console.log(data);
    createStaff({ variables: { slotInput: newSlot } });
    closeDrawer();
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Add Slot</DrawerTitle>
      </DrawerTitleWrapper>

      <Form onSubmit={handleSubmit(onSubmit)} style={{ height: "100%" }}>
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
            <Col lg={4}>
              <FieldDetails>
                Add time slot, description and necessary information from here
              </FieldDetails>
            </Col>

            <Col lg={8}>
              <DrawerBox>
                <FormFields>
                  <FormLabel>Title</FormLabel>
                  <Input
                    inputRef={register({ required: true, maxLength: 20 })}
                    name="title"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Time Slot</FormLabel>
                  <Input
                    inputRef={register({ required: true, maxLength: 20 })}
                    name="time_slot"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Type</FormLabel>
                  <Input
                    inputRef={register({ required: true, maxLength: 20 })}
                    name="type"
                  />
                </FormFields>
              </DrawerBox>
            </Col>
          </Row>
        </Scrollbars>

        <ButtonGroup>
          <Button
            kind={KIND.minimal}
            onClick={closeDrawer}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: "50%",
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                  borderBottomRightRadius: "3px",
                  borderBottomLeftRadius: "3px",
                  marginRight: "15px",
                  color: $theme.colors.red400,
                }),
              },
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: "50%",
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                  borderBottomRightRadius: "3px",
                  borderBottomLeftRadius: "3px",
                }),
              },
            }}
          >
            Add Slot
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default StaffMemberForm;
