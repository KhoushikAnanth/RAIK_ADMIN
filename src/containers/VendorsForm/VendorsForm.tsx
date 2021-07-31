import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
// import { v4 as uuidv4 } from 'uuid';
import { useMutation, gql } from '@apollo/client';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDrawerDispatch } from 'context/DrawerContext';
import Input from 'components/Input/Input';
import Checkbox from 'components/CheckBox/CheckBox';
// import PhoneInput from 'components/PhoneInput/PhoneInput';
import Button, { KIND } from 'components/Button/Button';
import Uploader from 'components/Uploader/Uploader';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Row, Col } from 'components/FlexBox/FlexBox';
import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';
import { Textarea } from 'components/Textarea/Textarea';
import Select from 'components/Select/Select';

const GET_VENDOR = gql`
  query getVendor($role: String, $searchBy: String) {
    vendors(role: $role, searchBy: $searchBy) {
      items{
        _id
        name
        email
        contact_number
        creation_date
        role
      }
      totalCount
      hasMore
    }
  }
`;

const ADD_VENDOR = gql`
  mutation addVendor($vendor: AddVendorInput!) {
    addVendor(vendor: $vendor) {
      name
      slug
      previewUrl
      thaimbnailUrl
      type
      categories
      description
      promotion
      address
      createdAt
      updatedAt
      organisationId
    }
  }
`;

type Props = any;

const VendorsForm: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);
  const { register, handleSubmit, setValue } = useForm();
  // const [country, setCountry] = React.useState(undefined);
  const [checked, setChecked] = React.useState(true);
  const [description, setDescription] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [tag, setTag] = React.useState([]);
  // const [text, setText] = React.useState('');

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
    setValue('description', value);
    setDescription(value);
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setValue('address', value);
    setAddress(value);
  };

  const handleMultiChange = ({ value }) => {
    setValue('categories', value);
    setTag(value);
  };

  const [addVendor] = useMutation(ADD_VENDOR, {
    update(cache, { data: { addVendor } }) {
      const { vendors } = cache.readQuery({
        query: GET_VENDOR,
      });
      cache.writeQuery({
        query: GET_VENDOR,
        data: { vendors: vendors.concat([addVendor]) },
      });
    },
  });

  const onSubmit = ({ name, slug, previewUrl, thumbnailUrl, type, categories, description, promotion, address, organisation }) => {
    const newVendor = {
      name: name,
      slug: slug,
      previewUrl:previewUrl,
      thumbnailUrl:thumbnailUrl,
      type:type,
      categories:categories,
      description:description,
      promotion:promotion,
      address:address,
      createdAt : new Date(),
      updatedAt: new Date(),
      organisation:organisation
      // type: parent[0].value,
    };
    addVendor({
      variables: { vendor: newVendor },
    });
    closeDrawer();
    console.log(newVendor, 'newVendor');
  };

  const options = [
    { value: 'Fruits & Vegetables', name: 'Fruits & Vegetables', id: '1' },
    { value: 'Meat & Fish', name: 'Meat & Fish', id: '2' },
    { value: 'Purse', name: 'Purse', id: '3' },
    { value: 'Hand bags', name: 'Hand bags', id: '4' },
    { value: 'Shoulder bags', name: 'Shoulder bags', id: '5' },
    { value: 'Wallet', name: 'Wallet', id: '6' },
    { value: 'Laptop bags', name: 'Laptop bags', id: '7' },
    { value: 'Women Dress', name: 'Women Dress', id: '8' },
    { value: 'Outer Wear', name: 'Outer Wear', id: '9' },
    { value: 'Pants', name: 'Pants', id: '10' },
  ];

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Add Vendors</DrawerTitle>
      </DrawerTitleWrapper>

      <Form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
        <Scrollbars
          autoHide
          renderView={(props) => (
            <div {...props} style={{ ...props.style, overflowX: 'hidden' }} />
          )}
          renderTrackHorizontal={(props) => (
            <div
              {...props}
              style={{ display: 'none' }}
              className="track-horizontal"
            />
          )}
        >
          <Row>
            <Col lg={4}>
              <FieldDetails>
                Add vendors name, description and necessary information from here
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
                  <FormLabel>Preview Url</FormLabel>
                  <Uploader
                    type="file"
                    // inputRef={register({ required: true })}
                    name="previewUrl"
                  />
                </FormFields>
                <FormFields>
                  <FormLabel>Thumbnail</FormLabel>
                  <Uploader
                    // type="file"
                    // inputRef={register({ required: true })}
                    name="thubnailUrl"
                  />
                </FormFields>
                
                <FormFields>
                  <FormLabel>Categories</FormLabel>
                  <Select
                    options={options}
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
                    inputRef={register({ required: true })}
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

          <Row>
            <Col lg={4}>
              <FieldDetails>
                Expand or restrict user’s permissions to access certain part of
                pickbazar system.
              </FieldDetails>
            </Col>

            <Col lg={8}>
              <DrawerBox>
                <FormFields>
                  <Checkbox
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    inputRef={register}
                    name="agreement_check"
                    overrides={{
                      Label: {
                        style: ({ $theme }) => ({
                          color: $theme.colors.textNormal,
                        }),
                      },
                    }}
                  >
                    Access for created account
                  </Checkbox>
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
                  width: '50%',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px',
                  borderBottomRightRadius: '3px',
                  borderBottomLeftRadius: '3px',
                  marginRight: '15px',
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
                  width: '50%',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px',
                  borderBottomRightRadius: '3px',
                  borderBottomLeftRadius: '3px',
                }),
              },
            }}
          >
            Add Vender
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default VendorsForm;

