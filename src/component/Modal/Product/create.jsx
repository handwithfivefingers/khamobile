import React, { useEffect, useState } from "react";

import MinusIcon from "@rsuite/icons/Minus";
import PlusIcon from "@rsuite/icons/Plus";
import CardBlock from "component/UI/Content/CardBlock";
import Select from "component/UI/Content/MutiSelect";
import CustomUpload from "component/UI/CustomUpload";
import Textarea from "component/UI/Editor";
import JsonViewer from "component/UI/JsonViewer";
import { useRouter } from "next/router";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Content,
  FlexboxGrid,
  Form,
  IconButton,
  Input,
  InputNumber,
  SelectPicker,
  useToaster,
  Message,
} from "rsuite";
import CategoryService from "service/admin/Category.service";
import { useCommonStore } from "src/store/commonStore";
import ProductService from "service/admin/Product.service";
import { TEXT, PRODUCT_TEXT } from "src/constant/text.constant";
import { forwardRef } from "react";
import { PRODUCT_TYPE } from "src/constant/select.constant";
import { formatCurrency } from "src/helper";
import { NumericFormat } from "react-number-format";
import { KMSelect } from "component/UI/Content/KMInput";
import { useCallback } from "react";

const CustomInput = (props) => {
  return <input name="title" class="rs-input" type="text" {...props} />;
};

const CustomInputPrice = ({ rowValue, onChange, name, ...props }) => {
  return (
    <NumericFormat
      name={name}
      customInput={CustomInput}
      thousandSeparator=","
      onValueChange={({ value }, sourceInfo) => onChange(value)}
      placeholder="Giá tiền"
      suffix=" VNĐ"
      value={rowValue[name]}
      {...props}
    />
  );
};
const CustomInputNumber = forwardRef((props, ref) => {
  return <InputNumber {...props} ref={ref} />;
});

const VariableItem = ({ rowValue = {}, onChange, rowIndex, variable }) => {
  const handleChange = (value, name) =>
    onChange(rowIndex, { ...rowValue, [name]: value });
  return (
    <>
      {Object.keys(variable).map((key, index) => {
        return (
          <FlexboxGrid.Item
            style={{ width: "calc(100% / 3 - 4px)" }}
            key={[key, index]}
          >
            <SelectPicker
              value={rowValue[key]}
              placeholder={TEXT[key]}
              data={variable[key]?.map((item) => ({
                value: item,
                label: item,
              }))}
              onChange={(value) => handleChange(value, key)}
              style={{ width: "100%" }}
            />
          </FlexboxGrid.Item>
        );
      })}
    </>
  );
};
const OptionsControlInput = ({ value, onChange, variable, base }) => {
  const [products, setProducts] = React.useState(value);

  const handleChangeProducts = (nextProducts) => {
    setProducts(nextProducts);
    onChange(nextProducts);
  };
  const handleInputChange = (rowIndex, value) => {
    const nextProducts = [...products];
    nextProducts[rowIndex] = value;
    handleChangeProducts(nextProducts);
  };

  const handleMinus = () => {
    handleChangeProducts(products.slice(0, -1));
  };
  const handleAdd = () => {
    let VariantObject = { "Màu sắc": "", "Phiên bản": "", "Bộ nhớ": "", price: "" };

    delete VariantObject[base];
    console.log(VariantObject)
    handleChangeProducts(products.concat([VariantObject]));
  };

 
  const newVariable = { ...variable };
  delete newVariable[base];
  console.log(newVariable);
  return (
    <>
      <FlexboxGrid style={{ gap: 4 }} justify="space-between">
        {products?.map((rowValue, index) => (
          <>
            <VariableItem
              key={index}
              rowIndex={index}
              rowValue={rowValue}
              onChange={handleInputChange}
              variable={newVariable}
            />
            <FlexboxGrid.Item style={{ width: "calc(100% / 3 - 4px)" }}>
              <CustomInputPrice
                name="price"
                rowValue={rowValue}
                onChange={(value) =>
                  handleInputChange(index, { ...rowValue, price: value })
                }
              />
            </FlexboxGrid.Item>
          </>
        ))}

        <div style={{ width: "100%" }}>
          <ButtonGroup size="xs">
            <IconButton onClick={handleAdd} icon={<PlusIcon />} />
            <IconButton onClick={handleMinus} icon={<MinusIcon />} />
          </ButtonGroup>
        </div>
      </FlexboxGrid>
    </>
  );
};

const CustomSelect = forwardRef((props, ref) => {
  return (
    <SelectPicker
      {...props}
      ref={ref}
      data={PRODUCT_TYPE}
      value={props.value}
    />
  );
});

const ProductCreateModal = (props) => {
  const changeTitle = useCommonStore((state) => state.changeTitle);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [variable, setVariable] = useState([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: null,
    img: [],
    category: "",
    type: "simple",
    variable: [],
  });

  const [data, setData] = useState();

  const toaster = useToaster();

  useEffect(() => {
    changeTitle("Create Post");
    getCateData();
    getVariables();
    if (props.data) {
      const newData = { ...props.data };
      setForm(newData);
    }
  }, []);

  const getCateData = async () => {
    try {
      setLoading(true);
      const res = await CategoryService.getCate({ type: "post" });
      let { data } = res.data;
      setData(data);
    } catch (error) {
      console.log("error", error, error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const getVariables = async () => {
    try {
      setLoading(true);
      let _variables = await ProductService.getVariables();

      setVariable(_variables.data.data);

      toaster.push(<Message>{_variables.data.message}</Message>);
    } catch (error) {
      console.log("getVariables error", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      if (props.onSubmit) {
        props.onSubmit(form);
      }
    } catch (error) {
      console.log("error", error, error?.response?.data?.message);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    }
  };

  console.log(variable[form.primary_variable], form);
  return (
    <>
      <Button onClick={() => router.back()}>Back</Button>

      <JsonViewer data={form} />

      <Content className={" p-4"}>
        <Form
          formValue={form}
          onChange={(formVal) => setForm(formVal)}
          className={"row "}
          fluid
        >
          <div
            className="col-9 bg-w rounded"
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <CardBlock>
              <Form.Group controlId="title">
                <Form.ControlLabel>Tên sản phẩm</Form.ControlLabel>
                <Form.Control name="title" />
              </Form.Group>

              <Form.Group controlId="slug">
                <Form.ControlLabel>Đường dẫn</Form.ControlLabel>
                <Form.Control name="slug" />
              </Form.Group>

              <Form.Group controlId="content">
                <Form.ControlLabel>Nội dung</Form.ControlLabel>
                <Form.Control name="content" accepter={Textarea} />
              </Form.Group>

              <Form.Group controlId="description">
                <Form.ControlLabel>Mô tả</Form.ControlLabel>
                <Form.Control name="description" accepter={Textarea} />
              </Form.Group>
            </CardBlock>

            <CardBlock>
              <FlexboxGrid justify="flex-start">
                <FlexboxGrid.Item colspan={4}>
                  <Form.Group controlId="type">
                    <Form.ControlLabel>Loại sản phẩm</Form.ControlLabel>
                    <Form.Control name="type" accepter={CustomSelect} />
                  </Form.Group>
                </FlexboxGrid.Item>

                {form.type === PRODUCT_TEXT.SIMPLE && (
                  <FlexboxGrid.Item colspan={4}>
                    <Form.Group controlId="price">
                      <Form.ControlLabel>Giá tiền</Form.ControlLabel>
                      <NumericFormat
                        name="price"
                        customInput={CustomInput}
                        thousandSeparator=","
                        onValueChange={({ value }, sourceInfo) =>
                          setForm({ ...form, price: value })
                        }
                        placeholder="Giá tiền"
                        suffix=" VNĐ"
                      />
                    </Form.Group>
                  </FlexboxGrid.Item>
                )}

                {form.type === PRODUCT_TEXT.VARIANT && (
                  <>
                    <FlexboxGrid.Item colspan={4}>
                      <Form.Group controlId="primary_variant">
                        <Form.ControlLabel>Tên biến thể</Form.ControlLabel>

                        <Form.Control
                          name={"primary_variant"}
                          accepter={KMSelect}
                          data={Object.keys(variable).map((key) => ({
                            label: key,
                            value: key,
                          }))}
                        />
                      </Form.Group>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={4}>
                      <Form.Group controlId="primary_value">
                        <Form.ControlLabel>Biến thể chính</Form.ControlLabel>

                        <Form.Control
                          name="primary_value"
                          accepter={KMSelect}
                          data={variable[form.primary_variant]?.map((item) => ({
                            label: item,
                            value: item,
                          }))}
                        />
                      </Form.Group>
                    </FlexboxGrid.Item>
                  </>
                )}

                {form?.primary_variant && (
                  <FlexboxGrid.Item colspan={12}>
                    <Form.Group controlId="variable">
                      <Form.ControlLabel>Biến thể phụ</Form.ControlLabel>
                      <Form.Control
                        name={"variable"}
                        accepter={OptionsControlInput}
                        variable={variable}
                        base={form?.primary_variant}
                      />
                    </Form.Group>
                  </FlexboxGrid.Item>
                )}
              </FlexboxGrid>
            </CardBlock>
          </div>
          <div
            className="col-3 position-sticky"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              top: 0,
            }}
          >
            <CardBlock>
              <Form.Group controlId="img">
                <Form.ControlLabel>Ảnh bài post</Form.ControlLabel>
                <Form.Control
                  rows={5}
                  name="img"
                  accepter={CustomUpload}
                  action="#"
                  group
                />
              </Form.Group>
            </CardBlock>

            <CardBlock>
              <Form.Group controlId="category">
                <Form.ControlLabel>Danh mục cha</Form.ControlLabel>
                <Form.Control
                  name="category"
                  accepter={Select}
                  data={data || []}
                  labelKey={"name"}
                  valueKey={"_id"}
                  preventOverflow
                  cascade
                />
              </Form.Group>
            </CardBlock>

            <CardBlock>
              <Form.Group>
                <ButtonToolbar>
                  <Button appearance="primary" onClick={onSubmit}>
                    Tạo
                  </Button>
                </ButtonToolbar>
              </Form.Group>
            </CardBlock>
          </div>
        </Form>
      </Content>
    </>
  );
};

export default ProductCreateModal;
