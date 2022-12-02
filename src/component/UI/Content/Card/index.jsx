import React from 'react'
import demoImg from 'assets/img/demo-phone.png'
import styles from './styles.module.scss'
import clsx from 'clsx'
import { formatCurrency } from 'src/helper'
import { useRouter } from 'next/router'
import { Placeholder } from 'rsuite'
import { Image } from '@rsuite/icons'
import * as NextImage from 'next/image'
export default function Card({
  imgSrc,
  shadow = true,
  border = false,
  hover,
  cover,
  title,
  price,
  underlinePrice,
  type,
  variable,
  slug,
  loading,
}) {
  const router = useRouter()

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
    if (type === 'simple') return <b className={styles.price}>{formatCurrency(amount, { symbol: 'đ' })}</b>
    else if (type === 'variable') {
      return (
        <>
          Chỉ từ <b className={styles.price}>{formatCurrency(amount, { symbol: 'đ' })}</b>
        </>
      )
    }
  }

  const handleRouting = (sl) => router.push(sl)

  if (loading) {
    return <CardSkeleton classCard={classCard} />
  }

  if (slug) {
    return (
      <div className={classCard} onClick={() => handleRouting(slug)}>
        <div className={clsx('card-img-top', styles.cardImg)}>
          {imgSrc ? (
            <NextImage src={imgSrc} className={styles.img} alt="..." layout="fill" />
          ) : (
            <Image className={styles.img} />
          )}
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardTitle}>
            <h5>{title}</h5>
          </div>
          <p className={styles.cardText}>{getPrice(price)}</p>
          {underlinePrice && (
            <p className={styles.cardText}>
              <s>{formatCurrency(underlinePrice)}</s>
            </p>
          )}
        </div>
      </div>
    )
  }
  return (
    <div className={classCard}>
      <div className={clsx('card-img-top', styles.cardImg)}>
        {imgSrc ? (
          <NextImage src={imgSrc} className={styles.img} alt="..." layout="fill" />
        ) : (
          <Image className={styles.img} />
        )}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTitle}>
          <h5>{title}</h5>
        </div>
        <p className={styles.cardText}>{getPrice(price)}</p>
        {underlinePrice && (
          <p className={styles.cardText}>
            <s>{formatCurrency(underlinePrice)}</s>
          </p>
        )}
      </div>
    </div>
  )
}

function CardSkeleton({ classCard }) {
  return (
    <div className={classCard}>
      <Placeholder.Graph active />
      <div className={styles.cardBody}>
        <div className={styles.cardTitle}>
          <Placeholder.Paragraph rows={2} active />
        </div>
        <p className={styles.cardText}>
          <Placeholder.Paragraph rows={1} active />
        </p>
      </div>
    </div>
  )
}
