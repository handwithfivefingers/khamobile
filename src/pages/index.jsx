import Card from 'component/UI/Content/Card'
import Heading from 'component/UI/Content/Heading'
import CommonLayout from 'component/UI/Layout'
import PostHelmet from 'component/PostHelmet'
import Catalog from 'component/UI/Content/Catalog'
import ImageBlock from 'component/UI/Content/ImageBlock'
import CustomSlider from 'component/UI/Content/Slider'
import SingleSlider from 'component/UI/Content/Slider/SingleItem'
import { LocalBusinessJsonLd, SiteLinksSearchBoxJsonLd } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GlobalHomeService, PageService } from 'service/global'
import { TYPE_CAROUSEL } from 'src/constant/carousel.constant'
import styles from './styles.module.scss'
import { useCommonStore } from 'src/store'

const Home = (props) => {
  const [data, setData] = useState([])
  const [content, setContent] = useState([])
  const { product } = useCommonStore((state) => state)

  const [section, setSection] = useState({})
  const router = useRouter()
  useEffect(() => {
    getHomeProd()
    getHomeSection()
  }, [])

  useEffect(() => {
    if (product.length && content) {
      getProductInformation()
    }
  }, [product, content])

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

  const getProductInformation = () => {
    let productSection = content?.['section_4']?.data
    const productData = []
    for (let _id of productSection) {
      let item = product.find((item) => item._id === _id)
      if (item) {
        productData.push(item)
      }
    }

    setSection((prev) => ({ ...prev, section_4: productData }))
  }

  return (
    <>
      <PostHelmet seo={props?.seo} />
      <LocalBusinessJsonLd
        type="Store"
        id="https://khamobile.vn"
        name="Cửa hàng Kha Mobile"
        description="Dave's latest department store in San Jose, now open"
        url="https://www.google.com/maps/place/Kha+mobile+-+gi%C3%A1+t%E1%BB%91t+m%E1%BB%97i+ng%C3%A0y/@10.7982922,106.7091931,17z/data=!3m1!4b1!4m13!1m7!3m6!1s0x317528affb2334a7:0x9ad5b46a56df7665!2zMjIwLzlBIFjDtCBWaeG6v3QgTmdo4buHIFTEqW5oLCBQaMaw4budbmcgMjEsIELDrG5oIFRo4bqhbmgsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!3b1!8m2!3d10.798767!4d106.712177!3m4!1s0x317529700ef137cf:0x43ea80c21adbb00e!8m2!3d10.7982869!4d106.7113818?hl=vi-VN"
        telephone="+14088717984"
        address={{
          streetAddress: '220/9A Xô Viết Nghệ Tĩnh',
          addressLocality: 'Phường 21, Quận Bình Thạnh',
          addressRegion: 'Thành Phố Hồ Chí Minh',
          postalCode: '717455',
          addressCountry: 'Việt Nam',
        }}
        geo={{
          latitude: '10.798315590322954',
          longitude: '106.71140159606115',
        }}
        images={[
          'https://lh3.ggpht.com/p/AF1QipO_ysrKjenYzUaRajImQuUplPx06qrNJXucUjzI=s512',
          'https://lh5.googleusercontent.com/p/AF1QipNa-FmkR6eBswQOBRrHhQxt-VCr8ZOxHcov_u8r=s406-k-no',
        ]}
        openingHours={[
          {
            opens: '09:00',
            closes: '21:30',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          },
        ]}
        rating={{
          ratingValue: '5',
          ratingCount: '6',
        }}
        review={[
          {
            author: 'Ngoc Duong',
            datePublished: '20022-12-04',
            name: 'A masterpiece of literature',
            reviewBody: 'cam thay ok , qua day mua yen tam , se ung ho tiep',
            reviewRating: {
              bestRating: '5',
              worstRating: '1',
              reviewAspect: 'Ambiance',
              ratingValue: '4',
            },
          },
        ]}
      />
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
                  {content?.['section_2']?.data.map((banner) => {
                    return (
                      <ImageBlock
                        src={banner}
                        className={styles.banner}
                        alt="..."
                        height="46%"
                        modal
                        key={banner}
                        engine
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          {content?.['section_3']?.data.map((banner) => {
            return (
              <div className="col-6 col-md-3" key={banner}>
                <ImageBlock
                  engine
                  src={banner}
                  className={styles.serviceBanner}
                  alt="..."
                  width={'390px'}
                  height="52%"
                />
              </div>
            )
          })}
        </div>
      </section>

      <section className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <Heading type="h3" center>
                    {/* {data?.[6]?.name} */}
                    {/* Sản Phẩm Nổi Bật */}
                    {content?.['section_4']?.title}
                  </Heading>
                </div>

                <div className="col-12">
                  <CustomSlider type={TYPE_CAROUSEL.MUTI} slidesToShow={5}>
                    {/* {data?.[6]?.child?.map((item, index) => {
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
                    })} */}
                    {section?.['section_4']?.map((item, index) => {
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
              {content?.['section_5']?.data?.map((customer, index) => (
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
