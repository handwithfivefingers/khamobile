import clsx from "clsx";
import CardBlock from "component/UI/Content/CardBlock";
import Heading from "component/UI/Content/Heading";
import { KMSelect } from "component/UI/Content/KMInput";
import SideFilter from "component/UI/Content/SideFilter";
import JsonViewer from "component/UI/JsonViewer";
import CommonLayout from "component/UI/Layout";
import axios from "configs/axiosInstance";
import parser from "html-react-parser";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import {
  Carousel,
  FlexboxGrid,
  Form,
  InputNumber,
  SelectPicker,
  Button,
} from "rsuite";
import { TEXT } from "src/constant/text.constant";
import { formatCurrency } from "src/helper";
import styles from "./styles.module.scss";
import _ from "lodash";
import router from "server/route/v1/user";
import { useRouter } from "next/router";
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
  const [form, setForm] = useState({
    quantity: 1,
  });
  const router = useRouter();
  useEffect(() => {
    setForm({
      ...form,
      ...data,
    });
  }, [data]);

  const handleOptions = useMemo(() => {
    return form?.variable?.map((item) => {
      let newObj = { ...item };
      delete newObj.price;
      return {
        label: Object.keys(newObj)
          .map((key) => [key, newObj[key]].join(" : "))
          .join(" - "),
        value: JSON.stringify(item),
      };
    });
  }, [form]);
  const handleAddToCart = () => {
    localStorage.setItem(
      "khaMobileCart",
      JSON.stringify([
        {
          ...form,
          sku: { ...JSON.parse(form?.sku) },
          quantity: form.quantity,
        },
      ])
    );
    router.push("/cart");
  };
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
                          src={`${process.env.host}${item.src}`}
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
                  className={clsx(styles.form, "form-product  row gx-3 gy-3")}
                >
                  <div className="col-12">
                    <Form.Group controlId="title">
                      <Form.Control
                        name="title"
                        classPrefix="title"
                        plaintext
                      />
                    </Form.Group>
                  </div>
                  <div className="col-12">
                    <Form.Group controlId="price">
                      <Form.Control
                        name="price"
                        accepter={CustomPrice}
                        classPrefix="price"
                      />
                    </Form.Group>
                  </div>
                  <div className="col-12">
                    <Form.Group controlId="description">
                      <Form.Control
                        name="description"
                        classPrefix="description"
                        accepter={CustomInput}
                        plaintext
                      />
                    </Form.Group>
                  </div>
                  <div className="col-12">
                    <Form.Group controlId="quantity">
                      <Form.ControlLabel>Số lượng:</Form.ControlLabel>
                      <Form.Control
                        name="quantity"
                        accepter={InputNumber}
                        onChange={(value) =>
                          setForm({ ...form, quantity: +value })
                        }
                      />
                    </Form.Group>
                  </div>
                  <Form.Group controlId="color">
                    <Form.ControlLabel>
                      {form?.primary_variant}
                    </Form.ControlLabel>
                    <Form.Control name={"primary_value"} plaintext />
                  </Form.Group>
                  <Form.Group controlId="sku">
                    <Form.ControlLabel>Loại :</Form.ControlLabel>
                    <Form.Control
                      accepter={KMSelect}
                      data={handleOptions}
                      onChange={(value) =>
                        setForm({
                          ...form,
                          sku: value,
                          skuPrice: +JSON.parse(value).price,
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="skuPrice">
                    <Form.ControlLabel>Giá tiền :</Form.ControlLabel>
                    <Form.Control
                      name="skuPrice"
                      plaintext
                      value={form?.skuPrice * form?.quantity || 0}
                    />
                  </Form.Group>

                  <Button onClick={() => handleAddToCart()}>Add to Cart</Button>
                </Form>
                <JsonViewer data={form} />
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
