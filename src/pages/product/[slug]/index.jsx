import clsx from "clsx";
import Head from "component/Head";
import Card from "component/UI/Content/Card";
import CardBlock from "component/UI/Content/CardBlock";
import Divider from "component/UI/Content/Divider";
import Heading from "component/UI/Content/Heading";
import SideFilter from "component/UI/Content/SideFilter";
import CommonLayout from "component/UI/Layout";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import {
  Carousel,
  Dropdown,
  Form,
  Pagination,
  SelectPicker,
  FlexboxGrid,
  InputNumber,
  ButtonGroup,
  IconButton,
} from "rsuite";
import styles from "./styles.module.scss";
import axios from "configs/axiosInstance";
import { formatCurrency } from "src/helper";
import parser from "html-react-parser";
import { useEffect } from "react";
import { TEXT } from "src/constant/text.constant";

const CustomPrice = ({ value }) => {
  return <div class="rs-plaintext">{formatCurrency(value)}</div>;
};

const CustomInput = ({ value }) => {
  return <div class="rs-plaintext">{value && parser(value)}</div>;
};

const VariableItem = ({ rowValue = {}, onChange, rowIndex, variable }) => {
  // console.log(variable);

  // const color = []

  const color = variable.reduce((prev, current) => {
    prev.push(current.color);
    return prev;
  }, []);
  const memory = variable.reduce((prev, current) => {
    prev.push(current.memory);
    return prev;
  }, []);
  const version = variable.reduce((prev, current) => {
    prev.push(current.version);
    return prev;
  }, []);

  const handleChange = (value, name) =>
    onChange(rowIndex, { ...rowValue, [name]: value });
  return (
    <>
      {color.length && (
        <FlexboxGrid.Item style={{ width: "calc(100% /3 - 4px)" }}>
          <SelectPicker
            placeholder={TEXT["color"]}
            data={color?.map((item) => ({ value: item, label: item }))}
            onChange={(value) => handleChange(value, "color")}
            style={{ width: "100%" }}
          />
        </FlexboxGrid.Item>
      )}
      {version.length && (
        <FlexboxGrid.Item style={{ width: "calc(100% / 3 - 4px)" }}>
          <SelectPicker
            placeholder={TEXT["version"]}
            data={version?.map((item) => ({ value: item, label: item }))}
            onChange={(value) => handleChange(value, "version")}
            style={{ width: "100%" }}
          />
        </FlexboxGrid.Item>
      )}
      {memory.length && (
        <FlexboxGrid.Item style={{ width: "calc(100% /3 - 4px)" }}>
          <SelectPicker
            placeholder={TEXT["memory"]}
            data={memory?.map((item) => ({ value: item, label: item }))}
            onChange={(value) => handleChange(value, "memory")}
            style={{ width: "100%" }}
          />
        </FlexboxGrid.Item>
      )}
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
      products.concat([{ color: "", version: "", memory: "" }])
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
          </>
        ))}
      </FlexboxGrid>
    </>
  );
};
export default function ProductDetail({ data }) {
  const [form, setForm] = useState();
  useEffect(() => {
    setForm(data);
  }, [data]);

  return (
    <div className="container">
      <div className="row gy-4" style={{ paddingTop: "1.5rem" }}>
        <Heading type="h1" left divideClass={styles.divideLeft}>
          Sản phẩm
        </Heading>

        <div className={clsx([styles.vr, "col-lg-12 col-md-12"])}>
          <CardBlock>
            <div className="row gy-4">
              <div className="col-6">
                <Carousel
                  placement={"left"}
                  shape={"bar"}
                  className="custom-slider"
                  autoplay
                >
                  {data?.img.map((item) => {
                    return (
                      <div style={{ position: "relative" }}>
                        <Image
                          src={`http://localhost:3000${item.src}`}
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                    );
                  })}
                </Carousel>
              </div>

              <div className="col-6">
                <Form
                  formValue={form}
                  layout="horizontal"
                  className={clsx(styles.form, "form-product")}
                >
                  <Form.Group controlId="title">
                    <Form.Control name="title" classPrefix="title" plaintext />
                  </Form.Group>

                  <Form.Group controlId="price">
                    <Form.Control
                      name="price"
                      accepter={CustomPrice}
                      classPrefix="price"
                    />
                  </Form.Group>

                  <Form.Group controlId="description">
                    <Form.Control
                      name="description"
                      classPrefix="description"
                      accepter={CustomInput}
                      plaintext
                    />
                  </Form.Group>

                  <Form.Group controlId="quantity">
                    <Form.ControlLabel>Số lượng:</Form.ControlLabel>
                    <Form.Control name="quantity" accepter={InputNumber} />
                  </Form.Group>

                  {form?.type === "variant" && (
                    <Form.Group controlId="variable">
                      <Form.ControlLabel>Biến thể</Form.ControlLabel>
                      <Form.Control
                        name={"variable"}
                        accepter={OptionsControlInput}
                        variable={form.variable}
                      />
                    </Form.Group>
                  )}
                </Form>
              </div>
            </div>
          </CardBlock>
        </div>

        <div className="col-lg-10 col-md-12"></div>
        <div className="col-lg-2 col-md-12">
          <SideFilter />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const { slug } = ctx.query;

  const resp = await axios.get("/admin/product" + "/" + slug);

  console.log(resp.data.data);
  return {
    props: {
      data: resp.data.data,
    },
  };
};

ProductDetail.Layout = CommonLayout;
