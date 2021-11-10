import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
// import { v4 as uuidv4 } from 'uuid';
import { useMutation, useQuery, gql } from "@apollo/client";
import { Scrollbars } from "react-custom-scrollbars";
import { useDrawerDispatch } from "context/DrawerContext";
import Input from "components/Input/Input";
import Checkbox from "components/CheckBox/CheckBox";
// import PhoneInput from 'components/PhoneInput/PhoneInput';
import Button, { KIND } from "components/Button/Button";
import Uploader from "components/Uploader/Uploader";
import DrawerBox from "components/DrawerBox/DrawerBox";
import { Row, Col } from "components/FlexBox/FlexBox";
import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup
} from "../DrawerItems/DrawerItems.style";
import { FormFields, FormLabel } from "components/FormFields/FormFields";
import { Textarea } from "components/Textarea/Textarea";
import Select from "components/Select/Select";
import PhoneInput from "components/PhoneInput/PhoneInput";
import UploadFiles from "utilities/uploadFile";

const GET_CATEGORIES = gql`
  query getCategories($type: String) {
    categories(type: $type, organisationID: "61740991d5532f3a7d63d9e9", isAdmin:true) {
      _id
      icon
      name
      slug
      type
    }
  }
`;

const GET_VENDOR = gql`
  query getVendor($role: String, $searchBy: String) {
    vendors(role: $role, searchBy: $searchBy, isAdmin:true) {
      items {
        _id
        name
        email
        contact_number
        creation_date
        role
        pincode
      }
      totalCount
      hasMore
    }
  }
`;

const ADD_VENDOR = gql`
  mutation addVendor($vendor: AddVendorInput!) {
    addVendor(vendorInput: $vendor) {
      name
      slug
      previewUrl
      thumbnailUrl
      description
      promotion
      address
      createdAt
    }
  }
`;

type Props = any;

const VendorsForm: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(
    () => dispatch({ type: "CLOSE_DRAWER" }),
    [dispatch]
  );
  const { register, handleSubmit, setValue } = useForm();
  const [checked, setChecked] = React.useState(true);
  const [description, setDescription] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [tag, setTag] = React.useState([]);
  const [country, setCountry] = React.useState({
    label: "India (भारत)",
    id: "IN",
    dialCode: "+91"
  });
  const [text, setText] = React.useState("");
  const [thumbnail, setThumbnail] = React.useState();
  const [previewImage, setPreviewImage] = React.useState();

  const [categoryList, setCategoryList] = React.useState();
  const { data: categoryData, error: categoriesError } =
    useQuery(GET_CATEGORIES);

  React.useEffect(() => {
    if (categoryData) {
      let temp = categoryData.categories.map((category) => ({
        value: category._id,
        name: category.name,
        id: category._id
      }));
      setCategoryList(temp);
    }
  }, [categoryData]);

  // React.useEffect(() => {
  //   register({ name: 'name', required: true });
  //   register({ name: 'slug', required: true });
  //   register({ name: 'previewUrl' });
  //   register({ name: 'thumbnail' });
  //   register({ name: 'categories' });
  //   register({ name: 'description' });
  //   register({ name: 'promotion', required: true });
  //   register({ name: 'address' });
  // }, [register]);

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setValue("description", value);
    setDescription(value);
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setValue("address", value);
    setAddress(value);
  };

  const handleMultiChange = ({ value }) => {
    let temp = value.map((category) => category.id);
    setValue("categories", temp);
    setTag(value);
    console.log(value, temp);
  };

  const [addVendor] = useMutation(ADD_VENDOR);

  const onSubmit = async (data) => {
    let previewUrl = previewImage ? await UploadFiles([previewImage]) : null;
    let thumbnailUrl = thumbnail ? await UploadFiles([thumbnail]) : null;

    console.log(data);

    const newVendor = {
      name: data.name,
      slug: data.slug,
      contact_number: text,
      email: data.email,
      previewUrl: previewUrl ? previewUrl[0] : null,
      thumbnailUrl: thumbnailUrl ? thumbnailUrl[0] : null,
      categoryIDs: data.categories,
      description: description,
      promotion: data.promotion,
      pincode: data.pincode,
      address: address,
      createdAt: new Date(),
      updatedAt: new Date(),
      organisationID: "61740991d5532f3a7d63d9e9",
      published: false
    };
    console.log(newVendor);
    addVendor({
      variables: { vendor: newVendor }
    });
    closeDrawer();
  };

  const handleThumbnailUpload = (files) => {
    if (files.length) {
      setThumbnail(files[0]);
    }
  };

  const handlePreviewUpload = (files) => {
    if (files.length) {
      setPreviewImage(files[0]);
    }
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Add Vendors</DrawerTitle>
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
                Add vendors name, description and necessary information from
                here
              </FieldDetails>
            </Col>

            <Col lg={8}>
              <DrawerBox>
                <FormFields>
                  <FormLabel>Name</FormLabel>
                  <Input
                    inputRef={register({ required: true, maxLength: 20 })}
                    name="name"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Slug</FormLabel>
                  <Input
                    inputRef={register({ required: true, maxLength: 20 })}
                    name="slug"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Contact No.</FormLabel>
                  <PhoneInput
                    country={country}
                    onCountryChange={({ option }) => setCountry(option)}
                    text={text}
                    onTextChange={(e) => setText(e.currentTarget.value)}
                    inputRef={register({ required: true })}
                    name="contact_number"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Pincode</FormLabel>
                  <Input
                    inputRef={register({ required: true, maxLength: 6 })}
                    name="pincode"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    inputRef={register({ required: true })}
                    name="email"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Preview Image</FormLabel>
                  <Uploader onChange={handlePreviewUpload} />
                </FormFields>
                <FormFields>
                  <FormLabel>Thumbnail</FormLabel>
                  <Uploader onChange={handleThumbnailUpload} />
                </FormFields>

                <FormFields>
                  <FormLabel>Categories</FormLabel>
                  <Select
                    options={categoryList}
                    labelKey="name"
                    valueKey="value"
                    placeholder="Categories"
                    value={tag}
                    onChange={handleMultiChange}
                    overrides={{
                      Placeholder: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal
                          };
                        }
                      },
                      DropdownListItem: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal
                          };
                        }
                      },
                      Popover: {
                        props: {
                          overrides: {
                            Body: {
                              style: { zIndex: 5 }
                            }
                          }
                        }
                      }
                    }}
                    multi
                  />
                </FormFields>
                <FormFields>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    inputRef={register({ required: true })}
                    name="description"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Promotion</FormLabel>
                  <Input
                    inputRef={register({ required: false })}
                    name="promotion"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Address</FormLabel>
                  <Textarea
                    value={address}
                    onChange={handleAddressChange}
                    inputRef={register({ required: true })}
                    name="address"
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
                  color: $theme.colors.red400
                })
              }
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
                  borderBottomLeftRadius: "3px"
                })
              }
            }}
          >
            Add Vendor
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default VendorsForm;
