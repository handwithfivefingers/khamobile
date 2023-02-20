import clsx from 'clsx'
import PostHelmet from 'component/PostHelmet'
import ProductForm from 'component/Product/ProductForm'
import CardBlock from 'component/UI/Content/CardBlock'
import NoData from 'component/UI/Content/NoData'
import PageHeader from 'component/UI/Content/PageHeader'
import CommonLayout from 'component/UI/Layout'
import axios from 'configs/axiosInstance'
import parser from 'html-react-parser'
import { ProductJsonLd } from 'next-seo'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button, Carousel, Table } from 'rsuite'
import { imageLoader } from 'src/helper'
import styles from './styles.module.scss'

const { Column, HeaderCell, Cell } = Table

export default function ProductDetail({ data, _relationProd, seo, slug, ...props }) {
  const [toggleContent, setToggleContent] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('parse')
      if (!window.FB) return
      else {
        window.FB.XFBML.parse()
        clearTimeout(timeout)
      }
    }, 1000)
    console.log(process.env.host + router.asPath)
    return () => clearTimeout(timeout)
  }, [])
  console.log(data)
  return (
    <>
      <PostHelmet seo={seo} />

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
                    <ProductForm data={data} _relationProd={_relationProd} slug={slug} />

                    <CardBlock className="border-0 mt-4">
                      {data?.description && <TabsList data={data?.description} />}
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

const TabsList = ({ data }) => {
  return (
    <div className={styles.tabs}>
      <h6>Khuyến mãi</h6>
      <div className={styles.tabsContent}>{parser(data || '')}</div>
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

    // console.log(data)

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
