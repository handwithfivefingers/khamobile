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

const CustomInputNumber = forwardRef((props, ref) => {
  return <InputNumber {...props} ref={ref} />;
});
const VariableItem = ({ rowValue = {}, onChange, rowIndex, variable }) => {
  console.log(variable);
  const handleChange = (value, name) =>
    onChange(rowIndex, { ...rowValue, [name]: value });
  return (
    <>
      {variable?.map((item, index) => {
        return (
          <FlexboxGrid.Item style={{ width: "calc(100% / 4 - 4px)" }}>
            <SelectPicker
              placeholder={TEXT[item.key]}
              data={item.value?.map((item) => ({ value: item, label: item }))}
              onChange={(value) => handleChange(value, item.key)}
              style={{ width: "100%" }}
            />
          </FlexboxGrid.Item>
        );
      })}
    </>
  );
};
const OptionsControlInput = ({ value, onChange, variable }) => {
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
    handleChangeProducts(
      products.concat([{ color: "", version: "", memory: "", price: "" }])
    );
  };

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
              variable={variable}
            />
            <FlexboxGrid.Item style={{ width: "calc(100% / 4 - 4px)" }}>
              <InputNumber
                style={{ width: "100%" }}
                onChange={(value) =>
                  handleInputChange(index, { ...rowValue, price: value })
                }
				placeholder="Giá tiền"
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
  return <SelectPicker {...props} ref={ref} data={PRODUCT_TYPE} />;
});

const ProductCreateModal = () => {
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

      // setForm((state) => ({ ...state, variable: _variables.data.data }));

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
      // const formdata = new FormData();
      // for (let key in form) {
      // 	if (key === 'postImg') {
      // 		formdata.append(key, form[key]?.[0]?.blobFile || null);
      // 	} else formdata.append(key, form?.[key]);
      // }

      // await PostService.createPost(formdata);

      console.log(form);
    } catch (error) {
      console.log("error", error, error?.response?.data?.message);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    }
  };

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
                <Form.ControlLabel>Title</Form.ControlLabel>
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
              <Form.Group controlId="type">
                <Form.ControlLabel>Loại sản phẩm</Form.ControlLabel>
                <Form.Control name="type" accepter={CustomSelect} />
              </Form.Group>

              {form.type === PRODUCT_TEXT.SIMPLE && (
                <Form.Group controlId="price">
                  <Form.ControlLabel>Giá tiền</Form.ControlLabel>
                  <Form.Control name="price" accepter={CustomInputNumber} />
                </Form.Group>
              )}

              {form.type === PRODUCT_TEXT.VARIANT && (
                <Form.Group controlId="variable">
                  <Form.ControlLabel>Biến thể</Form.ControlLabel>
                  <Form.Control
                    name={"variable"}
                    accepter={OptionsControlInput}
                    variable={variable}
                  />
                </Form.Group>
              )}
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
                  file={form["img"]?.slice(-1)}
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
