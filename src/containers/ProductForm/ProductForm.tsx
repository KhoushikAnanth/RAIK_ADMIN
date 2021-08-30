import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useMutation, gql, useQuery } from "@apollo/client";
import { Scrollbars } from "react-custom-scrollbars";
import { useDrawerDispatch } from "context/DrawerContext";
import Uploader from "components/Uploader/Uploader";
import Button, { KIND } from "components/Button/Button";
import DrawerBox from "components/DrawerBox/DrawerBox";
import { Row, Col } from "components/FlexBox/FlexBox";
import Input from "components/Input/Input";
import { Textarea } from "components/Textarea/Textarea";
import Select from "components/Select/Select";
import { FormFields, FormLabel } from "components/FormFields/FormFields";

import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup
} from "../DrawerItems/DrawerItems.style";
import UploadFiles from "utilities/uploadFile";

const options = [
  { value: "Fruits & Vegetables", name: "Fruits & Vegetables", id: "1" },
  { value: "Meat & Fish", name: "Meat & Fish", id: "2" },
  { value: "Purse", name: "Purse", id: "3" },
  { value: "Hand bags", name: "Hand bags", id: "4" },
  { value: "Shoulder bags", name: "Shoulder bags", id: "5" },
  { value: "Wallet", name: "Wallet", id: "6" },
  { value: "Laptop bags", name: "Laptop bags", id: "7" },
  { value: "Women Dress", name: "Women Dress", id: "8" },
  { value: "Outer Wear", name: "Outer Wear", id: "9" },
  { value: "Pants", name: "Pants", id: "10" }
];

const typeOptions = [
  { value: "grocery", name: "Grocery", id: "1" },
  { value: "women-cloths", name: "Women Cloths", id: "2" },
  { value: "bags", name: "Bags", id: "3" },
  { value: "makeup", name: "Makeup", id: "4" }
];
const GET_PRODUCTS = gql`
  query getProducts(
    $type: String
    $sortByPrice: String
    $searchText: String
    $offset: Int
  ) {
    products(
      type: $type
      sortByPrice: $sortByPrice
      searchText: $searchText
      offset: $offset
    ) {
      items {
        id
        name
        image
        type
        price
        unit
        quantity
        salePrice
        discountInPercent
      }
      totalCount
      hasMore
    }
  }
`;
const CREATE_PRODUCT = gql`
  mutation createProduct($product: AddProductInput!) {
    createProduct(productInput: $product) {
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

const GET_CATEGORIES = gql`
  query getCategories($type: String) {
    categories(type: $type, organisationID: "610db2e716c19a36ccdde6e8") {
      _id
      icon
      name
      slug
      type
    }
  }
`;

const GET_VENDORS = gql`
  query getVendors($type: String, $offset: Int) {
    vendors(
      type: $type
      offset: $offset
      organisationID: "610db2e716c19a36ccdde6e8"
    ) {
      items {
        _id
        name
      }
    }
  }
`;

type Props = any;

const AddProduct: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(
    () => dispatch({ type: "CLOSE_DRAWER" }),
    [dispatch]
  );
  const { register, handleSubmit, setValue } = useForm();
  const [type, setType] = useState([]);
  const [tag, setTag] = useState([]);
  const [vendorTag, setVendorTag] = useState([]);
  const [description, setDescription] = useState("");
  const [selectedFiles, setFiles] = useState();

  const [categoryList, setCategoryList] = useState();
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

  const [vendorList, setVendorList] = useState();
  const { data: vendorData, error: vendorsError } = useQuery(GET_VENDORS);

  React.useEffect(() => {
    if (vendorData) {
      let temp = vendorData.vendors.items.map((vendor) => ({
        value: vendor._id,
        name: vendor.name,
        id: vendor._id
      }));
      setVendorList(temp);
    }
  }, [vendorData]);

  React.useEffect(() => {
    register({ name: "categories" });
    register({ name: "vendor" });
    register({ name: "images", required: true });
    register({ name: "description" });
  }, [register]);

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setValue("description", value);
    setDescription(value);
  };

  const [createProduct] = useMutation(CREATE_PRODUCT);

  const handleCategoryChange = ({ value }) => {
    setValue("categories", value);
    setTag(value);
  };

  const handleVendorChange = ({ value }) => {
    setValue("vendor", value);
    setVendorTag(value);
  };

  const handleTypeChange = ({ value }) => {
    setValue("type", value);
    setType(value);
  };

  const handleUploader = (files) => {
    if (files.length) {
      setFiles(files);
    }
  };

  const onSubmit = async (data) => {
    let fileURLs = selectedFiles ? await UploadFiles(selectedFiles) : null;

    let categoryIDs = data.categories.map((category: any) => category.id);

    const newProduct = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      defaultImageURL: fileURLs ? fileURLs[0] : undefined,
      galleryURLs: fileURLs ? fileURLs : undefined,
      price: Number(data.price),
      // unit: data.unit,
      salePrice: Number(data.salePrice),
      discountInPercent: Number(data.discountInPercent),
      quantity: Number(data.quantity),
      categoryIDs: categoryIDs,
      weightInGrams: Number(data.weightInGrams),
      creation_date: new Date(),
      vendorID: data.vendor[0].id,
      organisationID: "610db2e716c19a36ccdde6e8"
    };
    console.log(newProduct, "newProduct data");
    createProduct({
      variables: { product: newProduct }
    });
    closeDrawer();
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Add Product</DrawerTitle>
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
              <FieldDetails>Upload your Product image here</FieldDetails>
            </Col>
            <Col lg={8}>
              <DrawerBox
                overrides={{
                  Block: {
                    style: {
                      width: "100%",
                      height: "auto",
                      padding: "30px",
                      borderRadius: "3px",
                      backgroundColor: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }
                  }
                }}
              >
                <Uploader onChange={handleUploader} />
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
                    inputRef={register({ required: true, maxLength: 25 })}
                    name="name"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Slug</FormLabel>
                  <Input
                    inputRef={register({ required: true, maxLength: 30 })}
                    name="slug"
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
                  <Input
                    type="number"
                    inputRef={register({ required: true })}
                    name="quantity"
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

                <FormFields>
                  <FormLabel>Weight (In grams)</FormLabel>
                  <Input
                    type="number"
                    inputRef={register({ required: true })}
                    name="weightInGrams"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Categories</FormLabel>
                  <Select
                    options={categoryList ? categoryList : {}}
                    labelKey="name"
                    valueKey="value"
                    placeholder="Product Tag"
                    value={tag}
                    onChange={handleCategoryChange}
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
                  <FormLabel>Vendor</FormLabel>
                  <Select
                    options={vendorList ? vendorList : {}}
                    labelKey="name"
                    valueKey="value"
                    placeholder="Vendor Tag"
                    value={vendorTag}
                    onChange={handleVendorChange}
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
            Create Product
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default AddProduct;
