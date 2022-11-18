import FilmIcon from "@rsuite/icons/legacy/Film";
import ImageIcon from "@rsuite/icons/legacy/Image";
import UserCircleIcon from "@rsuite/icons/legacy/UserCircleO";
import CardBlock from "component/UI/Content/CardBlock";
import Divider from "component/UI/Content/Divider";
import Heading from "component/UI/Content/Heading";
import CommonLayout from "component/UI/Layout";
import React, { useEffect, useState } from "react";
import {
  FlexboxGrid,
  List,
  Panel,
  InputGroup,
  InputNumber,
  Table,
  Button,
} from "rsuite";
import { formatCurrency } from "src/helper";
import styles from "./styles.module.scss";
const { HeaderCell, Cell, Column } = Table;

// const createRowData = (rowIndex) => {
//   const randomKey = Math.floor(Math.random() * 5);
//   const names = [
//     "Iphone 14 Promax",
//     "Iphone 13 Promax",
//     "Iphone 12 Promax",
//     "Iphone 11 Promax",
//     "Iphone 10 Promax",
//   ];
//   const price = ["21000000", "21000000", "21000000", "21000000", "21000000"];
//   const quantity = ["1", "2", "3", "4", "5"];
//   const total = ["21000000", "21000000", "21000000", "21000000", "21000000"];

//   return {
//     id: rowIndex + 1,
//     name: names[randomKey],
//     price: price[randomKey],
//     quantity: quantity[randomKey],
//     total: total[randomKey],
//   };
// };

// const data = Array.from({ length: 5 }).map((_, index) => createRowData(index));

export default function Cart(props) {
  const [data, setData] = useState([]);

  const [price, setPrice] = useState({
    total: 0,
    subTotal: 0,
  });

  useEffect(() => {
    let item = JSON.parse(localStorage.getItem("khaMobileCart"));
    console.log(item)
    if (item) {
      const totalPrice = item.reduce((prev, current) => {
        if (current.variable?.length > 0) {
          prev += +current.skuPrice * +current.quantity;
        } else {
          prev += +current.price * +current.quantity;
        }
        return prev;
      }, 0);

      setData(item);
      setPrice({
        total: totalPrice,
        subTotal: totalPrice,
      });
    }
  }, []);

  const handleMinus = () => {
    setValue(parseInt(value, 10) - 1);
  };
  const handlePlus = () => {
    setValue(parseInt(value, 10) + 1);
  };

  const QuantityCell = ({ rowData, dataKey, ...props }) => (
    <Cell {...props}>
      <InputGroup>
        <InputGroup.Button onClick={handleMinus}>-</InputGroup.Button>
        <InputNumber
          size="sm"
          className={styles.customInputNumber}
          value={rowData[dataKey]}
        />
        <InputGroup.Button onClick={handlePlus}>+</InputGroup.Button>
      </InputGroup>
    </Cell>
  );
  console.log(data);

  const TotalCell = ({ rowData, dataKey, ...props }) => (
    <Cell {...props}>
      <InputNumber
        size="sm"
        className={styles.customInputNumber}
        value={
          rowData["skuPrice"]
            ? formatCurrency(rowData["skuPrice"] * rowData["quantity"])
            : formatCurrency(rowData["price"] * rowData["quantity"])
        }
        plaintext
      />
    </Cell>
  );
  const Pricing = ({ rowData, dataKey, ...props }) => (
    <Cell {...props}>
      <InputNumber
        size="sm"
        className={styles.customInputNumber}
        value={
          rowData["skuPrice"]
            ? formatCurrency(rowData["skuPrice"] * rowData["quantity"])
            : formatCurrency(rowData["price"] * rowData["quantity"])
        }
        plaintext
      />
    </Cell>
  );

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <Heading type="h3" left divideClass={styles.divideLeft}>
            Giỏ hàng
          </Heading>
        </div>

        <div className="col-8">
          <CardBlock>
            <Panel bordered bodyFill>
              <Table height={400} data={data} rowHeight={58}>
                <Column
                  width={200}
                  align="center"
                  flexGrow={1}
                  verticalAlign="middle"
                >
                  <HeaderCell>Tên sản phẩm</HeaderCell>
                  <Cell dataKey="title" />
                </Column>

                <Column align="center" verticalAlign="middle" flexGrow={1}>
                  <HeaderCell>Đơn giá</HeaderCell>
                  <Pricing dataKey="sku" />
                </Column>

                <Column width={150} verticalAlign="middle" align="center">
                  <HeaderCell>Số lượng</HeaderCell>
                  <QuantityCell dataKey="quantity" />
                </Column>

                <Column verticalAlign="middle" align="center" flexGrow={1}>
                  <HeaderCell>Tạm tính</HeaderCell>
                  <TotalCell dataKey="total" />
                </Column>
              </Table>
            </Panel>
          </CardBlock>
        </div>
        <div className="col-4">
          <CardBlock>
            <Panel header="Tổng cộng" bordered>
              {/* <Divider /> */}
              <List>
                <List.Item>
                  Tạm tính:
                  {formatCurrency(price.subTotal)}
                </List.Item>
                <List.Item>
                  Tổng cộng:
                  {formatCurrency(price.total)}
                </List.Item>

                <List.Item>
                  <Button>Tiến hành Thanh toán</Button>
                </List.Item>
              </List>
            </Panel>
          </CardBlock>
        </div>
      </div>
    </div>
  );
}

Cart.Layout = CommonLayout;
