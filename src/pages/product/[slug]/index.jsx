import clsx from 'clsx'
import PostHelmet from 'component/PostHelmet'
import ProductForm from 'component/Product/ProductForm'
import CardBlock from 'component/UI/Content/CardBlock'
import ImageBlock from 'component/UI/Content/ImageBlock'
import NoData from 'component/UI/Content/NoData'
import PageHeader from 'component/UI/Content/PageHeader'
import CommonLayout from 'component/UI/Layout'
import axios from 'configs/axiosInstance'
import parser from 'html-react-parser'
import { ProductJsonLd } from 'next-seo'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Carousel, Table } from 'rsuite'
import styles from './styles.module.scss'
import { isEqual } from 'lodash'

const { Column, HeaderCell, Cell } = Table

export default function ProductDetail({ data, _relationProd, seo, slug, ...props }) {
  const [toggleContent, setToggleContent] = useState(false)

  const [imageSlider, setImageSlider] = useState(data?.image)

  const router = useRouter()

  const productInformationRef = useRef()

  useEffect(() => {
    handleFBLoad()
  }, [])

  const handleFBLoad = async () => {
    while (!window.FB) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    window.FB.XFBML.parse()
  }

  const getProductContent = useMemo(() => {
    let html = null

    html = (
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
    )

    return html
  }, [toggleContent])

  const handleOutputSelect = (outputData) => {
    const listImage = [...data?.image]
    if (outputData?.image) {
      listImage.unshift(outputData?.image)
    }
    if (!isEqual(listImage, imageSlider)) {
      setImageSlider(listImage)
    }
  }

  const renderImageSlider = useMemo(() => {
    return <Slider image={imageSlider} />
  }, [imageSlider])
  return (
    <>
      <PostHelmet seo={seo} />

      <Head>
        <ProductJsonLd
          productName="Executive Anvil"
          images={
            data?.image?.map(({ src }) =>
              process.env.NODE_ENV !== 'development' ? process.env.API + src : 'https://app.khamobile.vn' + src,
            ) || []
          }
          description={data?.description}
          brand="ACME"
          color={data?.attribute?.['Màu sắc']}
          reviews={[
            {
              author: 'Jim',
              datePublished: '2017-01-06T03:37:40Z',
              reviewBody: 'This is my favorite product yet! Thanks Nate for the example products and reviews.',
              name: 'So awesome!!!',
              reviewRating: {
                bestRating: '5',
                ratingValue: '5',
                worstRating: '1',
              },
              publisher: {
                type: 'Organization',
                name: 'TwoVit',
              },
            },
          ]}
          aggregateRating={{
            ratingValue: '4.4',
            reviewCount: '89',
          }}
          offers={_relationProd?.map((_relationItem) => ({
            price: _relationItem.price,
            priceCurrency: 'VND',
            itemCondition: 'https://schema.org/UsedCondition',
            availability: _relationItem.stock_status ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: process.env.host + router.asPath,
          }))}
          lowPrice={data?.price}
          priceCurrency={'VND'}
        />
      </Head>

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
                  <div className="col-12 col-md-12 col-lg-5">{renderImageSlider}</div>

                  <div className="col-12 col-md-12 col-lg-7">
                    <ProductForm
                      data={data}
                      _relationProd={_relationProd}
                      slug={slug}
                      outputSelect={handleOutputSelect}
                    />

                    {data?.description && <TabsList data={data?.description} className="border-0 mt-4" />}
                  </div>
                </div>
              </div>

              <div className="col-lg-9 col-md-12">{getProductContent}</div>

              <div className={clsx('col-lg-3 col-md-12')} ref={productInformationRef}>
                <CardBlock className="border-0">
                  <Table
                    height={400}
                    data={data?.information}
                    renderEmpty={() => <NoData description="Chưa có dữ liệu" />}
                  >
                    <Column flexGrow={1} fullText>
                      <HeaderCell>Thông số kỹ thuật</HeaderCell>
                      <Cell dataKey="key" />
                    </Column>

                    <Column flexGrow={1} fullText>
                      <HeaderCell />
                      <Cell dataKey="value" />
                    </Column>
                  </Table>
                </CardBlock>
              </div>

              <div className="col-12">
                <CardBlock className="border-0">
                  {process.env.NODE_ENV === 'development' ? (
                    <div
                      className="fb-comments"
                      data-href={'https://khamobile.vn' + router.asPath}
                      data-width="100%"
                      data-numposts="5"
                    />
                  ) : (
                    <div
                      className="fb-comments"
                      data-href={process.env.CANONICAL + router.asPath}
                      data-width="100%"
                      data-numposts="5"
                      data-lazy="true"
                    />
                  )}
                </CardBlock>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const TabsList = ({ data, className }) => {
  return (
    <div className={clsx(className, styles.tabs)}>
      <h6>Khuyến mãi</h6>
      <div className={clsx(styles.tabsContent)}>{parser(data || '')}</div>
    </div>
  )
}

const Slider = ({ image, activeIndex, ...props }) => {
  const [sliderActive, setSliderActive] = useState(0)

  useEffect(() => {
    if (image) {
      setSliderActive(0)
    }
  }, [image])

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
            {image?.map((item, index) => {
              return (
                <div style={{ position: 'relative' }} key={[item.src, index].join('_')}>
                  <ImageBlock src={item?.src} layout="fill" objectFit="contain" engine height="75%" />
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
                key={[item?.src, index].join('_')}
              >
                <img
                  src={process.env.API + item?.src}
                  alt={'Product Image'}
                  className={clsx({
                    ['bk-product-image']: index === 0,
                  })}
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
