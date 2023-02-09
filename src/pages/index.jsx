import Card from 'component/UI/Content/Card'
import Heading from 'component/UI/Content/Heading'
import CommonLayout from 'component/UI/Layout'
import PostHelmet from 'component/PostHelmet'
import Catalog from 'component/UI/Content/Catalog'
import ImageBlock from 'component/UI/Content/ImageBlock'
import CustomSlider from 'component/UI/Content/Slider'
import SingleSlider from 'component/UI/Content/Slider/SingleItem'
import { SiteLinksSearchBoxJsonLd } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import GlobalHomeService from 'service/global/Home.service'
import PageService from 'service/global/Page.service'
import { TYPE_CAROUSEL } from 'src/constant/carousel.constant'
import styles from './styles.module.scss'

const Home = (props) => {
  const [data, setData] = useState([])
  const [content, setContent] = useState([])

  const router = useRouter()

  useEffect(() => {
    getHomeProd()
    getHomeSection()
  }, [])

  const getHomeSection = async () => {
    try {
      const resp = await PageService.getPage(router.pathname)
      setContent(resp.data.data.content)
    } catch (error) {
      console.log(error)
    }
  }

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
                  <SelfCarousel content={content?.['section_1']} />
                </div>
                <div className={styles.mainBanner}>
                  <ImageBlock
                    src={'/slide/banner-small-1.png'}
                    className={styles.banner}
                    alt="..."
                    height="46%"
                    modal
                  />
                  <ImageBlock
                    src={'/slide/banner-small-2.png'}
                    className={styles.banner}
                    alt="..."
                    height="46%"
                    modal
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-6 col-md-3">
            <ImageBlock
              engine
              src={'/public/service/service-1.png'}
              className={styles.serviceBanner}
              alt="..."
              width={'390px'}
              height="52%"
            />
          </div>
          <div className="col-6 col-md-3">
            <ImageBlock
              engine
              src={'/public/service/service-2.png'}
              className={styles.serviceBanner}
              alt="..."
              width={'390px'}
              height="52%"
            />
          </div>
          <div className="col-6 col-md-3">
            <ImageBlock
              engine
              src={'/public/service/service-3.png'}
              className={styles.serviceBanner}
              alt="..."
              width={'390px'}
              height="52%"
            />
          </div>
          <div className="col-6 col-md-3">
            <ImageBlock
              engine
              src={'/public/service/service-4.png'}
              className={styles.serviceBanner}
              alt="..."
              width={'390px'}
              height="52%"
            />
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
                  <CustomSlider type={TYPE_CAROUSEL.MUTI} slidesToShow={5}>
                    {data?.[6]?.child?.map((item, index) => {
                      return (
                        <Card
                          imgSrc={(item.image?.[0]?.src && item.image?.[0]?.src) || ''}
                          cover
                          title={item.title}
                          price={item.price}
                          type={item.type}
                          slug={`/product/${item.slug}`}
                          _id={item._id}
                          key={[Math.random(), item._id, index]}
                          border
                          hover
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

      <section className="container">
        <div className="row">
          <div className="col-12">
            <Heading type="h3" center>
              Khách hàng của Kha Mobile
            </Heading>
          </div>

          <div className="col-12">
            <CustomSlider type={TYPE_CAROUSEL.MUTI}>
              {content?.['section_2']?.data?.map((customer, index) => (
                <ImageBlock
                  src={process.env.API + customer}
                  height={'75%'}
                  width={'100%'}
                  modal
                  key={[Math.random(), customer?._id, index]}
                />
              ))}
            </CustomSlider>
          </div>
        </div>
      </section>

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

const SelfCarousel = ({ content, ...props }) => {
  return (
    <SingleSlider
      placement={'bottom'}
      shape={'bar'}
      className="single-slider"
      autoplayInterval={3000}
      autoplay
      slidesToShow={1}
    >
      {content?.data?.map((item, index) => (
        <img src={process.env.API + item} key={[Math.random(), index]} height={'53%'} width={'100%'} />
      ))}
    </SingleSlider>
  )
}

export const getServerSideProps = async (ctx) => {
  const resp = await GlobalHomeService.getHomeSeo()

  const data = resp.data
  return {
    props: {
      seo: data.seo,
    },
  }
}

export default Home
