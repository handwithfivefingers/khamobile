import React from 'react'
import styles from './styles.module.scss'
import Slider from 'react-slick'
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import clsx from 'clsx'
const MutiItem = (props) => {
  const { children, ...rest } = props
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: rest.slidesToShow || 6,
    slidesToScroll: 1,
    ...rest.configs,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,

    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 1,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  }

  const test = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <Slider {...settings} className={props.className}>
      {children
        ? children
        : test.map((item, index) => (
            <div className={styles.slideItem} key={[item, index]}>
              <h2>{item}</h2>
            </div>
          ))}
    </Slider>
  )
}

const NextArrow = (props) => {
  const { className, style, onClick } = props

  return (
    <div className={clsx([styles.arrow, styles.next])} style={{ ...style }} onClick={onClick}>
      <FaChevronRight className="!text-slate-50 bg-gradient-to-l from-blue-500  opacity-50 hover:opacity-100  p-2 w-10 h-10 flex items-center justify-center rounded-full" />
    </div>
  )
}

const PrevArrow = (props) => {
  const { className, style, onClick } = props
  return (
    <div className={clsx([styles.arrow, styles.prev])} style={{ ...style }} onClick={onClick}>
      <FaChevronLeft className="!text-slate-50 bg-gradient-to-r from-blue-500  opacity-50 hover:opacity-100  p-2 w-10 h-10 flex items-center justify-center rounded-full" />
    </div>
  )
}

export default MutiItem
