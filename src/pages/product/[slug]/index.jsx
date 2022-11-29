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
import Script from 'next/script'
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

  const [status, setStatus] = useState(false)

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
    setStatus(true)
    // <Script src="https://pc.baokim.vn/js/bk_plus_v2.popup.js" />
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
                  color={activeVariant.value === item.value ? 'red' : ''}
                  appearance={activeVariant.value === item.value ? 'primary' : ''}
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
                  {item.value}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  useEffect(() => {
    setStatus(false)
    setTimeout(() => setStatus(true), 2000)
  }, [form])

  const renderSubVariant = () => {
    return (
      <div className="col-12">
        <div className="row gy-2">
          {activeVariant?.item?.map((item) => {
            return (
              <div
                className={clsx([' col-12 col-md-6 col-lg-6 col-xl-4'])}
                onClick={() => {
                  setForm({
                    ...form,
                    sku: item._id,
                    skuPrice: item.price,
                  })
                }}
              >
                <div
                  className={clsx('shadow-sm rounded border', styles.skuSelect, {
                    [styles.active]: form.sku === item._id,
                  })}
                >
                  {item.attribute &&
                    Object.keys(item.attribute).map((key) => {
                      if (key !== item.primary)
                        return (
                          <>
                            <span>
                              {key}:{item[key]} <br />
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

  // console.log(_relationProd)

  return (
    <div className="container product_detail">
      <div className="row gy-4" style={{ paddingTop: '1.5rem' }}>
        <Heading type="h1" left divideClass={styles.divideLeft} className={'bk-product-name'}>
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
                        <Image
                          src={
                            `${process.env.host}${item.src}` ||
                            'https://www.journal-theme.com/1/image/cache/catalog/journal3/categories/demo09-260x260.jpg.webp'
                          }
                          layout="fill"
                          objectFit="contain"
                          className="bk-product-image"
                        />
                      </div>
                    )
                  })}
                  {/* <Image
                    src={
                    }
                    layout="fill"
                    objectFit="contain"
                    className="bk-product-image"
                  /> */}
                  <img
                    className="bk-product-image"
                    src="https://www.journal-theme.com/1/image/cache/catalog/journal3/categories/demo09-260x260.jpg.webp"
                  />
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
                      <div className="row">
                        <div className="col-12">
                          <p className={clsx(styles.productPricing)}>{calculatePrice()}</p>
                          <input
                            type="hidden"
                            value={form?.skuPrice * form?.quantity || 999999}
                            className="bk-product-price"
                          />
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
                      <input type="hidden" value={form.quantity} className="bk-product-qty" />
                      <Divider vertical />

                      <Button
                        color="red"
                        appearance="primary"
                        className={styles.btnIcon}
                        onClick={handleAddToCart}
                        style={{ background: 'var(--rs-red-800)', color: '#fff' }}
                      >
                        <BiCart />
                        Thêm vào giỏ hàng
                      </Button>
                      <Button
                        appearance="primary"
                        className={styles.btnIcon}
                        onClick={handleBuyNow}
                        style={{ background: 'var(--rs-blue-800)' }}
                      >
                        <BiDollarCircle />
                        Mua ngay
                      </Button>

                      <div className="bk-btn"></div>
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
                  style={{ background: 'var(--rs-red-800)', color: '#fff' }}
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

      <div id="bk-modal"></div>
      {/* <BaoKim status={status} /> */}
      {/* <Script src="https://pc.baokim.vn/js/bk_plus_v2.popup.js" /> */}
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
      // style: { background: 'var(--rs-red-800)', color: '#fff' },
    },
    {
      key: 'information',
      active: 'red',
      appearance: 'primary',
      name: 'Thông tin sản phẩm',
      // style: { background: 'var(--rs-red-800)', color: '#fff' },
    },
    {
      key: 'preview',
      name: 'Review',
      active: 'red',
      appearance: 'primary',
      // style: { background: 'var(--rs-red-800)', color: '#fff' },
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
            style={{
              background: item.key === tabs ? 'var(--rs-red-800)' : 'transparent',
              borderColor: ' var(--rs-red-800)',
              color: item.key === tabs ? '#fff' : 'var(--rs-red-800)',
            }}
          >
            {item.name}
          </Button>
        ))}
      </ButtonGroup>
      <div style={{ paddingTop: 20 }}>{handleRenderTabs()}</div>
    </>
  )
}

// const BaoKim = (props) => {
//   const BAOKIM_SCRIPT = 'https://pc.baokim.vn/js/bk_plus_v2.popup.js'

//   useEffect(() => {
//     include(BAOKIM_SCRIPT, props.status)
//     console.log('load baokimscript', props.status)
//   }, [props])

//   const include = (filename, status) => {
//     var head = document.getElementsByTagName('head')[0]
//     if (status) {
//       var script = document.createElement('script')
//       script.src = filename
//       script.type = 'text/javascript'
//       head.appendChild(script)
//     } else {
//       var scripts = head.getElementsByTagName('script')
//       if (scripts.length > 0) {
//         head.removeChild(scripts[0])
//       }
//     }
//   }
//   return <></>
// }

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
