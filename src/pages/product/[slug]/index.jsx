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

export default function ProductDetail({ data }) {
  const formRef = useRef()
  const [toggleContent, setToggleContent] = useState(false)

  const [form, setForm] = useState({
    quantity: 1,
    img: data?.img,
  })

  const router = useRouter()

  useEffect(() => {
    if (data?.child?.length > 1) {
      setForm({
        ...form,
        sku: JSON.stringify(data?.variable?.[0]),
        skuPrice: data?.variable?.[0]?.price,
      })
    } else {
      setForm({
        ...form,
        skuPrice: data?.child?.price,
      })
    }
  }, [])

  const handleOptions = useMemo(() => {
    return data?.variable?.map((item) => {
      let newObj = { ...item }
      delete newObj.price
      return {
        label: Object.keys(newObj).map((key) => [key, ' : ', newObj[key], <br />]),
        value: JSON.stringify(item),
      }
    })
  }, [data])

  const handleAddToCart = () => {
    const cartItem = JSON.parse(localStorage.getItem('khaMobileCart'))

    let listItem = []

    if (cartItem?.length) {
      listItem = [...cartItem]
    }

    listItem.push(form)

    localStorage.setItem('khaMobileCart', JSON.stringify(listItem))
  }

  const handleBuyNow = () => {
    const cartItem = JSON.parse(localStorage.getItem('khaMobileCart'))

    let listItem = []

    if (cartItem?.length) {
      listItem = [...cartItem]
    }

    listItem.push(form)

    localStorage.setItem('khaMobileCart', JSON.stringify(listItem))

    router.push('/cart')
  }

  const renderVariantProduct = useMemo(() => {
    let html = null

    if (data.child?.length > 1) {
      html = (
        <>
          <div className={'row gx-2 gy-2 align-items-center w-100'}>
            <div className="col-12">
              <div className="row">
                {data?.v?.map((item) => {
                  return (
                    <div
                      className={clsx([' col-12 col-md-6 col-lg-6 col-xl-4 col-xxl-3'])}
                      // onClick={() =>
                      //   setForm({
                      //     ...form,
                      //     sku: item.value,
                      //     skuPrice: +JSON.parse(item.value).price,
                      //   })
                      // }
                    >
                      <div
                        className={clsx('shadow-sm rounded border', styles.skuSelect, {
                          // [styles.active]: form.sku === item.value,
                        })}
                      >
                        {item}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <Divider />

            <div className="col-12">
              <div className="row">
                {[...data?.v].map((item) => {
                  return data?.child.map((prod) => {
                    return (
                      <div
                        className={clsx([' col-12 col-md-6 col-lg-6 col-xl-4 col-xxl-3'])}
                        onClick={() =>
                          setForm({
                            ...form,
                            sku: item.value,
                            skuPrice: +JSON.parse(item.value).price,
                          })
                        }
                      >
                        <div
                          className={clsx('shadow-sm rounded border', styles.skuSelect, {
                            [styles.active]: form.sku === item.value,
                          })}
                        >
                          {item.label}
                        </div>
                      </div>
                    )
                  })
                })}
              </div>
            </div>
          </div>
        </>
      )
    }

    return html
  }, [data, form])

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

  const readMore = () => {}

  console.log(data, form)
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
                    <TabsList data={data} />

                    <Divider />
                    <div
                      className={clsx('d-inline-flex align-items-center w-100', styles.groupVariant)}
                      style={{ gap: 4 }}
                    >
                      <p className={styles.productPricing}>{calculatePrice()}</p>
                      <Divider vertical className={styles.divider} />

                      {renderVariantProduct}
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

export const getServerSideProps = async (ctx) => {
  const { slug } = ctx.query

  const resp = await axios.get('/admin/product' + '/' + 'test/' + slug)

  return {
    props: {
      data: resp.data.data,
    },
  }
}

ProductDetail.Layout = CommonLayout

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
