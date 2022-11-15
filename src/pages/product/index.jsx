import clsx from "clsx";
import Card from "component/UI/Content/Card";
import CardBlock from "component/UI/Content/CardBlock";
import Divider from "component/UI/Content/Divider";
import Heading from "component/UI/Content/Heading";
import SideFilter from "component/UI/Content/SideFilter";
import CommonLayout from "component/UI/Layout";
import Link from "next/link";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Dropdown, Pagination, SelectPicker } from "rsuite";
import ProductService from "service/admin/Product.service";
import styles from "./styles.module.scss";

const pricingFilter = [
  {
    label: "Từ thấp đến cao",
    value: "Từ thấp đến cao",
  },
  {
    label: "Từ cao đến đến",
    value: "Từ cao đến đến",
  },
  {
    label: "Mới nhất",
    value: "Mới nhất",
  },
  {
    label: "Hot nhất",
    value: "Hot nhất",
  },
];
export default function Product(props) {
  const [activePage, setActivePage] = useState(1);
  const [product, setProduct] = useState([]);
  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const resp = await ProductService.getProduct();
      setProduct(resp.data.data);
    } catch (error) {
      console.log("getProducts error: " + error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <Heading type="h3" left divideClass={styles.divideLeft}>
            Sản phẩm
          </Heading>
        </div>

        <div className="col-lg-2 col-md-12">
          <SideFilter />
        </div>

        <div className={clsx([styles.vr, "col-lg-10 col-md-12"])}>
          <CardBlock>
            <div className="row gy-4">
              <div className="col-12">
                <p>
                  The category description can be positioned anywhere on the
                  page via the layout page builder inside the Blocks module with
                  full typography control and advanced container styling
                  options. The category image can also be added to the Category
                  layouts automatically via the Blocks module. This allows for
                  more creative placements on the page. It can also be
                  enabled/disabled on any device and comes with custom image
                  dimensions, including fit or fill (crop) options for all
                  system images such as products, categories, banners, sliders,
                  etc. Advanced Product Filter module included. This is the most
                  comprehensive set of filtering tools rivaling the top paid
                  extensions. It supports Opencart filters, price, availability,
                  category, brands, options, attributes, tags, all included in
                  the same Journal 3 package. Ajax Infinite Scroll with Load
                  More / Load Previous and browser back button support. Load
                  products in category pages as you scroll down or by clicking
                  the Load More button, or disable this feature entirely and
                  display the default pagination.
                </p>
              </div>
              <Divider />
              <div className="col-12">
                <div className={styles.filter}>
                  <label>Pricing: </label>
                  <SelectPicker data={pricingFilter} style={{ width: 224 }} />
                </div>
              </div>

              {product?.map((prod) => {
                return (
                  <Link href={`/product/${prod.slug}`} passHref key={prod._id}>
                    <div className="col-3">
                      <Card
                        imgSrc={prod.img?.[0].filename}
                        title={prod.title}
                        price={prod.price}
                        underlinePrice={prod?.underlinePrice || null}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardBlock>
          <div className={styles.pagi}>
            <Pagination
              prev
              last
              next
              first
              size="sm"
              total={100}
              limit={10}
              activePage={activePage}
              onChangePage={(page) => setActivePage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

Product.Layout = CommonLayout;
