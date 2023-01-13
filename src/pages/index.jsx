import CommonLayout from 'component/UI/Layout'
import Head from 'next/head'
import Homebanner_1 from 'assets/img/dai-hoi-thu-cu-doi-moi5.webp'
import Homebanner_2 from 'assets/img/iphone-13-pro-max.webp'
import Homebanner_3 from 'assets/img/iphone-14-san-hang.webp'
import Homebanner_4 from 'assets/img/macbook-m2-gia-soc.jpg'
import Card from 'component/UI/Content/Card'
import Heading from 'component/UI/Content/Heading'

import CustomSlider from 'component/UI/Content/Slider'
import { Panel, Carousel } from 'rsuite'
import Catalog from 'component/UI/Content/Catalog'
import ImageBlock from 'component/UI/Content/ImageBlock'
import { TYPE_CAROUSEL } from 'src/constant/carousel.constant'
import GlobalHomeService from 'service/global/Home.service'
import { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import CardBlock from 'component/UI/Content/CardBlock'
import axios from 'axios'
import PostHelmet from 'component/PostHelmet'
import { SiteLinksSearchBoxJsonLd } from 'next-seo'
const Home = (props) => {
  const [data, setData] = useState([])
  useEffect(() => {
    getHomeProd()
  }, [])
  const getHomeProd = async () => {
    try {
      let resp = await GlobalHomeService.getHomeProd()
      // sort Item

      const { data } = resp.data

      const nextState = [{}, {}, {}, {}, {}, {}, {}]

      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        if (item._id === '6382d12ebd85e309e477dba3') {
          /* Sản Phẩm Nổi Bật */
          nextState[6] = item
        } else if (item._id === '6382d12ebd85e309e477db84') {
          /* Apple Watch */
          nextState[1] = item
        } else if (item._id === '6382d12dbd85e309e477db81') {
          /* Accessories */
          nextState[0] = item
        } else if (item._id === '6382d12ebd85e309e477db86') {
          /* Ipad */
          nextState[2] = item
        } else if (item._id === '6382d12ebd85e309e477db97') {
          /* Macbook */
          nextState[5] = item
        } else if (item._id === '6382d12ebd85e309e477db8d') {
          /* IPHONE */
          nextState[3] = item
        } else nextState[4] = item
      }

      setData(nextState)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <PostHelmet seo={props?.seo} />

      <SiteLinksSearchBoxJsonLd
        url={process.env.host}
        potentialActions={[
          {
            target: `${process.env.host}/search?q`,
            queryInput: 'page',
          },
        ]}
      />
      <section className="container-fluid">
        <div className="row gx-2 gy-2">
          <div className="col-12">
            <div className="container" style={{ background: '#fff', boxShadow: 'var(--main-box-shadow)' }}>
              <div className={styles.grid}>
                <div className={styles.mainCarousel}>
                  <SelfCarousel />
                </div>
                <div className={styles.mainBanner}>
                  <ImageBlock
                    src={process.env.API + '/public/wp/2022' + '/10' + '/banner-moi-4.png'}
                    className={styles.banner}
                    alt="..."
                    height={'calc(50% - 12px)'}
                  />
                  <ImageBlock
                    src={process.env.API + '/public/wp/2022' + '/10' + '/banner-moi-5.png'}
                    className={styles.banner}
                    alt="..."
                    height={'calc(50% - 12px)'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <Heading type="h3" center>
                    {data?.[6]?.name}
                    {/* Sản Phẩm Nổi Bật */}
                  </Heading>
                </div>

                <div className="col-12">
                  <CustomSlider type={TYPE_CAROUSEL.MUTI}>
                    {data?.[6]?.child?.map((item) => {
                      return (
                        <Card
                          imgSrc={(item.image?.[0]?.src && item.image?.[0]?.src) || ''}
                          cover
                          title={item.title}
                          price={item.price}
                          type={item.type}
                          slug={`/product/${item.slug}`}
                          _id={item._id}
                        />
                      )
                    })}
                  </CustomSlider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="container">
        <div className="row">
          <div className="col-12">
            <Heading type="h3" center>
              Khách hàng của Kha Mobile
            </Heading>
          </div>

          <div className="col-12">
            <CustomSlider type={TYPE_CAROUSEL.MUTI}>
              <CardBlock>
                <figure className="text-center">
                  <blockquote className="blockquote">
                    <p>A well-known quote, contained in a blockquote element.</p>
                  </blockquote>
                  <figcaption className="blockquote-footer">
                    Someone famous in <cite title="Source Title">Source Title</cite>
                  </figcaption>
                </figure>
              </CardBlock>
              <CardBlock>
                <figure className="text-center">
                  <blockquote className="blockquote">
                    <p>A well-known quote, contained in a blockquote element.</p>
                  </blockquote>
                  <figcaption className="blockquote-footer">
                    Someone famous in <cite title="Source Title">Source Title</cite>
                  </figcaption>
                </figure>
              </CardBlock>
              <CardBlock>
                <figure className="text-center">
                  <blockquote className="blockquote">
                    <p>A well-known quote, contained in a blockquote element.</p>
                  </blockquote>
                  <figcaption className="blockquote-footer">
                    Someone famous in <cite title="Source Title">Source Title</cite>
                  </figcaption>
                </figure>
              </CardBlock>
              <CardBlock>
                <figure className="text-center">
                  <blockquote className="blockquote">
                    <p>A well-known quote, contained in a blockquote element.</p>
                  </blockquote>
                  <figcaption className="blockquote-footer">
                    Someone famous in <cite title="Source Title">Source Title</cite>
                  </figcaption>
                </figure>
              </CardBlock>
              <CardBlock>
                <figure className="text-center">
                  <blockquote className="blockquote">
                    <p>A well-known quote, contained in a blockquote element.</p>
                  </blockquote>
                  <figcaption className="blockquote-footer">
                    Someone famous in <cite title="Source Title">Source Title</cite>
                  </figcaption>
                </figure>
              </CardBlock>
              <CardBlock>
                <figure className="text-center">
                  <blockquote className="blockquote">
                    <p>A well-known quote, contained in a blockquote element.</p>
                  </blockquote>
                  <figcaption className="blockquote-footer">
                    Someone famous in <cite title="Source Title">Source Title</cite>
                  </figcaption>
                </figure>
              </CardBlock>
            </CustomSlider>
          </div>
        </div>
      </section> */}

      <section className="container">
        <div className="row">
          <div className="col-12">
            <Heading type="h3" center>
              {data?.[1]?.name}
              {/* Apple Watch */}
            </Heading>
          </div>

          <div className="col-12">
            <Catalog data={data?.[1]} />
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-12">
            <Heading type="h3" center>
              {data?.[0]?.name}
              {/* Accessories */}
            </Heading>
          </div>

          <div className="col-12">
            <Catalog data={data?.[0]} direction="rtl" />
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-12">
            <Heading type="h3" center>
              {data?.[5]?.name}
              {/* Macbook */}
            </Heading>
          </div>

          <div className="col-12">
            <Catalog data={data?.[5]} />
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-12">
            <Heading type="h3" center>
              {data?.[2]?.name}
              {/* Ipad */}
            </Heading>
          </div>

          <div className="col-12">
            <Catalog data={data?.[2]} direction="rtl" />
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-12">
            <Heading type="h3" center>
              {data?.[3]?.name}
              {/* IPHONE */}
            </Heading>
          </div>

          <div className="col-12">
            <Catalog data={data?.[3]} />
          </div>
        </div>
      </section>
    </>
  )
}

Home.Layout = CommonLayout

const SelfCarousel = () => {
  const [images, setImages] = useState([
    {
      itemImageSrc: `${process.env.API}/public/wp/2022/10/BANNER-WEBSITE-01.png`,
      thumbnailImageSrc: 'MACBOOK M2 GIÁ SỐC',
    },

    {
      itemImageSrc: `${process.env.API}/public/wp/2022/10/banner-moi-1.png`,
      thumbnailImageSrc: 'IPHONE 14 SẴN HÀNG',
    },
    {
      itemImageSrc: `${process.env.API}/public/wp/2022/10/banner-moi-2.png`,
      thumbnailImageSrc: 'IPHONE 13 ProMax',
    },
    {
      itemImageSrc: `${process.env.API}/public/wp/2022/10/banner-moi-3.png`,
      thumbnailImageSrc: 'IPHONE 13 ProMax',
    },

    {
      itemImageSrc: `${process.env.API}/public/wp/2022/10/KHA-MOBILE-BANNER-21.10.2022.png`,
      thumbnailImageSrc: 'MACBOOK M2 GIÁ SỐC',
    },

  ])
  return (
    <Carousel placement={'bottom'} shape={'bar'} className="custom-slider" autoplayInterval={3000} autoplay>
      {images.map((item, index) => (
        <img src={item.itemImageSrc} key={index} />
      ))}
    </Carousel>
  )
}

export const getServerSideProps = async (ctx) => {
  const resp = await GlobalHomeService.getHomeSeo()

  const data = resp.data
  console.log(data)
  return {
    props: {
      seo: data.seo,
    },
  }
}

export default Home
