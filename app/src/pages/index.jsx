import CommonLayout from 'component/UI/Layout'
import PostHelmet from 'component/PostHelmet'
import ImageBlock from 'component/UI/Content/ImageBlock'
import { LocalBusinessJsonLd, SiteLinksSearchBoxJsonLd } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { GlobalHomeService, PageService } from 'service/global'
import { TYPE_CAROUSEL } from 'src/constant/carousel.constant'
import styles from './styles.module.scss'
import { useCommonStore } from 'src/store'
import { Placeholder } from 'rsuite'
import dynamic from 'next/dynamic'
import clsx from 'clsx'

const SingleSlider = dynamic(() => import('src/component/UI/Content/Slider/SingleItem'), {
  ssr: false,
  loading: () => <Placeholder.Graph active height={412} />,
})
const CustomSlider = dynamic(() => import('src/component/UI/Content/Slider'), {
  ssr: false,
  loading: () => <Placeholder.Graph active height={300} />,
})
const Catalog = dynamic(() => import('src/component/UI/Content/Catalog'), {
  ssr: false,
  loading: () => <Placeholder.Graph active height={400} />,
})
const Heading = dynamic(() => import('src/component/UI/Content/Heading'), {
  ssr: false,
  loading: () => <Placeholder.Graph active height={40} width={200} />,
})
const Card = dynamic(() => import('src/component/UI/Content/Card'), {
  ssr: false,
  loading: () => <Placeholder.Graph active width={350} />,
})

const Home = (props) => {
  // render 4 times
  const [content, setContent] = useState([])

  const { product, productCategory } = useCommonStore((state) => state)

  const router = useRouter()

  useEffect(() => {
    getHomeSection()
  }, [product, productCategory])

  const getHomeSection = async () => {
    try {
      const resp = await PageService.getPage(router.pathname)
      let { content } = resp.data.data
      for (let section of content) {
        // Push product
        if (section.type === 'Product') {
          let listProduct = getProductFromStore(section.data)
          section.data = listProduct
        }
        // Format Category
        else if (section.type === 'ProductCategory') {
          let products = getProductFromStore(section.data)

          let categoryItem = getCategoryFromStore({ name: section.title, products })

          const { name, image, slug } = categoryItem

          const formatCate = {
            name: name,
            image: image?.src,
            slug,
            child: products,
            categories: section?.options?.moreLink,
          }
          section.catalog = formatCate
        }
      }
      setContent(content)
    } catch (error) {
      console.log(error)
    }
  }

  const getProductFromStore = (listProductIds) => {
    const productData = []
    for (let _id of listProductIds) {
      let item = product.find((item) => item._id === _id)
      if (item) {
        productData.push(item)
      }
    }
    return productData
  }

  const getCategoryFromStore = ({ name, products }) => {
    let item = productCategory.find((item) => item.name === name)
    if (item) {
      return item
    }
    return {}
  }

  const getSectionSlider = useMemo(() => {
    let html = null

    if (content) {
      html = (
        <div className={clsx(styles.grid, '!px-[12px]')}>
          <div className={clsx(styles.mainCarouse)}>
            <SelfCarousel content={content?.[0]} />
          </div>
          <div className={styles.mainBanner}>
            {!content?.[1] ? (
              <>
                <Placeholder.Graph active height={200} />
                <Placeholder.Graph active height={200} />
              </>
            ) : (
              content?.[1]?.data.map((banner) => {
                return (
                  <ImageBlock
                    src={banner}
                    className={styles.banner}
                    alt={content?.[1]?.title}
                    modal
                    key={banner}
                    engine
                    priority
                  />
                )
              })
            )}
          </div>
        </div>
      )
    }

    return html
  }, [content])

  const getSectionService = useMemo(() => {
    let html = null

    if (!content[2]) {
      html = (
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <Heading type="h3" center>
              <Placeholder.Graph active height={40} width={200} />
            </Heading>
          </div>

          <div className="sm:col-span-6 md:col-span-3 lg:col-span-6 ">
            <Placeholder.Graph active height={150} />
          </div>
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-6">
            <Placeholder.Graph active height={150} />
          </div>
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-6">
            <Placeholder.Graph active height={150} />
          </div>
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-6">
            <Placeholder.Graph active height={150} />
          </div>
        </div>
      )
    } else {
      html = (
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <Heading type="h3" center>
              Dịch vụ của Kha Mobile
            </Heading>
          </div>

          {content?.[2]?.data.map((banner) => {
            return (
              <div className="col-span-6 sm:col-span-6 md:col-span-3" key={banner}>
                <ImageBlock
                  engine
                  src={banner}
                  className={styles.serviceBanner}
                  width={390}
                  height={200}
                  alt={content?.[2]?.title}
                />
              </div>
            )
          })}
        </div>
      )
    }

    return html
  }, [content])

  const getSectionFeatureProduct = useMemo(() => {
    let html = null
    let productSection = content?.[3]?.data

    if (!productSection) {
      html = (
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <div className="container mx-auto">
              <div className="grid grid-cols-12">
                <div className="col-span-12">
                  <Heading type="h3" center>
                    <Placeholder.Graph active height={40} width={200} />
                  </Heading>
                </div>

                <div className="col-span-12">
                  <CustomSlider type={TYPE_CAROUSEL.MUTI} slidesToShow={5}>
                    <Placeholder.Graph active height={300} />
                    <Placeholder.Graph active height={300} />
                    <Placeholder.Graph active height={300} />
                    <Placeholder.Graph active height={300} />
                    <Placeholder.Graph active height={300} />
                    <Placeholder.Graph active height={300} />
                  </CustomSlider>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      html = (
        <div className="grid grid-cols-12">
          <div className="col-span-12">
            <div className="container  mx-auto px-4">
              <div className="grid grid-cols-12">
                <div className="col-span-12">
                  <Heading type="h3" center>
                    {content?.[3]?.title}
                  </Heading>
                </div>

                <div className="col-span-12">
                  <CustomSlider type={TYPE_CAROUSEL.MUTI} slidesToShow={5}>
                    {productSection?.map((item, index) => {
                      let { image, title, price, type, slug, _id } = item
                      return (
                        <Card
                          imgSrc={(image?.[0]?.src && image?.[0]?.src) || ''}
                          cover
                          title={title}
                          price={price}
                          type={type}
                          slug={`/product/${slug}`}
                          _id={_id}
                          key={[Math.random(), _id, index]}
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
      )
    }

    return html
  }, [content])

  const renderSection = useMemo(
    () => (position) => {
      let html = null
      html = (
        <section className={clsx('container mx-auto animate__animated animate__fadeInUp', styles.section)}>
          <div className="grid grid-cols-12">
            <div className="col-span-12">
              <Heading type="h3" center>
                {content?.[position]?.title}
              </Heading>
            </div>

            <div className="col-span-12">
              <Catalog data={content?.[position]?.catalog} />
            </div>
          </div>
        </section>
      )

      return html
    },
    [content],
  )

  return (
    <>
      <PostHelmet seo={props?.seo}>
        <LocalBusinessJsonLd
          type="Store"
          id="https://khamobile.vn"
          name="Cửa hàng Kha Mobile"
          description="Kha Mobile - Giờ mở cửa"
          url="https://www.google.com/maps/place/Kha+mobile+-+gi%C3%A1+t%E1%BB%91t+m%E1%BB%97i+ng%C3%A0y/@10.7982922,106.7091931,17z/data=!3m1!4b1!4m13!1m7!3m6!1s0x317528affb2334a7:0x9ad5b46a56df7665!2zMjIwLzlBIFjDtCBWaeG6v3QgTmdo4buHIFTEqW5oLCBQaMaw4budbmcgMjEsIELDrG5oIFRo4bqhbmgsIFgrid grid-cols-126BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!3b1!8m2!3d10.798767!4d106.712177!3m4!1s0x317529700ef137cf:0x43ea80c21adbb00e!8m2!3d10.7982869!4d106.7113818?hl=vi-VN"
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
      </PostHelmet>

      <div className="px-4">
        <section
          className="container mx-auto max-w-[100vw]  animate__animated animate__fadeIn"
          style={{
            '--animate-duration': `${0.3}s`,
          }}
        >
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-12">
              <div className="container mx-auto" style={{ background: '#fff', boxShadow: 'var(--main-box-shadow)' }}>
                {getSectionSlider}
              </div>
            </div>
          </div>
        </section>

        <section
          className="container mx-auto animate__animated animate__fadeInUp "
          style={{
            '--animate-duration': `${0.5}s`,
          }}
        >
          {getSectionService}
        </section>

        <section
          className="container mx-auto max-w-[100vw] animate__animated animate__fadeInUp"
          style={{
            '--animate-duration': `${0.7}s`,
          }}
        >
          {getSectionFeatureProduct}
        </section>

        <section
          className="container mx-auto animate__animated animate__fadeInUp"
          style={{
            '--animate-duration': `${0.9}s`,
          }}
        >
          <div className="grid grid-cols-12">
            <div className="col-span-12">
              <Heading type="h3" center>
                Khách hàng của Kha Mobile
              </Heading>
            </div>

            <div className="col-span-12">
              <CustomSlider type={TYPE_CAROUSEL.MUTI}>
                {content?.[4]?.data?.map((customer, index) => (
                  <ImageBlock
                    src={process.env.API + customer}
                    width={400}
                    height={576}
                    loading="lazy"
                    modal
                    key={['customer_slider', customer?._id, index]}
                    alt={content?.[4]?.title}
                    objectFit="cover"
                  />
                ))}
              </CustomSlider>
            </div>
          </div>
        </section>

        {renderSection(5)}
        {renderSection(6)}
        {renderSection(7)}
        {renderSection(8)}
        {renderSection(9)}
      </div>
    </>
  )
}

Home.Layout = CommonLayout

const SelfCarousel = ({ content, ...props }) => {
  if (!content) {
    return <Placeholder.Graph active height={412} />
  }
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
        <ImageBlock
          src={process.env.API + item}
          key={[process.env.API + item, index].join('_')}
          priority
          alt={content?.title}
        />
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
