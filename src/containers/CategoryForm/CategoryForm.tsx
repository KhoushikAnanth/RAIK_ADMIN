import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQuery, gql } from "@apollo/client";
import { useDrawerDispatch } from "context/DrawerContext";
import { Scrollbars } from "react-custom-scrollbars";
import Uploader from "components/Uploader/Uploader";
import Input from "components/Input/Input";
import Select from "components/Select/Select";
import Button, { KIND } from "components/Button/Button";
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
import UploadFiles from "utilities/uploadFile";

const GET_CATEGORIES = gql`
  query getCategories($type: String) {
    categories(type: $type, organisationID: "61c59c3620fc430008c3174b", isAdmin:true) {
      _id
      icon
      name
      slug
      type
    }
  }
`;

const CREATE_CATEGORY = gql`
  mutation createCategory($category: AddCategoryInput!) {
    createCategory(categoryInput: $category) {
      _id
      name
      type
      icon
      # creation_date
      slug
      # number_of_product
    }
  }
`;

type Props = any;

const AddCategory: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(
    () => dispatch({ type: "CLOSE_DRAWER" }),
    [dispatch]
  );
  const { register, handleSubmit, setValue } = useForm();
  const [category, setCategory] = useState([]);
  const [file, setFile] = useState();

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

  const [createCategory] = useMutation(CREATE_CATEGORY);

  const onSubmit = async (data) => {
    let fileURL = file ? await UploadFiles([file]) : null;

    const newCategory = {
      name: data.name,
      slug: data.slug,
      icon: fileURL ? fileURL[0] : null,
      creation_date: new Date(),
      organisationID: "61c59c3620fc430008c3174b"
    };
    createCategory({
      variables: { category: newCategory }
    });
    closeDrawer();
    console.log(newCategory, "newCategory");
  };
  const handleChange = ({ value }) => {
    setValue("parent", value);
    setCategory(value);
  };
  const handleUploader = (files) => {
    if (files.length) {
      setFile(files[0]);
    }
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Add Category</DrawerTitle>
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
              <FieldDetails>Upload your Category image here</FieldDetails>
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
                Add your category description and necessary informations from
                here
              </FieldDetails>
            </Col>

            <Col lg={8}>
              <DrawerBox>
                <FormFields>
                  <FormLabel>Category Name</FormLabel>
                  <Input
                    inputRef={register({ required: true, maxLength: 20 })}
                    name="name"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Slug</FormLabel>
                  <Input
                    inputRef={register({
                      required: true,
                      pattern: /^[A-Za-z_-]+$/i
                    })}
                    name="slug"
                  />
                </FormFields>

                {/* <FormFields>
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    options={categoryList}
                    labelKey="name"
                    valueKey="value"
                    placeholder="Choose parent category (Optional)"
                    value={category}
                    searchable={false}
                    onChange={handleChange}
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
            Create Category
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default AddCategory;
