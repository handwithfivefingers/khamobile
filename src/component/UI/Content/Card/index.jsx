import React from 'react'
import demoImg from 'assets/img/demo-phone.png'
import styles from './styles.module.scss'
import clsx from 'clsx'
import { formatCurrency } from 'src/helper'

export default function Card({
  imgSrc,
  shadow = true,
  border = true,
  hover,
  cover,
  title,
  price,
  underlinePrice,
  type,
  variable,
}) {
  const classCard = clsx([
    'card',
    styles.card,
    {
      [styles.shadow]: shadow,
      [styles.border]: border,
      [styles.hover]: hover,
      [styles.cover]: cover,
    },
  ])

  const getPrice = (amount) => {
    if (type === 'simple') return formatCurrency(amount, { symbol: '' })
    else if (type === 'variant') {
      return `Chỉ từ ${formatCurrency(amount, { symbol: '' })}`
    }
  }
  return (
    <div className={classCard}>
      <div className={clsx('card-img-top', styles.cardImg)}>
        <img src={imgSrc || demoImg.src} className={styles.img} alt="..." />
      </div>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">
          <b className="price">{getPrice(price)} VNĐ</b>
        </p>
        <p className="card-text">
          <s>{formatCurrency(underlinePrice)}</s>
        </p>
      </div>
    </div>
  )
}
