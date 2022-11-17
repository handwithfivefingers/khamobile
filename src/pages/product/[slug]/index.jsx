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
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  ButtonGroup, Carousel, Form,
  InputNumber
} from "rsuite";
import { formatCurrency } from "src/helper";
import styles from "./styles.module.scss";
const CustomPrice = ({ value }) => {
  return <div class="rs-plaintext">{formatCurrency(value)}</div>;
};

const CustomInput = ({ value }) => {
  return <div class="rs-plaintext">{value && parser(value)}</div>;
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
    const cartItem = JSON.parse(localStorage.getItem("khaMobileCart"));

    let listItem = [];

    if (cartItem.length) {
      listItem = [...cartItem];
    }

    if (form.variable.length > 0) {
      listItem.push({
        ...form,
        sku: { ...JSON.parse(form?.sku) },
        quantity: form.quantity,
      });
    } else {
      listItem.push({
        ...form,
      });
    }

    localStorage.setItem("khaMobileCart", JSON.stringify(listItem));

    router.push("/cart");
  };

  const renderVariantProduct = () => {
    let html = null;

    if (form.variable?.length > 0) {
      html = (
        <>
          <Form.Group controlId="color">
            <Form.ControlLabel>{form?.primary_variant}</Form.ControlLabel>
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

            {formatCurrency(form?.skuPrice * form?.quantity || 0)}
          </Form.Group>
        </>
      );
    } else {
      html = (
        <>
          <Form.Group controlId="skuPrice">
            <Form.ControlLabel>Giá tiền :</Form.ControlLabel>

            {formatCurrency(form?.price * form?.quantity || 0)}
          </Form.Group>
        </>
      );
    }

    return html;
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

                  {renderVariantProduct()}

                  <Button onClick={() => handleAddToCart()}>Add to Cart</Button>
                </Form>
                <JsonViewer data={form} />
              </div>
            </div>
          </CardBlock>
        </div>

        <div className="col-lg-9 col-md-12">
          <CardBlock>
            <ButtonGroup>
              <Button>Tab 1</Button>
              <Button>Tab 2</Button>
              <Button>Tab 3</Button>
            </ButtonGroup>

            <div></div>
          </CardBlock>
        </div>
        <div className="col-lg-3 col-md-12">
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
