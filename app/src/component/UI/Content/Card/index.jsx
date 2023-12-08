import { Image } from '@rsuite/icons'
import clsx from 'clsx'
import NextImage from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { IconButton, Placeholder } from 'rsuite'
import { formatCurrency, imageLoader } from 'src/helper'
import styles from './styles.module.scss'

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
  wishList = { status: false },
  _id,
}) {
  const [wish, setWish] = useState(wishList.status)

  useEffect(() => {
    const wishItem = JSON.parse(localStorage.getItem('khaMobileWish')) || []
    if (wishItem && wishItem.some((item) => item === _id)) {
      setWish(true)
    }
  }, [])

  const handleAddWishList = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const wishItem = JSON.parse(localStorage.getItem('khaMobileWish')) || []
    let index = wishItem?.findIndex((item) => item === _id)
    let nextState = []
    if (index !== -1) {
      if (wish) {
        nextState = [...wishItem.slice(0, index), wishItem.slice(index + 1)]
      } else {
        nextState = [...wishItem, _id]
      }
    } else {
      nextState = [...wishItem, _id]
    }
    console.log(nextState)
    localStorage.setItem('khaMobileWish', JSON.stringify(nextState))
    setWish(!wish)
  }

  const classCard = clsx([
    'card flex flex-col rounded-[8px] m-[-1px] p-[1px]',
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

  if (loading) {
    return <CardSkeleton classCard={classCard} />
  }

  if (slug) {
    return (
      <Link href={slug} className={classCard} style={{ textDecoration: 'none' }} title={title}>
        <div className={clsx('card-img-top', styles.cardImg)}>
          {imgSrc ? (
            <NextImage
              src={imgSrc}
              className={styles.img}
              alt={title}
              layout="fill"
              blurDataURL="/blur.jpg"
              placeholder="blur"
              loading={'lazy'}
              loader={imageLoader}
            />
          ) : (
            <Image className={styles.img} />
          )}
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardTitle}>
            <h5>{title}</h5>
          </div>
          <p className={clsx(styles.cardText, 'm-0')}>{getPrice(price)}</p>

          {underlinePrice && (
            <p className={styles.cardText}>
              <s>{formatCurrency(underlinePrice)}</s>
            </p>
          )}

          {wishList && (
            <div className={styles.wishList}>
              <IconButton
                icon={wish ? <AiFillHeart style={{ fill: 'var(--rs-red-700)' }} /> : <AiOutlineHeart />}
                onClick={handleAddWishList}
              />
            </div>
          )}
        </div>
      </Link>
    )
  }

  return (
    <div className={classCard}>
      <div className={clsx('card-img-top', styles.cardImg)}>
        {imgSrc ? (
          <NextImage
            src={imgSrc}
            className={styles.img}
            alt="..."
            layout="fill"
            blurDataURL="/blur.png"
            placeholder="blur"
            loading={'lazy'}
            loader={imageLoader}
          />
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
        {wishList && (
          <div className={styles.wishList}>
            <IconButton
              icon={wish ? <AiFillHeart style={{ fill: 'var(--rs-red-700)' }} /> : <AiOutlineHeart />}
              onClick={handleAddWishList}
            />
          </div>
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
