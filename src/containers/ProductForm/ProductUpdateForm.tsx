import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Scrollbars } from "react-custom-scrollbars";
import { useDrawerDispatch, useDrawerState } from "context/DrawerContext";
import Uploader from "components/Uploader/Uploader";
import Button, { KIND } from "components/Button/Button";
import DrawerBox from "components/DrawerBox/DrawerBox";
import { Row, Col } from "components/FlexBox/FlexBox";
import Input from "components/Input/Input";
import { Textarea } from "components/Textarea/Textarea";
import Select from "components/Select/Select";
import { FormFields, FormLabel } from "components/FormFields/FormFields";
import { Plus } from "assets/icons/PlusMinus";

import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from "../DrawerItems/DrawerItems.style";
import UploadFiles from "utilities/uploadFile";
import { gql, useMutation, useQuery } from "@apollo/client";

type Props = any;

const UPDATE_PRODUCT = gql`
  mutation updateProduct($product: AddProductInput!) {
    updateProduct(productInput: $product) {
      _id
      name
      image
      slug
      type
      price
      description
      salePrice
      discountInPercent
      quantity
      creation_date
    }
  }
`;

const GET_VENDORS = gql`
  query getVendors($type: String, $offset: Int) {
    vendors(
      type: $type
      offset: $offset
      organisationID: "61740991d5532f3a7d63d9e9"
      isAdmin: true
    ) {
      items {
        _id
        name
      }
    }
  }
`;
const UPADATE_VISIBILITY = gql`
  mutation vendorVisibility($vendorID: String!, $published: Boolean!) {
    vendorVisibility(vendorID: $vendorID, published: $published) {
      _id
    }
  }
`;

const AddProduct: React.FC<Props> = () => {
  const dispatch = useDrawerDispatch();
  const defaultData = useDrawerState("data");
  const closeDrawer = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), [
    dispatch,
  ]);
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: defaultData,
  });
  // const [type, setType] = useState([{ value: defaultData.type }]);
  const [tag, setTag] = useState([]);
  const [description, setDescription] = useState(defaultData.description);
  const [selectedFiles, setFiles] = useState(null);

  console.log(defaultData);

  React.useEffect(() => {
    register({ name: "type" });
    register({ name: "categories" });
    register({ name: "image" });
    register({ name: "description" });
    register({ name: "vendor" });
  }, [register]);

  const [vendorTag, setVendorTag] = useState([]);

  const [vendorList, setVendorList] = useState();
  const { data: vendorData, error: vendorsError } = useQuery(GET_VENDORS);
  const [updateVisibility] = useMutation(UPADATE_VISIBILITY);

  React.useEffect(() => {
    if (vendorData) {
      let temp = vendorData.vendors.items.map((vendor) => ({
        value: vendor._id,
        name: vendor.name,
        id: vendor._id,
      }));
      setVendorList(temp);
    }
  }, [vendorData]);

  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  const handleMultiChange = ({ value }) => {
    setValue("categories", value);
    setTag(value);
  };
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setValue("description", value);
    setDescription(value);
  };

  // const handleTypeChange = ({ value }) => {
  //   setValue("type", value);
  //   setType(value);
  // };
  const handleUploader = (files) => {
    if (files.length) {
      setFiles(files[0]);
    }
  };
  const handleVendorChange = ({ value }) => {
    setValue("vendor", value);
    setVendorTag(value);
  };
  const onSubmit = async (data) => {
    let fileURL = data.image;
    if (selectedFiles) {
      fileURL = await UploadFiles([selectedFiles]);
      fileURL = fileURL[0];
    }

    console.log(data, "after changing the values");

    const updatedProduct = {
      productID: defaultData._id,
      name: data.name,
      slug: defaultData.slug,
      description: data.description,
      type: defaultData.type,
      defaultImageURL: fileURL,
      price: Number(data.price),
      salePrice: Number(data.salePrice),
      discountInPercent: Number(data.discountInPercent),
      quantity: Number(data.quantity),
      weightInGrams: Number(data.weightInGrams),
      vendorID: data.vendor[0].id,
      organisationID: "61740991d5532f3a7d63d9e9",
      // published: !data.published,
    };

    console.log(updatedProduct);
    updateProduct({ variables: { product: updatedProduct } });

    closeDrawer();
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Update Product</DrawerTitle>
      </DrawerTitleWrapper>

      <Form
        onSubmit={handleSubmit(onSubmit)}
        style={{ height: "100%" }}
        noValidate
      >
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
              <FieldDetails>Upload your Product image here</FieldDetails>
            </Col>
            <Col lg={8}>
              <DrawerBox>
                <Uploader
                  onChange={handleUploader}
                  imageURL={defaultData.image}
                />
              </DrawerBox>
            </Col>
          </Row>

          <Row>
            <Col lg={4}>
              <FieldDetails>
                Add your Product description and necessary information from here
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
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </FormFields>

                {/* <FormFields>
                  <FormLabel>Unit</FormLabel>
                  <Input type="text" inputRef={register} name="unit" />
                </FormFields> */}

                <FormFields>
                  <FormLabel>Price</FormLabel>
                  <Input
                    type="number"
                    inputRef={register({ required: true })}
                    name="price"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Sale Price</FormLabel>
                  <Input type="number" inputRef={register} name="salePrice" />
                </FormFields>

                <FormFields>
                  <FormLabel>Discount In Percent</FormLabel>
                  <Input
                    type="number"
                    inputRef={register}
                    name="discountInPercent"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Product Quantity</FormLabel>
                  <Input type="number" inputRef={register} name="quantity" />
                </FormFields>

                <FormFields>
                  <FormLabel>Weight (In grams)</FormLabel>
                  <Input
                    type="number"
                    inputRef={register({ required: true })}
                    name="weightInGrams"
                  />
                </FormFields>

                {/* <FormFields>
                  <FormLabel>Type</FormLabel>
                  <Select
                    options={typeOptions}
                    labelKey="name"
                    valueKey="value"
                    placeholder="Product Type"
                    value={type}
                    searchable={false}
                    onChange={handleTypeChange}
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
                      OptionContent: {
                        style: ({ $theme, $selected }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $selected
                              ? $theme.colors.textDark
                              : $theme.colors.textNormal
                          };
                        }
                      },
                      SingleValue: {
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
                  />
                </FormFields> */}

                {/* <FormFields>
                  <FormLabel>Categories</FormLabel>
                  <Select
                    options={categoryList}
                    labelKey="name"
                    valueKey="value"
                    placeholder="Product Tag"
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
                </FormFields> */}
                <FormFields>
                  <FormLabel>Menu</FormLabel>
                  <Select
                    options={vendorList ? vendorList : {}}
                    labelKey="name"
                    valueKey="value"
                    placeholder="Menu Tag"
                    value={vendorTag}
                    onChange={handleVendorChange}
                    overrides={{
                      Placeholder: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      DropdownListItem: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      Popover: {
                        props: {
                          overrides: {
                            Body: {
                              style: { zIndex: 5 },
                            },
                          },
                        },
                      },
                    }}
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
                  width: "40%",
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
                  width: "40%",
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                  borderBottomRightRadius: "3px",
                  borderBottomLeftRadius: "3px",
                  marginRight: "15px",
                }),
              },
            }}
          >
            Update Product
          </Button>
          <Button
            onClick={() => handleSubmit(onSubmit)}
            overrides={{
              BaseButton: {
                style: () => ({
                  width: "20%",
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                  borderBottomLeftRadius: "3px",
                  borderBottomRightRadius: "3px",
                  marginRight: "15px",
                }),
              },
            }}
          >
            {onSubmit ? "Delete" : "Publish"}
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default AddProduct;
