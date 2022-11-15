import React from "react";
import demoImg from "assets/img/demo-phone.png";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { formatCurrency } from "src/helper";

export default function Card({
  imgSrc,
  shadow = true,
  border = true,
  hover,
  cover,
  title,
  price,
  underlinePrice,
}) {
  const classCard = clsx([
    "card",
    styles.card,
    {
      [styles.shadow]: shadow,
      [styles.border]: border,
      [styles.hover]: hover,
      [styles.cover]: cover,
    },
  ]);
  return (
    <div className={classCard}>
      <div className={clsx("card-img-top", styles.cardImg)}>
        <img src={imgSrc || demoImg.src} className={styles.img} alt="..." />
      </div>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">
          <b className="price">{formatCurrency(price)}</b>
        </p>
        <p className="card-text">
          <s>{formatCurrency(underlinePrice)}</s>
        </p>
        {/* <p className={styles.priceTragop}>
          <span>Hoặc trả trước</span>700,000 đ
        </p> */}
      </div>
    </div>
  );
}
