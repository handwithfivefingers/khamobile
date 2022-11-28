import clsx from 'clsx'
import Card from 'component/UI/Content/Card'
import CardBlock from 'component/UI/Content/CardBlock'
import Heading from 'component/UI/Content/Heading'
import SideFilter from 'component/UI/Content/SideFilter'
import JsonViewer from 'component/UI/JsonViewer'
import CommonLayout from 'component/UI/Layout'
import axios from 'configs/axiosInstance'
import parser from 'html-react-parser'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useMemo, useState } from 'react'
import { BiCart, BiDollarCircle } from 'react-icons/bi'
import { Button, ButtonGroup, Carousel, Divider, Form, InputNumber, Panel, Rate, Schema } from 'rsuite'
import { formatCurrency } from 'src/helper'
import styles from './styles.module.scss'

const CustomInputNumber = ({ rowKey, value, ...props }) => {
  return <InputNumber value={value} {...props} />
}

export default function SingleCategory({ data }) {
  console.log(data)
  return (
    <div className="container product_detail">
      <div className="row gy-4" style={{ paddingTop: '1.5rem' }}>
        <Heading type="h1" left divideClass={styles.divideLeft}>
          {data.name}
        </Heading>

        <div className={clsx([styles.vr, 'col-lg-12 col-md-12'])}>
          <div className="row">
            {data?.child?.map((item) => {
              return (
                <div className="col-3" key={item._id}>
                  <Card
                    imgSrc={item.img?.[0]?.filename}
                    title={item.title}
                    price={item.price}
                    underlinePrice={item?.underlinePrice || null}
                    type={item.type}
                    variable={item.variable}
                    slug={`/product/${item.slug}`}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  const { slug } = ctx.query

  const resp = await axios.get('/product_category' + '/' + slug)
  const data = resp.data
  return {
    props: data,
  }
}

SingleCategory.Layout = CommonLayout
