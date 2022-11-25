import clsx from 'clsx'
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

export default function ProductDetail({ data, _relationProd }) {
  const formRef = useRef()

  const [toggleContent, setToggleContent] = useState(false)

  const [activeVariant, setActiveVariant] = useState([])

  const [form, setForm] = useState({
    quantity: 1,
    img: data?.img,
  })

  const router = useRouter()

  useEffect(() => {
    if (data) {
      if (_relationProd.length > 0) {
        let { primaryKey } = data
        let index = _relationProd.findIndex((item) => item._id === primaryKey)
        if (index !== -1) setActiveVariant(_relationProd[index])
      } else {
        setForm({
          ...form,
          skuPrice: data.price,
          _id: data?._id,
        })
      }
    }
  }, [])

  const handleAddToCart = () => {
    const cartItem = JSON.parse(localStorage.getItem('khaMobileCart'))

    let listItem = []

    if (cartItem?.length) {
      listItem = [...cartItem]
    }

    let index = listItem.findIndex((item) => item._id === form._id)

    if (index !== -1) {
      listItem[index].quantity = listItem[index].quantity + +form.quantity
    } else {
      listItem.push(form)
    }

    localStorage.setItem('khaMobileCart', JSON.stringify(listItem))
  }

  const handleBuyNow = () => {
    const cartItem = JSON.parse(localStorage.getItem('khaMobileCart'))

    let listItem = []

    if (cartItem?.length) {
      listItem = [...cartItem]
    }

    let index = listItem.findIndex((item) => item._id === form._id)

    if (index !== -1) {
      listItem[index].quantity = listItem[index].quantity + +form.quantity
    } else {
      listItem.push(form)
    }

    localStorage.setItem('khaMobileCart', JSON.stringify(listItem))

    router.push('/cart')
  }

  const renderPrimaryVariant = () => {
    return (
      <div className="col-12">
        <div className="row row-cols-auto gy-2">
          {_relationProd.map((item) => {
            return (
              <div className={clsx(['col'])}>
                <Button
                  type="button"
                  color={activeVariant._id === item._id ? 'red' : ''}
                  appearance={activeVariant._id === item._id ? 'primary' : ''}
                  className={clsx('btn shadow-sm rounded border', styles.skuSelect, styles.btnIcon)}
                  onClick={() => {
                    setActiveVariant(item)
                    setForm({
                      sku: null,
                      skuPrice: null,
                      quantity: 1,
                      img: '',
                    })
                  }}
                >
                  {item._id}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderSubVariant = () => {
    return (
      <div className="col-12">
        <div className="row gy-2">
          {activeVariant?.item?.map((item) => {
            return (
              <div
                className={clsx([' col-12 col-md-6 col-lg-6 col-xl-4'])}
                onClick={() =>
                  setForm({
                    ...form,
                    sku: item._id,
                    skuPrice: item.price,
                  })
                }
              >
                <div
                  className={clsx('shadow-sm rounded border', styles.skuSelect, {
                    [styles.active]: form.sku === item._id,
                  })}
                >
                  {item.variant &&
                    Object.keys(item.variant).map((key) => {
                      return (
                        <>
                          <span>
                            {key}: {item.variant[key]} <br />
                          </span>
                        </>
                      )
                    })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderVariantProduct = useMemo(() => {
    let html = null
    if (_relationProd.length > 0) {
      html = (
        <>
          <Divider className={styles.divider} />
          <div className={'row gx-2 gy-2 align-items-center w-100'}>
            {renderPrimaryVariant()}
            <Divider />
            {renderSubVariant()}
          </div>
        </>
      )
    }
    return html
  }, [data, form, _relationProd, activeVariant])

  const calculatePrice = () => {
    let html = null

    if (data.variable?.length > 0) {
      html = formatCurrency(form?.skuPrice * form?.quantity || 0)
    } else {
      html = formatCurrency(form?.skuPrice * form?.quantity || 0)
    }

    return html
  }

  const model = Schema.Model({
    quantity: Schema.Types.StringType().isRequired('Số lượng không chính xác, vui lòng thử lại').minLength(0),
    skuPrice: Schema.Types.StringType().isRequired('Giá tiền không chính xác, vui lòng reload lại page'),
  })

  return (
    <div className="container product_detail">
      <div className="row gy-4" style={{ paddingTop: '1.5rem' }}>
        <Heading type="h1" left divideClass={styles.divideLeft}>
          {data.title}
        </Heading>

        <div className={clsx([styles.vr, 'col-lg-12 col-md-12'])}>
          <div className="row gy-4">
            <div className="col-6">
              <CardBlock>
                <Carousel placement={'left'} shape={'bar'} className="custom-slider" autoplay>
                  {data?.img?.map((item) => {
                    return (
                      <div style={{ position: 'relative' }}>
                        <Image src={`${process.env.host}${item.src}`} layout="fill" objectFit="contain" />
                      </div>
                    )
                  })}
                </Carousel>
              </CardBlock>
            </div>

            <div className="col-6">
              <CardBlock>
                <Form ref={formRef} model={model}>
                  <Panel className="py-4">
                    <div
                      className={clsx('d-inline-flex align-items-center w-100', styles.groupVariant)}
                      style={{ gap: 4 }}
                    >
                      {/* <p
                        className={clsx(styles.productPricing, {
                          [styles.variantPricing]: _relationProd.length > 0,
                        })}
                      >
                        {calculatePrice()}
                      </p>

                      {renderVariantProduct} */}

                      <div className="row">
                        <div className="col-12">
                          <p className={clsx(styles.productPricing)}>{calculatePrice()}</p>
                        </div>

                        <div className="col-12">{renderVariantProduct}</div>
                      </div>
                    </div>

                    <Divider />

                    <div className={clsx('d-inline-flex align-items-center', styles.groupVariant)} style={{ gap: 4 }}>
                      <Form.Control
                        name="quantity"
                        accepter={CustomInputNumber}
                        style={{ width: 60 }}
                        defaultValue={form.quantity}
                        onChange={(value) => setForm({ ...form, quantity: value })}
                        min={1}
                      />

                      <Divider vertical />

                      <Button color="red" appearance="primary" className={styles.btnIcon} onClick={handleAddToCart}>
                        <BiCart />
                        Thêm vào giỏ hàng
                      </Button>
                      <Button color="blue" appearance="primary" className={styles.btnIcon} onClick={handleBuyNow}>
                        <BiDollarCircle />
                        Mua ngay
                      </Button>
                    </div>
                    <Divider />

                    <TabsList data={data} />
                  </Panel>
                </Form>
              </CardBlock>

              {/* <JsonViewer data={form} /> */}
            </div>
          </div>
        </div>

        <div className="col-lg-9 col-md-12">
          <CardBlock>
            <div
              className={clsx(styles.productContent, {
                [styles.open]: toggleContent,
              })}
            >
              {data?.content && parser(data?.content)}
              {!toggleContent && (
                <Button
                  appearance="ghost"
                  color="red"
                  onClick={() => setToggleContent(true)}
                  className={styles.btnToggle}
                >
                  Xem thêm
                </Button>
              )}
            </div>
          </CardBlock>
        </div>
        <div className="col-lg-3 col-md-12">
          <SideFilter />
        </div>
      </div>
    </div>
  )
}

const TabsList = (props) => {
  const [tabs, setTabs] = useState('description')
  const tabsList = [
    {
      key: 'description',
      active: 'red',
      name: 'Mô tả',
      appearance: 'primary',
    },
    {
      key: 'information',
      active: 'red',
      appearance: 'primary',
      name: 'Thông tin sản phẩm',
    },
    {
      key: 'preview',
      name: 'Review',
      active: 'red',
      appearance: 'primary',
    },
  ]

  const handleRenderTabs = () => {
    if (tabs === 'preview') {
      return (
        <>
          <div className="d-inline-flex align-items-center" style={{ gap: 4, height: '100%' }}>
            <Rate defaultValue={3} size="xs" readOnly />
            <div>Base on 1 Reviews</div>
            <div>Write a review</div>
          </div>
        </>
      )
    } else if (tabs === 'information') {
      return <div>information</div>
    } else if (tabs === 'description') {
      return <div>{parser(props?.data?.description || '')}</div>
    }
  }

  return (
    <>
      <ButtonGroup>
        {tabsList.map((item) => (
          <Button
            onClick={() => setTabs(item.key)}
            color={tabs === item.key ? item.active : ''}
            appearance={tabs === item.key ? item.appearance : 'ghost'}
          >
            {item.name}
          </Button>
        ))}
      </ButtonGroup>
      <div style={{ paddingTop: 20 }}>{handleRenderTabs()}</div>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const { slug } = ctx.query

  const resp = await axios.get('/product' + '/' + slug)
  const { data, _relationProd } = resp.data
  return {
    props: {
      data,
      _relationProd,
    },
  }
}

ProductDetail.Layout = CommonLayout
