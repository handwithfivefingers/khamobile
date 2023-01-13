import CloseIcon from '@rsuite/icons/Close'
import clsx from 'clsx'
import PostHelmet from 'component/PostHelmet'
import CardBlock from 'component/UI/Content/CardBlock'
import NoData from 'component/UI/Content/NoData'
import PageHeader from 'component/UI/Content/PageHeader'
import CommonLayout from 'component/UI/Layout'
import axios from 'configs/axiosInstance'
import parser from 'html-react-parser'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BiCart, BiDollarCircle } from 'react-icons/bi'
import {
  Button,
  Carousel,
  Divider,
  DOMHelper,
  Form,
  IconButton,
  InputNumber,
  Panel,
  Radio,
  RadioGroup,
  Schema,
  Table,
} from 'rsuite'
import GlobalProductService from 'service/global/Product.service'
import { formatCurrency, imageLoader } from 'src/helper'
import styles from './styles.module.scss'

const { Column, HeaderCell, Cell } = Table

const CustomInputNumber = ({ rowKey, value, ...props }) => {
  return <InputNumber value={value} {...props} />
}

export default function ProductDetail({ data, _relationProd, seo, ...props }) {
  const formRef = useRef()

  const pricingRef = useRef()

  const btnBarRef = useRef()

  const [toggleContent, setToggleContent] = useState(false)

  const [activeVariant, setActiveVariant] = useState([])

  const [listAvailable, setListAvailable] = useState([])

  const [attributes, setAttributes] = useState([])

  const [form, setForm] = useState({
    quantity: 1,
    image: data?.image,
    _id: data?._id,
  })

  const queryRef = useRef({})

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
          price: data.price,
          _id: data?._id,
        })
      }

      if (data?.attributes?.length) {
        onResetAttributes()
      }
    }

    const scrollEvent = (e) => {
      try {
        let groupBtn = document.querySelectorAll(`.${styles.groupVariant}`)[1]

        let { top } = DOMHelper.getOffset(pricingRef.current)

        let offsetTop = groupBtn.scrollHeight + groupBtn.offsetTop

        let pageYOffset = window.pageYOffset

        if (pageYOffset - top > offsetTop) {
          if (btnBarRef.current) {
            btnBarRef.current.style.opacity = 1
            btnBarRef.current.style.visibility = 'visible'
          }
        } else {
          if (btnBarRef.current) {
            btnBarRef.current.style.opacity = 0
            btnBarRef.current.style.visibility = 'hidden'
          }
        }
      } catch (error) {
        console.log('scroll', error)
      }
    }

    if (typeof window !== 'undefined') {
      document.addEventListener('scroll', scrollEvent, true)
      window.FB?.XFBML.parse(document.querySelector('.fb-comments'))
    }

    return () => document.removeEventListener('scroll', scrollEvent, true)
  }, [])

  const handleAddToCart = () => {
    const cartItem = JSON.parse(localStorage.getItem('khaMobileCart'))

    let listItem = []

    if (cartItem?.length) {
      listItem = [...cartItem]
    }

    let index = listItem.findIndex((item) => item._id === form._id && item?.variantId === form?.variantId)

    if (index !== -1) {
      listItem[index].quantity = listItem[index].quantity + +form.quantity
    } else {
      listItem.push(form)
    }

    localStorage.setItem('khaMobileCart', JSON.stringify(listItem))
  }

  const handleBuyNow = async () => {
    const cartItem = await JSON.parse(localStorage.getItem('khaMobileCart'))

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

    await localStorage.setItem('khaMobileCart', JSON.stringify(listItem))

    // return

    router.push('/cart')
  }

  const handleQueryItem = async (params) => {
    queryRef.current = { ...queryRef.current, ...params }

    const resp = await GlobalProductService.filterProduct({ ...queryRef.current, slug: props.slug })

    const { data } = resp.data

    setListAvailable(data)

    let nextState = [...attributes]

    if (Object.keys(queryRef.current).length < attributes.length) {
      nextState = nextState.map(({ name, value }) => {
        if (queryRef.current[name]) {
          return {
            name,
            value,
          }
        } else {
          let obj = []
          for (let { v } of value) {
            let isIncludes = data.some((item) => item.attribute[name] === v)
            if (isIncludes) {
              obj.push({ v, active: true })
            } else {
              obj.push({ v, active: false })
            }
          }
          return {
            name,
            value: obj,
          }
        }
      })
    } else if (Object.keys(queryRef.current).length >= attributes.length) {
      nextState = nextState.map(({ name, value }) => {
        if (params[name]) {
          return {
            name,
            value,
          }
        } else {
          let newQuery = { ...queryRef.current }

          let obj = []

          for (let { v } of value) {
            let isIncludes = Object.keys(newQuery).some((key) => {
              return newQuery[key] === v
            })

            if (isIncludes) {
              obj.push({ v, active: true })
            } else {
              obj.push({ v, active: false })
            }
          }
          return {
            name,
            value: obj,
          }
        }
      })

      let [productSelected] = data
      const { _id, ...rest } = productSelected
      setForm((prevState) => ({
        ...prevState,
        ...rest,
        variantId: _id,
      }))
    }

    setAttributes(nextState)
  }

  const onResetAttributes = () => {
    queryRef.current = {}
    const attributes = data?.attributes
    let attributeData = attributes?.map(({ name, value }) => {
      return {
        name,
        value: value?.map((_val) => ({ v: _val, active: true })),
      }
    })
    setAttributes(attributeData)
    setForm((prevState) => ({ ...prevState, price: null, variantId: null }))
  }

  const renderVariant = () => {
    let html = null
    html = (
      <>
        <div className="w-100 d-flex flex-column position-relative">
          <div>
            <IconButton
              icon={<CloseIcon />}
              circle
              size="xs"
              onClick={onResetAttributes}
              className="position-absolute top-0 end-0"
              style={{ backgroundColor: 'transparent', color: 'var(--rs-blue-700)' }}
            />
          </div>
          {attributes?.map((item) => {
            return (
              <RadioGroup
                className={clsx('d-flex flex-row border-0 flex-wrap p-1')}
                appearance="picker"
                onChange={(v) => handleQueryItem({ [item.name]: v })}
                value={queryRef.current?.[item.name] || ''}
              >
                <p className=" flex-shrink-0" style={{ color: 'var(--rs-blue-800)' }}>
                  {item.name} :
                </p>
                {item.value?.map(({ v, active }) => (
                  <Radio value={v} disabled={!active}>
                    <span
                      className={clsx('p-2 bg-light', {
                        'bk-product-property': active,
                      })}
                    >
                      {v}
                    </span>
                  </Radio>
                ))}
              </RadioGroup>
            )
          })}
        </div>
      </>
    )
    return html
  }

  const renderVariantProduct = useMemo(() => {
    let html = null
    if (_relationProd.length > 0) {
      html = (
        <>
          <Divider className={styles.divider} />
          <div className={'row gx-2 gy-2 align-items-center w-100'}>{renderVariant()}</div>
        </>
      )
    }
    return html
  }, [data, form, _relationProd, activeVariant, listAvailable, attributes])

  const calculatePrice = () => {
    let html = null
    html = formatCurrency(form?.price * form?.quantity || 0)
    return html
  }

  const model = Schema.Model({
    quantity: Schema.Types.StringType().isRequired('Số lượng không chính xác, vui lòng thử lại').minLength(1),
    price: Schema.Types.StringType().isRequired('Giá tiền không chính xác, vui lòng reload lại page'),
  })

  return (
    <>
      <PostHelmet seo={seo} />

      <div className="row p-0">
        <div className="col-12 p-0">
          <PageHeader type="h1" left divideClass={styles.divideLeft}>
            <span className="bk-product-name">{data.title}</span>
          </PageHeader>
        </div>
        <div className="col-12 p-0 py-2 border-top">
          <div className="container product_detail">
            <div className="row gy-4">
              <div className={clsx([styles.vr, 'col-lg-12 col-md-12'])}>
                <div className="row gy-4">
                  <div className="col-12 col-md-12 col-lg-5">
                    <Slider image={data?.image} />
                  </div>

                  <div className="col-12 col-md-12 col-lg-7">
                    <CardBlock className="border-0">
                      <Form ref={formRef} model={model}>
                        <Panel style={{ paddingBottom: 0, paddingTop: 24 }}>
                          <div
                            className={clsx('d-flex align-items-center w-100 flex-1', styles.groupVariant)}
                            style={{ gap: 4 }}
                          >
                            <div className={'row w-100 '} ref={pricingRef}>
                              <div className="col-12">
                                <p className={clsx(styles.productPricing, 'bk-product-price')}>{calculatePrice()}</p>
                                {/* <input
                                  type="hidden"
                                  value={form?.price * form?.quantity || 999999}
                                  className="bk-product-price"
                                /> */}
                              </div>

                              <div className="col-12">{renderVariantProduct}</div>
                            </div>
                          </div>

                          <Divider />

                          <div
                            className={clsx('d-inline-flex align-items-center', styles.groupVariant)}
                            style={{ gap: 4 }}
                          >
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
                              appearance="primary"
                              className={styles.btnIcon}
                              onClick={handleBuyNow}
                              style={{ background: 'var(--rs-blue-800)' }}
                              disabled={!(form?.price * form?.quantity)}
                            >
                              <div className="d-flex flex-column">
                                <span>Mua ngay</span>
                                <span style={{ fontSize: 12 }}>(giao tận nơi hoặc lấy tại cửa hàng)</span>
                              </div>
                            </Button>

                            <Button
                              color="red"
                              appearance="primary"
                              className={styles.btnIcon}
                              onClick={handleAddToCart}
                              style={{ background: 'var(--rs-red-800)', color: '#fff' }}
                              disabled={!(form?.price * form?.quantity)}
                            >
                              <div className="d-flex flex-column align-items-center">
                                <BiCart />
                                <span style={{ fontSize: 12 }}> Thêm vào giỏ hàng</span>
                              </div>
                            </Button>

                            <div
                              className={clsx('bk-btn', {
                                [styles.notAllow]: !(form?.price * form?.quantity),
                              })}
                            ></div>
                          </div>

                          <div className={clsx(styles.groudpVariantForMobile, 'border rounded shadow')} ref={btnBarRef}>
                            <p className={clsx(styles.productPricing)}>{calculatePrice()}</p>
                            <input
                              type="hidden"
                              value={form?.price * form?.quantity || 999999}
                              className="bk-product-price"
                            />

                            {/* {renderVariantProduct} */}
                            <div className={styles.action}>
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
                            </div>
                          </div>
                        </Panel>
                      </Form>
                    </CardBlock>

                    <CardBlock className="border-0 mt-4">
                      <TabsList data={data} />
                    </CardBlock>
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

              <div className={clsx('col-lg-3 col-md-12')}>
                <CardBlock className="border-0">
                  <Table height={400} data={data} renderEmpty={() => <NoData description="Chưa có dữ liệu" />}>
                    <Column width={150}>
                      <HeaderCell>Thông số kỹ thuật</HeaderCell>
                      <Cell dataKey="firstName" />
                    </Column>

                    <Column width={150}>
                      <HeaderCell />
                      <Cell dataKey="lastName" />
                    </Column>
                  </Table>
                </CardBlock>
              </div>

              <div className="col-12">
                <CardBlock className="border-0">
                  {process.env.NODE_ENV !== 'production' ? (
                    <div
                      class="fb-comments"
                      data-href={'https://khamobile.truyenmai.com' + router.asPath}
                      data-width="100%"
                      data-numposts="5"
                    />
                  ) : (
                    <div
                      class="fb-comments"
                      data-href={process.env.CANONICAL + router.asPath}
                      data-width="100%"
                      data-numposts="5"
                      data-lazy="true"
                    />
                  )}
                </CardBlock>
              </div>
            </div>

            <div id="bk-modal"></div>
          </div>
        </div>
      </div>

      <Script src="https://pc.baokim.vn/js/bk_plus_v2.popup.js" onLoad={() => console.log('bk loaded')} />
    </>
  )
}

const TabsList = (props) => {
  return (
    <div className={styles.tabs}>
      <h6>Khuyến mãi</h6>
      <div className={styles.tabsContent}>{parser(props?.data?.description || '')}</div>
    </div>
  )
}

const Slider = ({ image, ...props }) => {
  const [sliderActive, setSliderActive] = useState(0)

  return (
    <>
      <div className={styles.slider}>
        <div className={styles.carousel}>
          <Carousel
            placement={'left'}
            shape={'bar'}
            className="custom-slider"
            autoplay
            autoplayInterval={4000}
            defaultActiveIndex={0}
            activeIndex={sliderActive}
            onSelect={(index) => setSliderActive(index)}
            onSlideStart={(index, event) => setSliderActive(index)}
          >
            {image?.map((item) => {
              return (
                <div style={{ position: 'relative' }}>
                  <Image
                    src={item?.src}
                    layout="fill"
                    objectFit="contain"
                    className="bk-product-image"
                    loader={imageLoader}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={
                      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPcXw8AAgMBQLfkYc4AAAAASUVORK5CYII='
                    }
                  />
                </div>
              )
            })}
          </Carousel>
        </div>
        <div className={styles.imgThumb}>
          {image?.map((item, index) => {
            return (
              <div
                style={{ position: 'relative' }}
                className={clsx(styles.thumbItem, { [styles.active]: index === sliderActive })}
                onClick={() => setSliderActive(index)}
              >
                <Image
                  src={item?.src}
                  layout="fill"
                  objectFit="contain"
                  loader={imageLoader}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mPcXw8AAgMBQLfkYc4AAAAASUVORK5CYII='
                  }
                />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  try {
    const { slug } = ctx.query
    ctx.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

    const resp = await axios.get('/product' + '/' + slug)
    if (resp.status !== 200) {
      return {
        notFound: true,
      }
    }
    const { data, _relationProd, seo } = resp.data
    return {
      props: {
        data,
        _relationProd,
        slug,
        seo,
      },
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

ProductDetail.Layout = CommonLayout
