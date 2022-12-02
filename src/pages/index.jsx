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
const Home = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    getHomeProd()
  }, [])
  const getHomeProd = async () => {
    try {
      let resp = await GlobalHomeService.getHomeProd()
      setData(resp.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  console.log('data', data)
  return (
    <>
      <Head>
        <title>Kha Mobile</title>
      </Head>

      <section className="container-fluid">
        <div className="row gx-2 gy-2">
          <div className="col-12">
            <div className="container" style={{ background: '#fff', boxShadow: 'var(--main-box-shadow)' }}>
              <div className={styles.grid}>
                <div className={styles.mainCarousel}>
                  <SelfCarousel />
                </div>
                <div className={styles.mainBanner}>
                  <ImageBlock src={Homebanner_2.src} className={styles.banner} alt="..." height={'calc(50% - 12px)'} />
                  <ImageBlock src={Homebanner_2.src} className={styles.banner} alt="..." height={'calc(50% - 12px)'} />
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
                          imgSrc={''}
                          cover
                          title={item.title}
                          price={item.price}
                          type={item.type}
                          slug={`/product/${item.slug}`}
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

const SelfCarousel = () => {
  const [images, setImages] = useState([
    {
      itemImageSrc: 'https://khamobile.vn/wp-content/uploads/2022/10/banner-moi-3.png',
      thumbnailImageSrc: 'IPHONE 14 SẴN HÀNG',
    },
    {
      itemImageSrc: 'https://khamobile.vn/wp-content/uploads/2022/10/banner-moi-1.png',
      thumbnailImageSrc: 'IPHONE 13 ProMax',
    },
    {
      itemImageSrc: 'https://khamobile.vn/wp-content/uploads/2022/10/banner-moi-4.png',
      thumbnailImageSrc: 'ĐẠI HỘI THU CŨ ĐỔI MỚI',
    },
    {
      itemImageSrc: 'https://khamobile.vn/wp-content/uploads/2022/10/banner-moi-2.png',
      thumbnailImageSrc: 'MACBOOK M2 GIÁ SỐC',
    },
    {
      itemImageSrc: 'https://khamobile.vn/wp-content/uploads/2022/10/banner-moi-5.png',
      thumbnailImageSrc: 'MACBOOK M2 GIÁ SỐC',
    },
    {
      itemImageSrc: Homebanner_4.src,
      thumbnailImageSrc: 'MACBOOK M2 GIÁ SỐC',
    },
  ])
  return (
    <Carousel placement={'bottom'} shape={'bar'} className="custom-slider" autoplayInterval={3000} autoplay>
      <img src={images[0].itemImageSrc} height="250" />
      <img src={images[1].itemImageSrc} height="250" />
      <img src={images[2].itemImageSrc} height="250" />
      <img src={images[3].itemImageSrc} height="250" />
      <img src={images[4].itemImageSrc} height="250" />
    </Carousel>
  )
  return (
    <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active" data-bs-interval="10000">
          <img src={images[0].itemImageSrc} className="d-block w-100" alt="..." />
        </div>
        <div className="carousel-item" data-bs-interval="2000">
          <img src={images[1].itemImageSrc} className="d-block w-100" alt="..." />
        </div>
        <div className="carousel-item">
          <img src={images[2].itemImageSrc} className="d-block w-100" alt="..." />
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleDark"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleDark"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}

export default Home
